import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import logo from "../assets/logo.png";

/* ── Brand logos (react-icons) ── */
import { FaApple, FaWindows } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

export default function TestHome() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white dark:bg-neutral-950 overflow-hidden">

      {/* ── Grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Top banner: Prove Your Progress ── */}
      <div className="relative z-10 flex items-start justify-between px-6 pt-5 pb-3">
        {/* Left text */}
        <div>
          <h2 className="text-[17px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Prove Your Progress!
          </h2>
          <p className="text-[12.5px] text-gray-500 dark:text-gray-400 mt-0.5 max-w-xs">
            Turn video insights into mastery. Test your skills, and listen to Widitutor.
          </p>
        </div>

        {/* Right decorative shapes */}
        <div className="relative w-28 h-16 flex-shrink-0 mr-2">
          {/* Green triangle */}
          <div
            className="absolute top-0 right-8 w-10 h-12"
            style={{
              background: "linear-gradient(135deg, #4ade80, #16a34a)",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              transform: "rotate(-10deg)",
            }}
          />
          {/* Gray shape */}
          <div
            className="absolute top-1 right-2 w-8 h-10"
            style={{
              background: "#9ca3af",
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              transform: "rotate(8deg)",
            }}
          />
          {/* Dark shape */}
          <div
            className="absolute top-3 right-14 w-6 h-8"
            style={{
              background: "#1f2937",
              clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)",
              transform: "rotate(-5deg)",
            }}
          />
        </div>
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-10 pb-6">

        {/* Avatars + badge */}
        <div className="flex items-center gap-2 mb-6 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full px-3 py-1.5 shadow-sm">
          {/* Stacked avatars */}
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white dark:border-neutral-900 flex items-center justify-center">
              <img src={logo} alt="" className="w-4 h-4 object-contain" />
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-neutral-900" />
          </div>
          <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-tight max-w-[160px] text-left">
            Join us and discover how to use the platform
          </p>
        </div>

        {/* Main heading */}
        <h1 className="text-[32px] sm:text-[40px] font-extrabold text-gray-900 dark:text-gray-100 leading-tight tracking-tight max-w-lg">
          Keep Learning With{" "}
          <span className="text-green-500">AI</span>{" "}
          Together.
          <br />
          Choose Your Video You Like{" "}
          {/* YouTube inline icon */}
          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg align-middle mx-1">
            <FaYoutube className="text-white" size={18} />
          </span>
          <br />
          &amp; Start Learning{" "}
          <span className="text-gray-900 dark:text-gray-100">✦</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-[13.5px] text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
          Our platform allows you to learn directly through our integrated YouTube
          browser or by pasting links to your preferred videos. To accelerate your
          progress, you can chat with mimAi, our dedicated assistant bot designed to
          help you learn faster.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 mt-7">
          <button
            onClick={() => navigate("/authLast")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-150 shadow-md"
          >
            <Settings size={14} className="animate-spin-slow" />
            Start Learning Now
          </button>
          <button
            onClick={() => navigate("/authLast")}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline underline-offset-2 transition-colors"
          >
            Try for free
          </button>
        </div>
      </div>

      {/* ── Mascot + Trusted banner ── */}
      <div className="relative z-10 mt-4">

        {/* Diagonal green trust banner */}
        <div className="relative overflow-hidden">
          <div
            className="absolute left-0 bottom-0 w-48 h-10 bg-green-400 flex items-center pl-4"
            style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 0 100%)" }}
          >
            <span className="text-[11px] font-semibold text-white whitespace-nowrap">
              Trusted by the greatest
            </span>
          </div>

          {/* Mascot */}
          <div className="absolute left-6 -top-10 z-20">
            <img src={logo} alt="WidiTutor mascot" className="h-16 w-auto" />
          </div>

          {/* Brand logos row */}
          <div className="flex items-center justify-center gap-8 px-6 py-4 pt-6 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-t border-gray-100 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <FaApple size={18} />
              <span className="text-[13px] font-semibold">Apple</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <FaYoutube size={18} className="text-red-600" />
              <span className="text-[13px] font-semibold">YouTube</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <FaGoogle size={16} className="text-blue-500" />
              <span className="text-[13px] font-semibold">Google</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <FaWindows size={16} className="text-blue-600" />
              <span className="text-[13px] font-semibold">Windows</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="relative z-10 text-right px-6 py-2">
        <span className="text-[11px] text-gray-400 dark:text-neutral-600">
          Copyright 2026
        </span>
      </div>

    </div>
  );
}