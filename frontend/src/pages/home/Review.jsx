import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User1, User2, User3 } from "@assets";
import { getAuthToken } from "../../utils/auth";

const USERS = [
  {
    image: User1,
    nom: "Mahmud Malek",
    specialite: "Software Student",
    description: '"I love it, it makes learning so much easier and more effective."',
    stars: 5,
  },
  {
    image: User2,
    nom: "Sera Sofel",
    specialite: "Designer Teacher",
    description: '"I recommended it to all my students. they adore it"',
    stars: 4,
  },
  {
    image: User3,
    nom: "Mahmud Malek",
    specialite: "Assistant Professor",
    description: '"I definitely plan to experiment with WidiTutor in my online course"',
    stars: 4,
  },
];
const USERS_LOOP = [...USERS, ...USERS, ...USERS];

export default function ReviewPage({ onGetStarted }) {
  const navigate = useNavigate();
  const goToStart = () => {
    if (typeof onGetStarted === "function") {
      onGetStarted();
      return;
    }
    navigate(getAuthToken() ? "/welcome" : "/auth");
  };

  const renderCard = (user, index, lane) => (
    <article
      key={`${lane}-${user.nom}-${index}`}
      className="w-[320px] shrink-0 rounded-2xl border border-[#d8d8d8] bg-white/90 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-[2px] transition-transform duration-300 hover:-translate-y-1 dark:border-neutral-700 dark:bg-neutral-800/90 dark:shadow-none sm:w-[360px]"
    >
      <div className="flex items-center gap-3">
        <img src={user.image} alt={user.nom} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-[13px] font-semibold text-[#272727] dark:text-white">{user.nom}</p>
          <p className="text-[11.5px] text-[#8a8a8a] dark:text-neutral-400">{user.specialite}</p>
        </div>
      </div>

      <p className="mt-4 min-h-[64px] text-[13.5px] leading-relaxed text-[#5d5d5d] dark:text-neutral-300">
        {user.description}
      </p>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < user.stars
                ? "fill-[#14b514] text-[#14b514]"
                : "fill-[#e4e4e4] text-[#e4e4e4]"
            }
          />
        ))}
      </div>
    </article>
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f0f0f0] to-[#e8e8e8] px-4 py-14 dark:from-neutral-950 dark:to-neutral-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="text-center text-[30px] font-semibold leading-none text-[#272727] dark:text-white sm:text-[48px]">
          What Our Users Say About <span className="text-[#14b514]">Us</span> !
        </h1>

        <div className="mt-10">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="reviews-marquee">
              <div className="reviews-track">
                {USERS_LOOP.map((user, index) => renderCard(user, index, "a"))}
              </div>
              <div className="reviews-track" aria-hidden="true">
                {USERS_LOOP.map((user, index) => renderCard(user, index, "b"))}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#ececec] to-transparent dark:from-neutral-900 sm:w-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#ececec] to-transparent dark:from-neutral-900 sm:w-20" />
          </div>
        </div>

        <div className="mx-auto mt-16 flex h-[258px] w-[1439px] max-w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[24px] border border-[#bfbfbf] bg-transparent px-6 py-6 dark:border-neutral-700 sm:mt-24 sm:px-10">
          <h2 className="text-center text-[34px] font-semibold leading-none text-[#272727] dark:text-white sm:text-[58px]">
            Let&apos;s Learn Together
          </h2>
          <p className="mx-auto max-w-[760px] text-center text-[16px] leading-[1.25] text-[#272727] dark:text-neutral-300 sm:text-[16px]">
            To accelerate your progress, you can chat with Tutor, our dedicated
            assistant bot designed to help you learn faster.
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={goToStart}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#272727] px-4 py-2 text-[14px] font-semibold text-white sm:text-[19px]"
            >
              Learn Now
              <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes reviews-slide {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(calc(-100% - 40px), 0, 0);
          }
        }

        .reviews-marquee {
          display: flex;
          gap: 40px;
          width: max-content;
        }

        .reviews-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: reviews-slide 42s linear infinite;
          will-change: transform;
        }

        .reviews-marquee:hover .reviews-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .reviews-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
