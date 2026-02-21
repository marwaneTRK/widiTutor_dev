import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import logo from "../assets/logo.svg";
import blurEffect from "../assets/blur.svg";

export default function NotFound() {
  const navigate = useNavigate();
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
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }
      )
      .fromTo(
        codeRef.current,
        { autoAlpha: 0, scale: 0.78 },
        { autoAlpha: 1, scale: 1, duration: 0.65, ease: "back.out(1.4)" },
        "-=0.2"
      )
      .fromTo(
        messageRef.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        "-=0.2"
      )
      .fromTo(
        buttonRef.current,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.45 },
        "-=0.2"
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
      backgroundColor: "#171717",
      boxShadow: "0px 12px 30px rgba(62, 207, 62, 0.25)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const onButtonHoverOut = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      backgroundColor: "#111827",
      boxShadow: "0px 8px 24px rgba(17, 24, 39, 0.15)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f7faf8] via-white to-[#edf7ef] px-6 py-14">
      <img
        src={blurEffect}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[640px] max-w-[85vw] -translate-x-1/2 -translate-y-1/2 opacity-45"
      />

      <div className="relative mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white/85 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-12">
        <img ref={logoRef} src={logo} alt="WidiTutor" className="mb-5 h-14 w-auto" />

        <h1
          ref={codeRef}
          className="text-7xl font-black tracking-tight text-gray-900 sm:text-8xl"
        >
          404
        </h1>

        <div ref={messageRef} className="mt-4 max-w-xl space-y-2">
          <p className="text-2xl font-semibold text-gray-800">
            Oops! You seem to be lost here...
          </p>
          <p className="text-base text-gray-500">
            This lesson page is missing, but your learning journey is still on track.
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
            backgroundColor: "#111827",
            boxShadow: "0px 8px 24px rgba(17, 24, 39, 0.15)",
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
