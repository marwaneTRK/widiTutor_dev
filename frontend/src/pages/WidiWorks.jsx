import { Play } from "lucide-react";
import link_image  from "../Images/White-images/features-white/link_image.svg";
import chat_image  from "../Images/White-images/features-white/chat_image.svg";
import quiz_image  from "../Images/White-images/features-white/quiz_image.svg";

const CARDS = [
  {
    image: link_image,
    desc:  "Choose any educational video you want, copy its link, and paste it into our search bar.",
  },
  {
    image: chat_image,
    desc:  "Ask our Tutor any question about the video and it will provide assistance.",
  },
  {
    image: quiz_image,
    desc:  "Take a quick quiz after every video to test your understanding and make the information stick.",
  },
];

export default function WidiWorks() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950 px-8 py-14">

      {/* ── Bottom green radial glow ── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(74,222,128,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Watch Video pill ── */}
        <button className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[12.5px] font-semibold hover:opacity-80 transition-all shadow-md">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500">
            <Play size={10} fill="white" className="text-white ml-0.5" />
          </span>
          Watch Video
        </button>

        {/* ── Title ── */}
        <h2 className="text-[28px] sm:text-[34px] font-extrabold text-gray-900 dark:text-white mb-10 tracking-tight">
          How <span className="text-green-500">WidiTutor</span> Works ?
        </h2>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CARDS.map(({ image, desc }) => (
            <div
              key={desc}
              className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* Screenshot image */}
              <div className="relative w-full bg-gray-100 dark:bg-neutral-800">
                    <img
                    src={image}
                    alt={desc}
                    className="w-full h-auto object-contain"
                    />
                </div>

              {/* Text content */}
             
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}