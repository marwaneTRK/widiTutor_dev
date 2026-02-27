import { useNavigate } from "react-router-dom";
import { AboutIcon, WidiTutorVideo } from "@assets";
import { getAuthToken } from "../../utils/auth";

export default function InfoWidi({ onGetStarted }) {
  const navigate = useNavigate();
  const goToStart = () => {
    if (typeof onGetStarted === "function") {
      onGetStarted();
      return;
    }
    navigate(getAuthToken() ? "/welcome" : "/auth");
  };

  return (
    <section className="relative overflow-hidden bg-white px-6 py-16 dark:bg-neutral-950 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-14 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col justify-center gap-6 lg:max-w-[460px]">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-neutral-800">
              <img src={AboutIcon} alt="" className="h-4 w-4 object-contain" />
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-neutral-400">
              Smart Learning
            </span>
          </div>

          <h2 className="text-[30px] font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-[38px]">
            Chat, quizzes, and
            <span className="text-green-500"> more</span>
          </h2>

          <p className="max-w-[420px] text-[14px] leading-relaxed text-gray-600 dark:text-neutral-300 sm:text-[15px]">
            Identify core concepts, validate your progress with assessments,
            access cited answers, and engage with an interactive AI tutor.
          </p>

          <div>
            <button
              onClick={goToStart}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Get started
              <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center pt-30">
          <div className="relative w-full max-w-[620px] min-h-[390px]">
            <div className="relative z-20 w-[74%]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 translate-x-4 translate-y-8 rounded-2xl border border-green-200/40 bg-gradient-to-br from-green-200/45 via-white/25 to-green-300/30 shadow-[0_30px_70px_rgba(34,197,94,0.28)] backdrop-blur-xl dark:border-green-500/20 dark:from-green-500/15 dark:via-emerald-400/10 dark:to-green-600/20 dark:shadow-[0_24px_60px_rgba(34,197,94,0.24)] sm:translate-x-6 sm:translate-y-10 lg:translate-x-8 lg:translate-y-12"
              >
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/40 dark:ring-white/10" />
              </div>

              <div className="relative z-20 overflow-hidden rounded-2xl border border-green-400/80 bg-white shadow-[0_16px_45px_rgba(22,163,74,0.22)] dark:border-green-500/70 dark:bg-neutral-900">
                <video
                  src={WidiTutorVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  className="pointer-events-none h-auto w-full object-cover select-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
