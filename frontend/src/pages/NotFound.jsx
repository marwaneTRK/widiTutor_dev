import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useLocal } from "./welcome/hooks/useStorage";
import logo from "../assets/logo.svg";
import blurEffect from "../assets/blur.svg";

export default function NotFound() {
  const navigate = useNavigate();
  const [dark] = useLocal("widi_dark", false);
  const logoRef = useRef(null);
  const codeRef = useRef(null);
  const messageRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    timeline
      .fromTo(
        logoRef.current,
        { autoAlpha: 0, y: -20, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 },
      )
      .fromTo(
        codeRef.current,
        { autoAlpha: 0, scale: 0.78 },
        { autoAlpha: 1, scale: 1, duration: 0.65, ease: "back.out(1.4)" },
        "-=0.2",
      )
      .fromTo(
        messageRef.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        "-=0.2",
      )
      .fromTo(
        buttonRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45 },
        "-=0.2",
      );

    const logoBounce = gsap.to(logoRef.current, {
      y: -7,
      duration: 1.7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.2,
    });

    return () => {
      timeline.kill();
      logoBounce.kill();
    };
  }, []);

  const onButtonHoverIn = () => {
    gsap.to(buttonRef.current, {
      scale: 1.04,
      backgroundColor: dark ? "#2f9d58" : "#171717",
      boxShadow: dark
        ? "0px 12px 30px rgba(47, 157, 88, 0.35)"
        : "0px 12px 30px rgba(62, 207, 62, 0.25)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const onButtonHoverOut = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      backgroundColor: dark ? "#1a3a24" : "#111827",
      boxShadow: dark
        ? "0px 8px 24px rgba(26, 58, 36, 0.45)"
        : "0px 8px 24px rgba(17, 24, 39, 0.15)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden px-6 py-14 ${
        dark
          ? "bg-gradient-to-b from-[#080f0b] via-[#0d1a11] to-[#0a140d]"
          : "bg-gradient-to-b from-[#f7faf8] via-white to-[#edf7ef]"
      }`}
    >
      <img
        src={blurEffect}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 w-[640px] max-w-[85vw] -translate-x-1/2 -translate-y-1/2 ${
          dark ? "opacity-25" : "opacity-45"
        }`}
      />

      <div
        className={`relative mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border p-8 text-center backdrop-blur-sm sm:p-12 ${
          dark
            ? "border-[#1a3a24] bg-[#0d1a11]/85 shadow-[0_20px_60px_rgba(3,10,6,0.6)]"
            : "border-gray-100 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        }`}
      >
        <img
          ref={logoRef}
          src={logo}
          alt="WidiTutor"
          className="mb-5 h-14 w-auto"
        />

        <h1
          ref={codeRef}
          className={`text-7xl font-black tracking-tight sm:text-8xl ${
            dark ? "text-[#c4e8d4]" : "text-gray-900"
          }`}
        >
          404
        </h1>

        <div ref={messageRef} className="mt-4 max-w-xl space-y-2">
          <p
            className={`text-2xl font-semibold ${dark ? "text-[#b6dfc6]" : "text-gray-800"}`}
          >
            Oops! You seem to be lost here...
          </p>
          <p
            className={`text-base ${dark ? "text-[#6fa786]" : "text-gray-500"}`}
          >
            This lesson page is missing, but your learning journey is still on
            track.
          </p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={() => navigate("/")}
          onMouseEnter={onButtonHoverIn}
          onMouseLeave={onButtonHoverOut}
          className="mt-8 inline-flex items-center justify-center rounded-xl px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ecf3e] focus-visible:ring-offset-2"
          style={{
            backgroundColor: dark ? "#1a3a24" : "#111827",
            boxShadow: dark
              ? "0px 8px 24px rgba(26, 58, 36, 0.45)"
              : "0px 8px 24px rgba(17, 24, 39, 0.15)",
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
