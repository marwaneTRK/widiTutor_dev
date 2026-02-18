import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearAuthToken, getAuthToken, setAuthToken } from "../utils/auth";

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setAuthToken(urlToken);
      navigate("/welcome", { replace: true });
      return;
    }

    if (!getAuthToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate, searchParams]);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="mt-2">You are authenticated.</p>
        <button className="btn btn-secondary mt-4" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
