import sectionBg from "./bg.svg";
import watchVideoIcon from "./watch video icon - Copy.svg";
import iconLink from "./material-symbols_video-l.svg";
import iconChat from "../assets/feature page/Group 133.svg";
import iconQuiz from "./material-symbols_video-library-rounded.svg";

const cards = [
  {
    title: "Link",
    description:
      "Choose any educational video you want, copy its link, and paste it into our search bar.",
    icon: iconLink,
  },
  {
    title: "Chat",
    description:
      "Ask our Tutor any question about the video and it will provide assistance.",
    icon: iconChat,
  },
  {
    title: "Quiz",
    description:
      "Take a quick quiz after every video to test your understanding and make the information stick.",
    icon: iconQuiz,
  },
];

export default function Features() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#ececec] via-[#e8e8e8] to-[#8de58e] px-6 py-12 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 sm:px-10 sm:py-14">
      <button
        type="button"
        className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] px-3.5 py-1.5 text-[14px] font-medium text-white sm:left-10 sm:top-8"
      >
        <img src={watchVideoIcon} alt="" className="h-[30px] w-[30px]" />
        <span>Watch Video</span>
      </button>

      <h1 className="mt-18 text-left text-[52px] font-bold leading-[1.05] tracking-[-0.02em] text-[#272727] dark:text-white">
        How <span className="text-[#24b224]">WidiTutor</span> Works ?
      </h1>

      <div className="mx-auto max-w-[1280px]">
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {cards.map((card) => (
              <article
                key={card.title}
                className="rounded-[26px] bg-[#f2f2f2]/80 p-4 shadow-[0_24px_60px_rgba(58,190,58,0.22)] dark:border dark:border-neutral-700 dark:bg-neutral-800/80 dark:shadow-none"
              >
              <img
                src={sectionBg}
                alt=""
                className="h-auto w-full overflow-hidden rounded-[16px]"
              />
              <div className="mt-4 flex justify-center">
                <img src={card.icon} alt="" className="h-[70px] w-[70px]" />
              </div>
              <h3 className="mt-2 text-center text-[38px] font-semibold leading-none text-[#272727] dark:text-white sm:text-[40px] md:text-[42px] lg:text-[32px]">
                {card.title}
              </h3>
              <p className="mt-3 text-center text-[16px] leading-[1.35] text-[#5d5d5d] dark:text-neutral-300 sm:text-[17px]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
