import { Link } from "react-router-dom";
import logo from "../assets/logo_widi.svg";
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
    { icon: <FaFacebook  size={20} />, href: "#", label: "Facebook" },
    { icon: <FaInstagram size={20} />, href: "#", label: "Instagram" },
    { icon: <FaXTwitter  size={18} />, href: "#", label: "X" },
    { icon: <FaTiktok    size={18} />, href: "#", label: "TikTok" },
  ];

  return (
    <footer className="bg-[#d4e9d4] dark:bg-neutral-900 px-8 pt-8 pb-6">

      {/* Logo */}
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <img src={logo} alt="WidiTutor" className="h-8 w-auto" />
          
        </Link>
      </div>

      {/* Middle row : links + contact */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-16 mb-6">

        {/* Nav links */}
        <ul className="flex flex-col gap-3">
          {links.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-150"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact */}
        <div className="flex items-center gap-2 sm:mt-0">
          <span className="text-sm text-gray-500 dark:text-gray-400">Contact Us</span>
          <a
            href="mailto:WidiTutor@gmail.com"
            className="text-sm text-gray-800 dark:text-gray-200 hover:underline transition-all"
          >
            WidiTutor@gmail.com
          </a>
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
              className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors duration-150"
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