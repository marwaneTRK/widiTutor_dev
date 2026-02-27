export const PLAN_STORAGE_KEY = "widi_plan";
export const PAYMENT_REQUIRED_KEY = "widi_payment_required";

const VALID_PLANS = new Set(["free", "basic", "pro"]);

export const normalizePlan = (value) => {
  const plan = String(value || "").toLowerCase();
  return VALID_PLANS.has(plan) ? plan : "free";
};

export const isPaidPlan = (plan) => {
  const normalized = normalizePlan(plan);
  return normalized === "basic" || normalized === "pro";
};

export const setSelectedPlan = (plan) => {
  localStorage.setItem(PLAN_STORAGE_KEY, normalizePlan(plan));
};

export const getSelectedPlan = () => normalizePlan(localStorage.getItem(PLAN_STORAGE_KEY));

export const setPaymentRequired = (required) => {
  localStorage.setItem(PAYMENT_REQUIRED_KEY, JSON.stringify(Boolean(required)));
};

export const isPaymentRequired = () => {
  try {
    return JSON.parse(localStorage.getItem(PAYMENT_REQUIRED_KEY) || "false") === true;
  } catch {
    return false;
  }
};

