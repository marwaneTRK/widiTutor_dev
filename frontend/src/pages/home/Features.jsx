import { FeaturesBg, IconLink, IconChat, IconQuiz } from "@assets";
import { useEffect, useRef, useState } from "react";

const cards = [
  {
    title: "Link",
    description:
      "Choose any educational video you want, change its title, and click on it in our search bar..",
    icon: IconLink,
  },
  {
    title: "Chat",
    description:
      "Ask our Tutor any question about the video and it will provide assistance.",
    icon: IconChat,
  },
  {
    title: "Quiz",
    description:
      "Take a quick quiz after every video to test your understanding and make the information stick.",
    icon: IconQuiz,
  },
];

export default function Features() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const getDesktopCardPosition = (index) => {
    if (!revealed) {
      return "left-1/2 -translate-x-1/2";
    }

    if (index === 0) {
      return "left-[1%] translate-x-0";
    }

    if (index === 1) {
      return "left-1/2 -translate-x-1/2";
    }

    return "right-[1%] translate-x-0";
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-[white] via-[#e8e8e8] to-[#8de58e] px-6 py-12 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 sm:px-10 sm:py-14"
    >
      <button
        type="button"
        className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-3.5 py-1.5 text-[14px] font-medium text-white sm:left-10 sm:top-8"
      >
        <span>WidiTutor</span>
      </button>

      <div className="mx-auto max-w-[1280px]">
        <h1 className="mt-18 text-center text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-[#272727] dark:text-white sm:text-[52px]">
          How <span className="text-[#24b224]">WidiTutor</span> Works ?
        </h1>

        <div className="mt-8 grid gap-6 lg:hidden">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-[26px] bg-[#f2f2f2]/80 p-4 shadow-[0_24px_60px_rgba(58,190,58,0.22)] dark:border dark:border-neutral-700 dark:bg-neutral-800/80 dark:shadow-none"
            >
              <div className="relative overflow-hidden rounded-[16px]">
                <img src={FeaturesBg} alt="" className="h-auto w-full" />
                <div className="absolute inset-x-0 bottom-3 flex justify-center">
                  <img
                    src={card.icon}
                    alt=""
                    className="h-[56px] w-[56px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
                  />
                </div>
              </div>
              <h3 className="mt-2 text-center text-[38px] font-semibold leading-none text-[#272727] dark:text-white sm:text-[40px] md:text-[42px]">
                {card.title}
              </h3>
              <p className="mt-3 text-center text-[16px] leading-[1.35] text-[#5d5d5d] dark:text-neutral-300 sm:text-[17px]">
                {card.description}
              </p>
            </article>
          ))}
        </div>

        <div className="relative mt-12 hidden h-[500px] lg:block">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`absolute top-0 flex h-[460px] w-[31%] min-w-[320px] flex-col rounded-[26px] bg-[#f2f2f2]/80 p-4 shadow-[0_24px_60px_rgba(58,190,58,0.22)] transition-all duration-700 ease-out dark:border dark:border-neutral-700 dark:bg-neutral-800/80 dark:shadow-none ${getDesktopCardPosition(index)}`}
              style={{
                transitionDelay: `${index * 120}ms`,
                zIndex: revealed ? 1 : 5 - index,
              }}
            >
              <div className="relative overflow-hidden rounded-[16px]">
                <img src={FeaturesBg} alt="" className="h-auto w-full" />
                <div className="absolute inset-x-0 bottom-3 flex justify-center">
                  <img
                    src={card.icon}
                    alt=""
                    className="h-[56px] w-[56px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
                  />
                </div>
              </div>
              <h3 className="mt-2 text-center text-[38px] font-semibold leading-none text-[#272727] dark:text-white sm:text-[40px] md:text-[42px] lg:text-[32px]">
                {card.title}
              </h3>
              <p className="mt-3 min-h-[72px] text-center text-[16px] leading-[1.35] text-[#5d5d5d] dark:text-neutral-300 sm:text-[17px]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
