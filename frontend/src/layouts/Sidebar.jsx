import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import tutor from "../Images/White-images/chat-section-white/tutorchat_icon.svg"; 
import { ListVideo, HelpCircle, Zap, Settings, Sun, Moon, LogOut } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";

const NAV_ITEMS = [
  { label: "My List",  icon: ListVideo,  to: "/list" },
  { label: "Quizzes",  icon: HelpCircle, to: "/quizzes" },
  { label: "Upgrade",  icon: Zap,        to: "/upgrade" },
  { label: "Settings", icon: Settings,   to: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const cardRef  = useRef(null);
  const bgRef    = useRef(null);
  const mascotRef = useRef(null);

  useEffect(() => {
    // ── Rotating gradient background inside the card ──
    gsap.to(bgRef.current, {
      rotation: 360,
      duration: 6,
      ease: "none",
      repeat: -1,
      transformOrigin: "center center",
    });

    // ── Card subtle float up/down ──
    gsap.to(cardRef.current, {
      y: -6,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // ── Mascot bounce ──
    gsap.to(mascotRef.current, {
      y: -4,
      duration: 1.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  const handleTheme = (mode) => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  };

  return (
    <aside className="flex flex-col h-screen w-56 bg-green-50 dark:bg-neutral-900 border-r border-green-100 dark:border-neutral-800 py-5 px-3">

      {/* ── Logo ── */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <img src={tutor} alt="WidiTutor" className="h-8 w-auto" />
        <span className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          WidiTutor
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? "bg-white dark:bg-neutral-800 text-green-600 dark:text-green-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Upgrade Pro card ── */}
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden mb-5 mx-1"
        style={{ minHeight: "160px" }}
      >
        {/* Rotating conic gradient background */}
        <div
          ref={bgRef}
          className="absolute"
          style={{
            inset: "-60%",
            background: "conic-gradient(from 0deg, #16a34a, #4ade80, #86efac, #16a34a, #166534, #4ade80, #16a34a)",
            borderRadius: "50%",
          }}
        />

        {/* Dark overlay to soften */}
        <div className="absolute inset-0 bg-green-800/30 backdrop-blur-[1px]" />

        {/* Decorative arrow */}
       

        {/* Mascot */}
        

        {/* Content */}
        <div className="relative z-10 pt-10 px-4 pb-4">
          <ul className="flex flex-col gap-1.5 mb-4">
            {["Unlimitless learning", "Unlimited Videos", "Unlimited Quizzes"].map((feat) => (
              <li key={feat} className="flex items-center gap-2 text-white text-[11.5px] font-medium">
                <FaCheckCircle size={12} className="text-white/80 flex-shrink-0" />
                {feat}
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/upgrade")}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white text-green-700 text-[12px] font-bold hover:bg-green-50 transition-colors shadow-sm"
          >
            <Zap size={13} fill="currentColor" />
            Upgrade Pro
          </button>
        </div>
      </div>

      {/* ── Theme toggle ── */}
      <div className="flex items-center gap-2 px-2 mb-3">
        <button
          onClick={() => handleTheme("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all
            ${!dark
              ? "bg-white dark:bg-neutral-800 text-gray-800 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <Sun size={13} /> Light
        </button>
        <button
          onClick={() => handleTheme("dark")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all
            ${dark
              ? "bg-neutral-800 text-gray-100 shadow-sm"
              : "text-gray-400 hover:text-gray-600"
            }`}
        >
          <Moon size={13} /> Dark
        </button>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all"
      >
        <LogOut size={16} strokeWidth={1.8} />
        Logout
      </button>

    </aside>
  );
}