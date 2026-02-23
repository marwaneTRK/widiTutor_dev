import Navbar      from "../layouts/Navbar";
import Footer      from "../layouts/Footer";

import WidiWorks   from "../pages/WidiWorks";
import InfoWidi    from "../pages/InfoWidi";
import About       from "../pages/About";
import Background  from "../Images/White-images/profile-white/background-shap.svg";
import logo        from "../assets/logo_origin.svg";
import { FaApple, FaYoutube, FaGoogle, FaWindows } from "react-icons/fa";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white dark:bg-neutral-950 overflow-hidden">

      {/* ── Grid background ── */}
      

      <div className="relative z-10 flex flex-col min-h-screen">

        <Navbar />

        <main className="flex-1 flex flex-col pt-[60px]">

          {/* ── 1. Top banner ── */}
          <div className="relative flex items-center justify-between bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-10 py-6 overflow-hidden">
            <div>
              <h2 className="text-[25px] font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Prove Your Progress!
              </h2>
              <p className="text-[17px] text-gray-500 dark:text-gray-400 mt-1 whitespace-nowrap">
                Turn video insights into mastery. Test your skills, and listen to Widitutor.
              </p>
            </div>
            <img
              src={Background}
              alt=""
              className="absolute right-0 top-0 h-full w-auto object-contain object-right"
            />
          </div>

          {/* ── 2. Hero ── */}
          <div className="flex flex-col items-center justify-center text-center px-6 py-16">

            {/* Badge */}
            <div className="flex items-center gap-2 mb-6 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-full px-3 py-1.5 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-neutral-900 flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="" className="w-4 h-4 object-contain" />
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white dark:border-neutral-900" />
              </div>
              <p className="text-[11.5px] text-gray-500 dark:text-gray-400 text-left leading-tight max-w-[160px]">
                Join us and discover how to use the platform
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-[30px] sm:text-[42px] font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight max-w-xl">
              Keep Learning With{" "}
              <span className="text-green-500">AI</span> Together.
              <br />
              Choose Your Video You Like{" "}
              <span className="inline-flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg align-middle mx-1">
                <FaYoutube className="text-white" size={17} />
              </span>
              <br />
              &amp; Start Learning <span>✦</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-[13.5px] text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
              Our platform allows you to learn directly through our integrated YouTube
              browser or by pasting links to your preferred videos. To accelerate your
              progress, you can chat with mimAi, our dedicated assistant bot designed to
              help you learn faster.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-5 mt-7">
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-80 transition-all shadow-md"
              >
                <Settings size={14} />
                Start Learning Now
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition-colors"
              >
                Try for free
              </button>
            </div>
          </div>

          {/* ── 3. Trust banner + logos ── */}
          <div className="relative">
            <div className="relative h-14">
              
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-6 py-4 border-t border-gray-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <FaApple size={17} /><span className="text-[13px] font-semibold">Apple</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <FaYoutube size={17} className="text-red-600" /><span className="text-[13px] font-semibold">YouTube</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <FaGoogle size={15} className="text-blue-500" /><span className="text-[13px] font-semibold">Google</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                <FaWindows size={15} className="text-blue-600" /><span className="text-[13px] font-semibold">Windows</span>
              </div>
            </div>
          </div>

          {/* ── 4. WidiWorks ── */}
          <WidiWorks />

          {/* ── 5. InfoWidi ── */}
          <InfoWidi />

          {/* ── 6. About (Reviews + CTA) ── */}
          <About />

        </main>

        <Footer />

      </div>
    </div>
  );
}