import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAuthToken();
  const tokenFromQuery = new URLSearchParams(location.search).get("token");

  if (!token && !tokenFromQuery) {
    return <Navigate to="/" replace />;
  }

  return children;
}
