import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { setAuthToken } from "../utils/auth";
import {
  getGoogleAuthUrl,
  loginUser,
  registerUser,
} from "../services/authService";
import { extractApiError } from "../services/http";
import {
  getSelectedPlan,
  isPaidPlan,
  isPaymentRequired,
  setPaymentRequired,
  setSelectedPlan,
} from "../utils/plan";
import logo from "../assets/logo.svg";
import widiLookingIcon from "../assets/widi_looking_icon.svg";
import widiSleepingIcon from "../assets/widi_sleeping.svg";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const isMascotSleeping =
    isPasswordFocused || isPasswordHovered || form.password.trim().length > 0;

  useEffect(() => {
    const planFromUrl = searchParams.get("plan");
    if (planFromUrl) {
      const normalized = planFromUrl.toLowerCase();
      setSelectedPlan(normalized);
      setPaymentRequired(isPaidPlan(normalized));
    }

    if (searchParams.get("verified") === "1") {
      setMessage("Email verified successfully. You can now log in.");
      setMessageType("success");
    }

    if (searchParams.get("error")) {
      setMessage("Google sign-in failed. Please try again.");
      setMessageType("error");
    }
  }, [searchParams]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const { response, data } = await registerUser(form);
      setMessage(extractApiError(data, "Registration request completed."));
      setMessageType(response.ok ? "success" : "error");
      if (response.ok) {
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error registering");
      setMessageType("error");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { response, data } = await loginUser({
        email: form.email,
        password: form.password,
      });
      setMessage(extractApiError(data, "Login request completed."));
      setMessageType(response.ok ? "success" : "error");
      if (response.ok && data?.token) {
        setAuthToken(data.token);
        const selectedPlan = getSelectedPlan();
        if (isPaidPlan(selectedPlan) && isPaymentRequired()) {
          navigate(`/billing?plan=${encodeURIComponent(selectedPlan)}`);
          return;
        }
        navigate("/welcome");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error logging in");
      setMessageType("error");
    }
  };

  return (
    <div className="flex h-screen min-h-[600px]">
      <div className="relative isolate hidden flex-[0_0_48%] items-center justify-center overflow-hidden bg-[#ececec] md:flex">
        <img
          src={isMascotSleeping ? widiSleepingIcon : widiLookingIcon}
          alt="Widi mascot"
          className="relative z-10 max-h-[70%] w-auto object-contain transition-all duration-200"
        />
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-[47%] w-full bg-[#ececec]/72 backdrop-blur-sm" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center bg-white px-8 py-12">
        <div className="absolute right-7 top-6">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        <div className="w-full max-w-[380px]">
          <h1 className="mb-1.5 text-center text-[28px] font-bold tracking-tight text-gray-900">
            {isLogin ? "Welcome back!" : "Sign up for an account"}
          </h1>
          <p className="mb-7 text-center text-sm text-gray-400">
            {isLogin
              ? "Login to continue your AI journey."
              : "Build smarter skills with AI."}
          </p>

          <button
            type="button"
            onClick={() => (window.location.href = getGoogleAuthUrl())}
            className="mb-5 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-gray-700 transition-all hover:-translate-y-px hover:border-gray-400 hover:shadow-sm"
          >
            <FcGoogle size={22} />
            Sign Up With Google
          </button>

          <div className="mb-5 flex items-center gap-3 text-xs text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            Or With Email
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-2.5"
          >
            {!isLogin && (
              <div className="flex gap-2.5">
                <input
                  name="name"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20"
                />
              </div>
            )}

            <input
              name="email"
              type="email"
              placeholder="name@host.com"
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onMouseEnter={() => setIsPasswordHovered(true)}
                onMouseLeave={() => setIsPasswordHovered(false)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 pr-11 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-300 focus:border-[#3ecf3e] focus:bg-white focus:ring-2 focus:ring-[#3ecf3e]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            {!isLogin && (
              <p className="pt-1 text-xs leading-relaxed text-gray-400">
                By creating an account you agreeing to our{" "}
                <a
                  href="#"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            )}

            <button
              type="submit"
              className="mt-1 w-full cursor-pointer rounded-xl bg-gray-900 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-gray-700 hover:shadow-lg active:translate-y-0"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {isLogin && (
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="cursor-pointer text-sm text-gray-500 transition-colors hover:text-[#3ecf3e]"
              >
                Forgot password?
              </button>
            </div>
          )}

          {message && (
            <div
              className={`mt-4 rounded-xl px-4 py-2.5 text-center text-sm font-medium ${
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

          <p className="mt-5 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account ?" : "Already have an account ?"}{" "}
            <button
              onClick={() => {
                setIsLogin((prev) => !prev);
                setMessage("");
              }}
              className="cursor-pointer font-semibold text-gray-900 transition-colors hover:text-[#3ecf3e]"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>

        <p className="absolute bottom-4 right-6 text-[11px] text-gray-300">
          Copyright 2026
        </p>
      </div>
    </div>
  );
}
