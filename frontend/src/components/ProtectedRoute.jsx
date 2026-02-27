import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { clearAuthToken, getAuthToken, setAuthToken } from "../utils/auth";
import { fetchCurrentUser } from "../services/authService";
import { getSelectedPlan, isPaidPlan, isPaymentRequired } from "../utils/plan";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(null);

  const tokenFromQuery = useMemo(
    () => new URLSearchParams(location.search).get("token"),
    [location.search]
  );
  const tokenInStorage = getAuthToken();
  const effectiveToken = tokenFromQuery || tokenInStorage;

  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      if (!effectiveToken) {
        if (isMounted) {
          setIsValidToken(false);
        }
        return;
      }

      if (tokenFromQuery) {
        setAuthToken(tokenFromQuery);
      }

      try {
        const { response } = await fetchCurrentUser(effectiveToken);

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          clearAuthToken();
          setIsValidToken(false);
          return;
        }

        setIsValidToken(true);
        if (tokenFromQuery) {
          navigate(location.pathname, { replace: true });
        }
      } catch {
        if (!isMounted) {
          return;
        }
        clearAuthToken();
        setIsValidToken(false);
      }
    };

    validate();

    return () => {
      isMounted = false;
    };
  }, [effectiveToken, location.pathname, navigate, tokenFromQuery]);

  if (isValidToken === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf3ef] text-sm text-[#4f6257]">
        Checking session...
      </div>
    );
  }

  if (!isValidToken) {
    return <Navigate to="/" replace />;
  }

  const selectedPlan = getSelectedPlan();
  const blockedByBilling = isPaidPlan(selectedPlan) && isPaymentRequired() && location.pathname !== "/billing";
  if (blockedByBilling) {
    return <Navigate to={`/billing?plan=${encodeURIComponent(selectedPlan)}`} replace />;
  }

  return children;
}
