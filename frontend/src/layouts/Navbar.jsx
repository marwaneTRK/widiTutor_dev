import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo_origin.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDark(document.documentElement.classList.contains("dark"));
  };

  const navLinks = [
    { label: "Home", section: "home" },
    { label: "Features", section: "features" },
    { label: "Pricing", section: "pricing" },
  ];

  const currentSection =
    location.pathname === "/" ? location.hash?.replace("#", "") || "home" : "";

  const handleSectionNav = (section) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${section}`);
      return;
    }

    if (section === "home") {
      navigate("/#home", { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(section);
    if (target) {
      navigate(`/#${section}`, { replace: true });
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-md p-0.5 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800">
            <img src={logo} alt="WidiTutor" className="h-7 w-auto" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-gray-800 dark:text-gray-100">
            WidiTutor
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 rounded-full border border-gray-200 bg-gray-100 px-1 py-1 dark:border-neutral-700 dark:bg-neutral-800 md:flex">
          {navLinks.map(({ label, section }) => {
            const isActive = currentSection === section;
            return (
              <button
                key={section}
                type="button"
                onClick={() => handleSectionNav(section)}
                className={`group relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/70 ${
                  isActive
                    ? "bg-white font-medium text-gray-900 shadow-sm ring-1 ring-black/[0.06] dark:bg-neutral-700 dark:text-gray-100"
                    : "text-gray-500 hover:bg-white/80 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-700/70 dark:hover:text-gray-100"
                }`}
              >
                {label}
                {!isActive && (
                  <span className="absolute bottom-0.5 left-4 right-4 h-[2px] origin-left scale-x-0 rounded-full bg-green-500 transition-transform duration-200 group-hover:scale-x-100" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/auth")}
            className="hidden items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-800 transition-all duration-150 hover:border-gray-400 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200 dark:hover:border-neutral-500 sm:flex"
          >
            Get started <span className="text-gray-400 dark:text-neutral-500">-&gt;</span>
          </button>

          <button
            onClick={handleDarkMode}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white transition-colors duration-150 hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/70 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            {dark ? <Sun size={14} strokeWidth={2.25} /> : <Moon size={14} strokeWidth={2.25} />}
          </button>

          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/70 dark:text-gray-300 dark:hover:bg-neutral-800 md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav-menu"
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-gray-100 px-4 pb-4 pt-1 dark:border-neutral-800">
          {navLinks.map(({ label, section }) => {
            const isActive = currentSection === section;
            return (
              <button
                key={section}
                type="button"
                onClick={() => handleSectionNav(section)}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                }`}
              >
                {label}
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
              </button>
            );
          })}

          <button
            onClick={() => {
              navigate("/auth");
              setMenuOpen(false);
            }}
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-800 transition-all hover:border-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200"
          >
            Get started -&gt;
          </button>
        </div>
      </div>
    </nav>
  );
}
