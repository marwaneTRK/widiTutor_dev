import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword as resetPasswordRequest } from "../services/authService";
import { extractApiError } from "../services/http";
import logo from "../assets/logo.svg";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Missing reset token.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    try {
      const { response, data } = await resetPasswordRequest({ token, newPassword });
      setMessage(extractApiError(data, "Password has been reset successfully."));
      setMessageType(response.ok ? "success" : "error");
      if (response.ok) {
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to reset password. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7f2] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e7f4df] bg-white p-8 shadow-lg">
        <div className="mb-5 flex justify-center">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>
        <h1 className="text-center text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Enter your new password to complete the reset.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            minLength={8}
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300 focus:border-[#5DD62C] focus:bg-white focus:ring-2 focus:ring-[#5DD62C]/20"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            minLength={8}
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300 focus:border-[#5DD62C] focus:bg-white focus:ring-2 focus:ring-[#5DD62C]/20"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#5DD62C] py-3 text-sm font-semibold text-white transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 rounded-xl px-4 py-2.5 text-center text-sm font-medium ${
              messageType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-gray-700 hover:text-[#5DD62C]"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
