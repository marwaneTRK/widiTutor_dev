import { extractApiError, requestJson } from "./http";

export const createCheckoutSession = async ({ token, priceId, mode = "subscription", successUrl, cancelUrl }) => {
  const { response, data } = await requestJson("/api/billing/create-checkout-session", {
    method: "POST",
    token,
    body: { priceId, mode, successUrl, cancelUrl },
  });

  if (!response.ok) {
    throw new Error(extractApiError(data, "Unable to create Stripe checkout session."));
  }

  return data;
};

export const getSubscriptionStatus = async ({ token }) => {
  const { response, data } = await requestJson("/api/billing/subscription-status", {
    method: "GET",
    token,
  });

  if (!response.ok) {
    throw new Error(extractApiError(data, "Unable to fetch subscription status."));
  }

  return data;
};

export const createEmbeddedSession = async ({ token, plan, priceId }) => {
  const { response, data } = await requestJson("/api/billing/create-embedded-session", {
    method: "POST",
    token,
    body: { plan, priceId },
  });

  if (!response.ok) {
    throw new Error(extractApiError(data, "Unable to initialize embedded checkout."));
  }

  return data;
};

export const finalizeBillingSession = async ({ token, sessionId }) => {
  const { response, data } = await requestJson("/api/billing/finalize-session", {
    method: "POST",
    token,
    body: { sessionId },
  });

  if (!response.ok) {
    throw new Error(extractApiError(data, "Unable to finalize Stripe session."));
  }

  return data;
};
