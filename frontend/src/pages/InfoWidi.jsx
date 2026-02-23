import { useNavigate } from "react-router-dom";
import about from "../assets/about_icon.svg";
import info  from "../assets/image_Info.svg";
import info2 from "../assets/image_Info2.svg";
import WidiWorks from "./WidiWorks";

export default function InfoWidi() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950 px-8 py-16">

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">

        {/* ── Left — Text ── */}
        <div className="flex-1 flex flex-col gap-5 lg:max-w-xs">

          {/* Info icon */}
          <div className="w-9 h-9 rounded-lg  flex items-center justify-center shadow-sm">
            <img src={about} alt="" className="w-5 h-5 object-contain" />
          </div>

          {/* Title */}
          <h2 className="text-[28px] sm:text-[32px] font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
            Chat, quizzes, and more!
          </h2>

          {/* Description */}
          <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Identify core concepts, validate your progress with assessments,
            access cited answers, and engage with an interactive AI tutor.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate("/authLast")}
            className="w-fit flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-80 transition-all shadow-md mt-2"
          >
            Get started →
          </button>
        </div>

        {/* ── Right — Stacked images ── */}
        <div className="flex-1 relative flex items-center justify-center w-full min-h-[380px]">

          {/* info2 — derrière, décalée à droite, grande taille */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-56 sm:w-64 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-neutral-700">
            <img src={info2} alt="Quiz sidebar" className="w-full h-auto object-contain" />
          </div>

          {/* info — devant, cache une partie de info2 */}
          <div className="relative z-20 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-green-400 dark:border-green-500">
            <img src={info} alt="Chat UI" className="w-full h-auto object-contain" />
          </div>

        </div>

      </div>
      
    </section>
  );
}