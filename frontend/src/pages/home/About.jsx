import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User1, User2, User3 } from "@assets";

const USERS = [
  {
    image:       User1,
    nom:         "Mahmud Malek",
    specialite:  "Software Student",
    description: "\"I love it, it makes learning so much easier and more effective.\"",
    stars:       5,
  },
  {
    image:       User2,
    nom:         "Sera Sofel",
    specialite:  "Designer Teacher",
    description: "\"I recommended it to all my students. they adore it\"",
    stars:       4,
  },
  {
    image:       User3,
    nom:         "Mahmud Malek",
    specialite:  "Assistant Professor,",
    description: "\"I definitely plan to experiment with WidiTutor in my online course\"",
    stars:       4,
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-neutral-950 px-8 py-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* ── Title ── */}
        <h2 className="text-center text-[26px] sm:text-[30px] font-extrabold text-gray-900 dark:text-white tracking-tight">
          What Our Users Say About{" "}
          <span className="text-green-500">Us</span> !
        </h2>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {USERS.map((user, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* User info */}
              <div className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.nom}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    {user.nom}
                  </p>
                  <p className="text-[11.5px] text-gray-400 dark:text-gray-500">
                    {user.specialite}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13.5px] text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                {user.description}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < user.stars
                        ? "text-green-500 fill-green-500"
                        : "text-gray-200 dark:text-neutral-700 fill-gray-200"
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <div className="bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-3xl px-8 py-12 flex flex-col items-center gap-5 text-center">
          <h3 className="text-[22px] sm:text-[26px] font-extrabold text-gray-900 dark:text-white tracking-tight">
            Let's Learn Together
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
            To accelerate your progress, you can chat with Tutor, our dedicated
            assistant bot designed to help you learn faster.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-80 transition-all shadow-md"
          >
            Learn Now →
          </button>
        </div>

      </div>
    </section>
  );
}
