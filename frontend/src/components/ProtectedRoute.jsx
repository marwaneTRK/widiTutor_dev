import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { clearAuthToken, getAuthToken, setAuthToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${effectiveToken}`,
          },
        });

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
      } catch (error) {
        if (!isMounted) {
          return;
        }
        clearAuthToken();
        setIsValidToken(false);
      }
    };

    setIsValidToken(null);
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

  return children;
}
