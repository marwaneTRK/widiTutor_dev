import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
export default App;
