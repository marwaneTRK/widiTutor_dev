import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo_origin.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDark((p) => !p);
  };

  const navLinks = [
    { label: "Home",    to: "/" },
    { label: "About",   to: "/about" },
    { label: "Pricing", to: "/pricing" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 dark:bg-neutral-950 dark:border-neutral-800">
        <div className="flex items-center justify-between px-5 h-[60px]">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="WidiTutor" className="h-7 w-auto" />
            <span className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          WidiTutor
        </span>
            
          </Link>

          {/* ── Center Nav Pills — hidden on mobile ── */}
          <div className="hidden md:flex items-center gap-0.5 bg-gray-100 border border-gray-200 rounded-full px-1 py-1 dark:bg-neutral-800 dark:border-neutral-700">
            {navLinks.map(({ label, to }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    group relative px-4 py-1.5 rounded-full text-sm transition-all duration-150 whitespace-nowrap
                    ${isActive
                      ? "bg-white text-gray-900 font-medium shadow-sm ring-1 ring-black/[0.06] dark:bg-neutral-700 dark:text-gray-100"
                      : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-gray-100"
                    }
                  `}
                >
                  {label}
                  {!isActive && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-[2px] rounded-full bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Get started — hidden on mobile */}
            <button
              onClick={() => navigate("/auth")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-gray-800 bg-white border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all duration-150 dark:bg-neutral-900 dark:text-gray-200 dark:border-neutral-700 dark:hover:border-neutral-500"
            >
              Get started <span className="text-gray-400 dark:text-neutral-500">→</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={handleDarkMode}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 transition-colors duration-150 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
            >
              {dark ? <Sun size={14} strokeWidth={2.25} /> : <Moon size={14} strokeWidth={2.25} />}
            </button>

            {/* Hamburger — visible on mobile only */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-neutral-800"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 pt-1 flex flex-col gap-1 border-t border-gray-100 dark:border-neutral-800">
            {navLinks.map(({ label, to }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                    }
                  `}
                >
                  {label}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </Link>
              );
            })}

            {/* Get started inside mobile menu */}
            <button
              onClick={() => { navigate("/authLast"); setMenuOpen(false); }}
              className="mt-1 w-full py-2.5 rounded-xl text-sm font-medium text-gray-800 bg-white border border-gray-300 hover:border-gray-400 transition-all dark:bg-neutral-900 dark:text-gray-200 dark:border-neutral-700"
            >
              Get started →
            </button>
          </div>
        </div>

      </nav>
    </>
  );
}