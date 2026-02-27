import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getAuthToken } from "../utils/auth";
import {
  createEmbeddedSession,
  finalizeBillingSession,
  getSubscriptionStatus,
} from "../services/billingService";
import { getSelectedPlan, isPaidPlan, setPaymentRequired, setSelectedPlan } from "../utils/plan";

const planMeta = {
  basic: { title: "Basic Plan", subtitle: "$7 / month" },
  pro: { title: "Pro Plan", subtitle: "$70 / year" },
};

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function Billing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("");

  const selectedPlan = useMemo(() => {
    const planFromQuery = searchParams.get("plan");
    return planFromQuery ? planFromQuery.toLowerCase() : getSelectedPlan();
  }, [searchParams]);

  useEffect(() => {
    setSelectedPlan(selectedPlan);
    if (!isPaidPlan(selectedPlan)) {
      setPaymentRequired(false);
      navigate("/welcome", { replace: true });
    }
  }, [navigate, selectedPlan]);

  if (!isPaidPlan(selectedPlan)) {
    return null;
  }

  if (!publishableKey || !stripePromise) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-6">
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-6 text-center">
          <h1 className="text-xl font-bold text-red-700">Stripe config missing</h1>
          <p className="mt-2 text-sm text-red-600">
            Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in <code>frontend/.env</code>.
          </p>
        </div>
      </div>
    );
  }

  const fetchClientSecret = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate(`/auth?plan=${encodeURIComponent(selectedPlan)}`, { replace: true });
      throw new Error("Authentication required.");
    }

    const sub = await getSubscriptionStatus({ token });
    if (sub?.subscriptionStatus === "active") {
      setPaymentRequired(false);
      navigate("/welcome", { replace: true });
      throw new Error("Subscription already active.");
    }

    const session = await createEmbeddedSession({ token, plan: selectedPlan });
    if (!session?.clientSecret) {
      throw new Error("Missing embedded checkout client secret.");
    }
    return session.clientSecret;
  };

  useEffect(() => {
    const status = searchParams.get("status");
    if (status !== "success") {
      return;
    }

    const token = getAuthToken();
    const sessionId = searchParams.get("session_id");
    if (!token) {
      navigate(`/auth?plan=${encodeURIComponent(selectedPlan)}`, { replace: true });
      return;
    }

    const finalize = async () => {
      try {
        setStatusMessage("Finalizing your membership...");
        if (sessionId) {
          await finalizeBillingSession({ token, sessionId });
        } else {
          const sub = await getSubscriptionStatus({ token });
          if (!(sub?.subscriptionStatus === "active" || sub?.subscriptionStatus === "trialing")) {
            throw new Error("Subscription confirmation is still pending.");
          }
        }
        setPaymentRequired(false);
        navigate("/welcome?stripe=success", { replace: true });
      } catch (error) {
        setStatusMessage(error.message || "We received your payment. Please wait a few seconds and refresh.");
      }
    };

    finalize();
  }, [navigate, searchParams, selectedPlan]);

  const planText = planMeta[selectedPlan] || { title: "Plan", subtitle: "" };

  return (
    <div className="min-h-screen bg-[#f7faf8] px-4 py-10 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complete your payment</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {planText.title} - {planText.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-900"
          >
            Back
          </button>
        </div>

        <div className="rounded-2xl border border-[#dceae2] bg-white p-4 shadow-sm dark:border-[#1a3a24] dark:bg-[#0d1a11]">
          {statusMessage && (
            <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
              {statusMessage}
            </div>
          )}
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              fetchClientSecret,
              onComplete: () => {
                setStatusMessage("Payment submitted. Finalizing...");
              },
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
