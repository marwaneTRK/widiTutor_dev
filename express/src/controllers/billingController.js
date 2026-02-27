const User = require("../model/User");
const { getStripeClient } = require("../config/stripe");

function resolveClientUrl() {
  return process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:3000";
}

function resolvePriceIdByPlan(plan) {
  const normalized = String(plan || "").toLowerCase();
  if (normalized === "basic") {
    return process.env.STRIPE_PRICE_BASIC_MONTHLY || process.env.STRIPE_PRICE_PRO_MONTHLY || null;
  }
  if (normalized === "pro") {
    return process.env.STRIPE_PRICE_PRO_YEARLY || null;
  }
  return null;
}

function resolvePlanByPriceId(priceId) {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRICE_BASIC_MONTHLY) return "basic";
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) return "pro";
  return "pro";
}

function addMonths(date, count) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + count);
  return next;
}

function addYears(date, count) {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + count);
  return next;
}

function getPlanFallbackPeriodEnd(plan, baseDate = new Date()) {
  const normalized = String(plan || "").toLowerCase();
  if (normalized === "basic") {
    return addMonths(baseDate, 1);
  }
  if (normalized === "pro") {
    return addYears(baseDate, 1);
  }
  return null;
}

function resolveSubscriptionPeriodEnd(subscription, plan) {
  const directPeriodEnd = subscription?.current_period_end;
  if (directPeriodEnd) {
    return new Date(directPeriodEnd * 1000);
  }

  const interval = subscription?.items?.data?.[0]?.price?.recurring?.interval;
  const anchorTs = subscription?.current_period_start || subscription?.start_date;
  const anchorDate = anchorTs ? new Date(anchorTs * 1000) : new Date();

  if (interval === "year") {
    return addYears(anchorDate, 1);
  }
  if (interval === "month") {
    return addMonths(anchorDate, 1);
  }

  return getPlanFallbackPeriodEnd(plan, anchorDate);
}

async function getOrCreateStripeCustomer(user) {
  const stripe = getStripeClient();

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: [user.name, user.lastName].filter(Boolean).join(" ").trim() || user.name,
    metadata: { userId: String(user._id) },
  });

  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id;
}

