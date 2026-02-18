import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { setAuthToken } from "../utils/auth";
import logo from "../assets/logo.svg";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      setMessage("Email verified successfully. You can now log in.");
      setMessageType("success");
    }

    if (searchParams.get("error")) {
      setMessage("Google sign-in failed. Please try again.");
      setMessageType("error");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);
      setMessageType(res.ok ? "success" : "error");
      if (res.ok) setIsLogin(true);
    } catch (err) {
      console.error(err);
      setMessage("Error registering");
      setMessageType("error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      setMessage(data.message || "Logged in successfully");
      setMessageType(res.ok ? "success" : "error");
      if (res.ok && data.token) {
        setAuthToken(data.token);
        navigate("/welcome");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error logging in");
      setMessageType("error");
    }
  };

  return (
    <div className="flex h-screen min-h-[600px]">
      {/* ╔══════════════════════════╗
          ║   DIV 1 — LEFT PANEL    ║
          ║   → Marwan's work       ║
          ╚══════════════════════════╝ */}
      <div className="hidden md:flex flex-[0_0_48%] bg-[#ececec] items-center justify-center">
        {/* Marwan plugs his mascot / branding here */}
      </div>

      {/* ╔══════════════════════════╗
          ║  DIV 2 — RIGHT PANEL    ║
          ║  → Form                 ║
          ╚══════════════════════════╝ */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12 relative">
        {/* ── Logo top-right ── */}
        <div className="absolute top-6 right-7">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        <div className="w-full max-w-[380px]">
          {/* ── Heading ── */}
          <h1 className="text-[28px] font-bold text-gray-900 text-center tracking-tight mb-1.5">
            {isLogin ? "Welcome back!" : "Sign up for an account"}
          </h1>
          <p className="text-center text-sm text-gray-400 mb-7">
            {isLogin
              ? "Login to continue your AI journey."
              : "Build smarter skills with AI."}
          </p>

          {/* ── Google OAuth button ── */}
          <button
            type="button"
            onClick={() =>
              (window.location.href = `${API_URL}/api/auth/google`)
            }
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-[14px] font-medium text-gray-700 bg-white hover:border-gray-400 hover:shadow-sm hover:-translate-y-px transition-all cursor-pointer mb-5"
          >
            <FcGoogle size={22} />
            Sign Up With Google
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
            <span className="flex-1 h-px bg-gray-200" />
            Or With Email
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── Form ── */}
          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-2.5"
          >
            {/* Name row — Register only */}
            {!isLogin && (
              <div className="flex gap-2.5">
                <input
                  name="name"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                  className="flex-1 px-3.5 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 outline-none placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20 transition-all"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                  className="flex-1 px-3.5 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 outline-none placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20 transition-all"
                />
              </div>
            )}

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="name@host.com"
              onChange={handleChange}
              required
              className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 outline-none placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20 transition-all"
            />

            {/* Password + show/hide toggle */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full px-3.5 py-3 pr-11 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 outline-none placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            {/* Privacy — Register only */}
            {!isLogin && (
              <p className="text-xs text-gray-400 leading-relaxed pt-1">
                By creating an account you agreeing to our{" "}
                <a
                  href="#"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 mt-1 bg-gray-900 hover:bg-gray-700 text-white text-[15px] font-semibold rounded-xl transition-all hover:-translate-y-px hover:shadow-lg active:translate-y-0 cursor-pointer"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* ── Feedback message ── */}
          {message && (
            <div
              className={`mt-4 px-4 py-2.5 rounded-xl text-sm font-medium text-center ${
                messageType === "success"
                  ? "bg-green-50 text-green-800"
                  : messageType === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-blue-50 text-blue-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* ── Toggle Login ↔ Register ── */}
          <p className="text-center mt-5 text-sm text-gray-400">
            {isLogin ? "Don't have an account ?" : "Already have an account ?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="text-gray-900 font-semibold hover:text-[#3ecf3e] transition-colors cursor-pointer"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>

        {/* Copyright */}
        <p className="absolute bottom-4 right-6 text-[11px] text-gray-300">
          © Copyright 2026
        </p>
      </div>
    </div>
  );
}
