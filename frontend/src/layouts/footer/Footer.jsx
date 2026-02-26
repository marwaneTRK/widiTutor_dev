import { Link } from "react-router-dom";
import { LogoOrigin } from "@assets";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const links = [
    { label: "Discord Community", to: "/discord" },
    { label: "Blogs",            to: "/blogs" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy",   to: "/privacy" },
  ];

  const socials = [
    { icon: <FaFacebook size={20} />, href: "https://www.facebook.com", label: "Facebook" },
    { icon: <FaInstagram size={20} />, href: "https://www.instagram.com", label: "Instagram" },
    { icon: <FaXTwitter size={18} />, href: "https://x.com", label: "X" },
    { icon: <FaTiktok size={18} />, href: "https://www.tiktok.com", label: "TikTok" },
  ];

  return (
    <footer className="bg-black dark:bg-black px-8 pt-8 pb-6">

      {/* Logo */}
      <div className="mb-6">
        <Link to="/" className="pointer-events-auto flex items-center gap-2 w-fit">
          <img src={LogoOrigin} alt="WidiTutor" className="h-8 w-auto" />
          <span className="text-[15px] font-bold text-white tracking-tight">
          WidiTutor
        </span>
          
        </Link>
      </div>

      {/* Middle row : links + contact */}
      <div className="mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/discord"
              className="pointer-events-auto w-fit cursor-pointer text-sm text-gray-300 hover:text-white hover:underline transition-colors duration-150"
            >
              Discord Community
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Contact Us</span>
              <a
                href="mailto:WidiTutor@gmail.com"
                className="pointer-events-auto text-sm text-gray-200 hover:underline transition-all"
              >
                WidiTutor@gmail.com
              </a>
            </div>
          </div>

          {links.slice(1).map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="pointer-events-auto w-fit cursor-pointer text-sm text-gray-300 hover:text-white hover:underline transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row : social + copyright */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">

        {/* Social icons */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">Social</span>
          {socials.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer noopener"
              className="pointer-events-auto text-gray-300 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-150"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © Copyright 2026 Widitutor .
        </p>

      </div>

    </footer>
  );
}