async function createCheckoutSession(req, res) {
  try {
    const { priceId, plan, mode = "subscription", successUrl, cancelUrl } = req.body || {};
    const resolvedPriceId = priceId || resolvePriceIdByPlan(plan);
    if (!resolvedPriceId) {
      return res.status(400).json({ message: "priceId or valid plan is required." });
    }
    if (!["payment", "subscription"].includes(mode)) {
      return res.status(400).json({ message: "mode must be 'payment' or 'subscription'." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const stripe = getStripeClient();
    const customerId = await getOrCreateStripeCustomer(user);
    const baseUrl = resolveClientUrl();

    const session = await stripe.checkout.sessions.create({
      mode,
      customer: customerId,
      client_reference_id: String(user._id),
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: successUrl || `${baseUrl}/welcome?stripe=success`,
      cancel_url: cancelUrl || `${baseUrl}/welcome?stripe=cancel`,
      allow_promotion_codes: true,
      metadata: {
        userId: String(user._id),
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create checkout session." });
  }
}

async function createEmbeddedSession(req, res) {
  try {
    const { plan, priceId } = req.body || {};
    const resolvedPriceId = priceId || resolvePriceIdByPlan(plan);
    if (!resolvedPriceId) {
      return res.status(400).json({ message: "A paid plan or valid priceId is required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const stripe = getStripeClient();
    const customerId = await getOrCreateStripeCustomer(user);
    const baseUrl = resolveClientUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ui_mode: "embedded",
      customer: customerId,
      client_reference_id: String(user._id),
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      return_url: `${baseUrl}/billing?plan=${encodeURIComponent(
        String(plan || "")
      )}&status=success&session_id={CHECKOUT_SESSION_ID}`,
      allow_promotion_codes: true,
      metadata: {
        userId: String(user._id),
        plan: String(plan || ""),
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      clientSecret: session.client_secret,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create embedded Stripe session." });
  }
}

async function updateUserFromSubscription(user, subscription, fallbackPlan = null) {
  user.stripeSubscriptionId = subscription?.id || user.stripeSubscriptionId;
  user.subscriptionStatus = subscription?.status || "inactive";
  const priceId = subscription?.items?.data?.[0]?.price?.id || null;
  const resolvedPlan =
    fallbackPlan || resolvePlanByPriceId(priceId) || user.subscriptionPlan || "free";
  user.subscriptionPlan = resolvedPlan;
  user.subscriptionCurrentPeriodEnd = resolveSubscriptionPeriodEnd(subscription, resolvedPlan);
  await user.save();
}

async function handleCheckoutCompleted(event) {
  const stripe = getStripeClient();
  const session = event.data.object;
  const userId = session?.metadata?.userId || session?.client_reference_id;
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  if (session.customer && !user.stripeCustomerId) {
    user.stripeCustomerId = session.customer;
  }

  if (session.mode === "subscription" && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const paidPlan = String(session?.metadata?.plan || "").toLowerCase();
    await updateUserFromSubscription(user, subscription, paidPlan || null);
    return;
  }

  if (session.mode === "payment") {
    user.subscriptionStatus = "active";
    const paidPlan = String(session?.metadata?.plan || "").toLowerCase();
    user.subscriptionPlan = paidPlan === "pro" ? "pro" : "basic";
    user.subscriptionCurrentPeriodEnd = getPlanFallbackPeriodEnd(user.subscriptionPlan, new Date());
    await user.save();
  }
}

async function handleSubscriptionUpdated(event) {
  const subscription = event.data.object;
  const customerId = subscription?.customer;
  if (!customerId) return;

  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  await updateUserFromSubscription(user, subscription);
}

async function handleSubscriptionDeleted(event) {
  const subscription = event.data.object;
  const customerId = subscription?.customer;
  if (!customerId) return;

  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  user.subscriptionStatus = "canceled";
  user.subscriptionPlan = "free";
  user.subscriptionCurrentPeriodEnd = null;
  user.stripeSubscriptionId = null;
  await user.save();
}

async function webhook(req, res) {
  const signature = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "STRIPE_WEBHOOK_SECRET is not configured." });
  }

  let event;
  try {
    event = getStripeClient().webhooks.constructEvent(req.body, signature, secret);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.created":
        await handleSubscriptionUpdated(event);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
        break;
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || "Webhook handler failed." });
  }

  return res.status(200).json({ received: true });
}

async function getSubscriptionStatus(req, res) {
  try {
    const user = await User.findById(req.user.id).select(
      "subscriptionStatus subscriptionPlan subscriptionCurrentPeriodEnd stripeCustomerId stripeSubscriptionId"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({
      subscriptionStatus: user.subscriptionStatus || "inactive",
      subscriptionPlan: user.subscriptionPlan || "free",
      subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch subscription status." });
  }
}

async function finalizeCheckoutSession(req, res) {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "line_items.data.price"],
    });

    const sessionUserId =
      String(session?.metadata?.userId || "") || String(session?.client_reference_id || "");
    if (!sessionUserId || sessionUserId !== String(user._id)) {
      return res.status(403).json({ message: "This Stripe session does not belong to the authenticated user." });
    }

    if (session.customer && !user.stripeCustomerId) {
      user.stripeCustomerId = session.customer;
      await user.save();
    }

    if (session.mode !== "subscription") {
      return res.status(400).json({ message: "Only subscription sessions are supported." });
    }

    const subscription =
      typeof session.subscription === "object" && session.subscription
        ? session.subscription
        : await stripe.subscriptions.retrieve(session.subscription);

    const metadataPlan = String(session?.metadata?.plan || "").toLowerCase();
    const fallbackPlan = metadataPlan === "basic" || metadataPlan === "pro" ? metadataPlan : null;
    await updateUserFromSubscription(user, subscription, fallbackPlan);

    return res.status(200).json({
      message: "Membership finalized successfully.",
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to finalize Stripe session." });
  }
}

module.exports = {
  createCheckoutSession,
  createEmbeddedSession,
  webhook,
  getSubscriptionStatus,
  finalizeCheckoutSession,
};
