import Navbar from "../../layouts/navigation/Navbar";
import Footer from "../../layouts/footer/Footer";
import Features from "./Features";
import ReviewPage from "./Review";
import InfoWidi from "./InfoWidi";
import {
  LogoOrigin,
  PartnerCDG,
  PartnerJobintech,
  PartnerMNC,
  PartnerMinister,
  PartnerOrange,
  PartnerStripe,
} from "@assets";
import { FaYoutube } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getAuthToken } from "../../utils/auth";
import {
  getSelectedPlan,
  isPaidPlan,
  isPaymentRequired,
  setPaymentRequired,
  setSelectedPlan,
} from "../../utils/plan";
import { getSubscriptionStatus } from "../../services/billingService";
// assets imported above
// partner logos imported above

// ━━━━━━━━━━━ FEATURE CARDS DATA ━━━━━━━━━━━
// ━━━━━━━━━━━ USER REVIEWS DATA ━━━━━━━━━━━
// ━━━━━━━━━━━ PRICING PLANS DATA ━━━━━━━━━━━
const plans = [
  {
    name: "Free",
    price: "$0",
    billing: "/month",
    description: "Start learning with core features.",
    features: [
      "Learning videos",
      "No Quiz access",
      "Community support",
      "Chat with Tutor (first 2 days)",
    ],
    featured: false,
  },
  {
    name: "Pro",
    price: "$70",
    billing: "/Year",
    description: "Full access with no limits.",
    features: [
      "Unlimited Learning",
      "Unlimited Videos",
      "Unlimited Quizzes",
      "Unlimited Conversation with Chat",
    ],
    featured: true,
    badge: "Popular",
  },
  {
    name: "Basic",
    price: "$7",
    billing: "/month",
    description: "Daily limits for consistent learners.",
    features: [
      "Learning videos",
      "5 Quizzes Per Day",
      "Dedicated manager support",
      "Chat with Tutor (20/day)",
    ],
    featured: false,
  },
];

const partnerLogos = [
  { src: PartnerCDG, alt: "CDG" },
  { src: PartnerJobintech, alt: "Jobintech" },
  { src: PartnerMNC, alt: "MNC" },
  { src: PartnerMinister, alt: "Ministere de la Transition Numerique" },
  { src: PartnerOrange, alt: "Orange" },
  { src: PartnerStripe, alt: "Stripe" },
];
const partnerLogosLoop = [...partnerLogos, ...partnerLogos, ...partnerLogos];

function CheckIcon({ featured }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${featured ? "bg-white/15 text-lime-300" : "bg-zinc-900 text-zinc-100"}`}
    >
      ✓
    </span>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToPricing = () => {
    const pricing = document.getElementById("pricing");
    if (pricing) {
      pricing.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate("/#pricing");
  };

  const handlePlanSelect = (planName) => {
    const plan = String(planName || "").toLowerCase();
    setSelectedPlan(plan);
    const requiresPayment = isPaidPlan(plan);
    setPaymentRequired(requiresPayment);

    const token = getAuthToken();
    if (!token) {
      navigate(`/auth?plan=${encodeURIComponent(plan)}`);
      return;
    }

    if (requiresPayment) {
      navigate(`/billing?plan=${encodeURIComponent(plan)}`);
      return;
    }

    navigate("/welcome");
  };

  const goToStart = () => {
    const token = getAuthToken();
    if (!token) {
      scrollToPricing();
      return;
    }

    const selectedPlan = getSelectedPlan();
    if (isPaidPlan(selectedPlan) && isPaymentRequired()) {
      navigate(`/billing?plan=${encodeURIComponent(selectedPlan)}`);
      return;
    }

    navigate("/welcome");
  };

  useEffect(() => {
    const section = location.hash?.replace("#", "");
    if (!section) {
      return;
    }

    // Wait one frame so layout is ready before scrolling to hash target.
    requestAnimationFrame(() => {
      const target = document.getElementById(section);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [location.hash]);

  useEffect(() => {
    const token = getAuthToken();
    const selectedPlan = getSelectedPlan();
    if (!token || !isPaidPlan(selectedPlan) || !isPaymentRequired()) {
      return;
    }

    let cancelled = false;

    const syncPaidAccess = async () => {
      try {
        const sub = await getSubscriptionStatus({ token });
        if (cancelled) return;
        if (sub?.subscriptionStatus === "active" || sub?.subscriptionStatus === "trialing") {
          setPaymentRequired(false);
        }
      } catch {
        // Keep local payment-required state if status check fails.
      }
    };

    syncPaidAccess();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main id="home" className="flex-1 flex flex-col pt-[60px]">
          {/* ━━━━━━━━━━━ SECTION 1: TOP BANNER ━━━━━━━━━━━ */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-2 dark:border-neutral-800 dark:bg-neutral-900 sm:px-10 sm:py-2.5">
            <div className="mx-auto w-full max-w-[1240px]">
              <h2 className="text-[18px] font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-[21px]">
                Prove Your Progress!
              </h2>
              <p className="mt-0.5 text-[12px] text-gray-500 dark:text-gray-400 sm:text-[13px]">
                Turn video insights into mastery. Test your skills, and listen
                to Widitutor.
              </p>
            </div>
          </div>

          {/* ━━━━━━━━━━━ SECTION 2: HERO ━━━━━━━━━━━ */}
          <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center px-6 py-10 text-center sm:py-12">
            {/* Badge */}
            <div className="mb-5 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex -space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-green-500 dark:border-neutral-900">
                  <img
                    src={LogoOrigin}
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                </div>
                <div className="" />
              </div>
              <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-tight max-w-[160px]">
                Join us
              </p>
            </div>

            {/* Headline */}
            <h1 className="max-w-[760px] text-[30px] font-extrabold leading-[1.08] tracking-tight text-gray-900 dark:text-white sm:text-[46px]">
              Keep Learning With <span className="text-green-500">AI</span>{" "}
              Together
              <br />
              Choose The Videos You Like{" "}
              <span className="mx-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 align-middle">
                <FaYoutube className="text-white" size={17} />
              </span>
              <br />
              And Start Learning
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-[640px] text-[13.5px] leading-relaxed text-gray-500 dark:text-gray-400 sm:text-[14px]">
              Our platform allows you to learn directly through our integrated
              YouTube browser or by pasting links to your preferred videos. To
              accelerate your progress, you can chat with WidiTutor, our
              dedicated assistant bot designed to help you learn faster.
            </p>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={goToStart}
                className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                {/*  <Settings size={14} /> */}
                Start Learning Now
              </button>
              <button
                onClick={goToStart}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition-colors"
              >
                Try for free
              </button>
            </div>
          </div>

          {/* ━━━━━━━━━━━ SECTION 3: TRUST LOGOS ━━━━━━━━━━━ */}
          <div className="border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
            <div className="mx-auto mb-3 w-fit rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-400">
              Trusted By Partners
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/65 px-2 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="home-logos-marquee">
                <div className="home-logos-track">
                  {partnerLogosLoop.map((item, idx) => (
                    <img
                      key={`a-${item.alt}-${idx}`}
                      src={item.src}
                      alt={item.alt}
                      className={`home-logo-item h-8 w-[120px] shrink-0 object-contain px-3 sm:h-9 sm:w-[140px] sm:px-5 ${
                        item.alt === "Jobintech" ? "scale-[1.28]" : ""
                      }`}
                    />
                  ))}
                </div>
                <div className="home-logos-track" aria-hidden="true">
                  {partnerLogosLoop.map((item, idx) => (
                    <img
                      key={`b-${item.alt}-${idx}`}
                      src={item.src}
                      alt=""
                      className={`home-logo-item h-8 w-[120px] shrink-0 object-contain px-3 sm:h-9 sm:w-[140px] sm:px-5 ${
                        item.alt === "Jobintech" ? "scale-[1.28]" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent dark:from-neutral-900 sm:w-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent dark:from-neutral-900 sm:w-20" />
            </div>
          </div>

          {/* ━━━━━━━━━━━ SECTION 4: INFO WIDI ━━━━━━━━━━━ */}
          <InfoWidi className="mt-16" onGetStarted={goToStart} />

          {/* ━━━━━━━━━━━ SECTION 5: HOW IT WORKS ━━━━━━━━━━━ */}
          <div id="features" className="scroll-mt-[80px]">
            <Features />
          </div>

          {/* ━━━━━━━━━━━ SECTION 6: PRICING ━━━━━━━━━━━ */}
          <section
            id="pricing"
            className="scroll-mt-[80px] bg-white dark:bg-neutral-950 px-6 py-16 text-gray-900 dark:text-gray-100"
          >
            <div className="max-w-[1240px] mx-auto">
              <div className="mb-14 text-left">
                <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Choose your plan
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                  Get started today, no credit card required.
                </p>
              </div>

              <div className="grid items-end gap-8 lg:grid-cols-3">
                {plans.map((plan) => {
                  const card = (
                    <div
                      className={`relative rounded-[35px] px-7 py-8 sm:px-9 sm:py-9 ${plan.featured ? "h-[500px] border border-lime-400/70 bg-[#1f1f1f] text-white shadow-[0_0_24px_rgba(132,204,22,0.35)]" : "bg-white dark:bg-neutral-900"}`}
                    >
                      {plan.badge && (
                        <span className="absolute right-6 top-6 rounded-full bg-green-600/30 px-4 py-1 text-xs font-semibold text-lime-300">
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="text-2xl font-semibold">{plan.name}</h3>
                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-5xl font-semibold leading-none">
                          {plan.price}
                        </span>
                        <span
                          className={`pb-1 text-sm ${plan.featured ? "text-zinc-300" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {plan.billing}
                        </span>
                      </div>
                      <p
                        className={`mt-4 min-h-12 text-sm leading-6 ${plan.featured ? "text-zinc-300" : "text-gray-600 dark:text-gray-400"}`}
                      >
                        {plan.description}
                      </p>
                      <button
                        onClick={() => handlePlanSelect(plan.name)}
                        className={`mt-7 h-[59px] w-full rounded-[13px] text-sm font-semibold transition ${
                          plan.featured
                            ? "bg-white text-gray-900 hover:bg-gray-100"
                            : "bg-[#272727] text-white hover:bg-[#1a1a1a]"
                        }`}
                      >
                        Upgrade Now
                      </button>
                      <div
                        className={`my-7 h-px ${plan.featured ? "bg-white/30" : "bg-gray-300 dark:bg-neutral-700"}`}
                      />
                      <ul className="space-y-4">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-sm"
                          >
                            <CheckIcon featured={plan.featured} />
                            <span
                              className={
                                plan.featured
                                  ? "text-zinc-200"
                                  : "text-gray-600 dark:text-gray-400"
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );

                  return (
                    <div
                      key={plan.name}
                      className="overflow-hidden rounded-[35px] shadow-[0_1px_12px_rgba(0,0,0,0.2)]"
                    >
                      {card}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ━━━━━━━━━━━ SECTION 7: USER REVIEWS & CTA ━━━━━━━━━━━ */}
          <ReviewPage onGetStarted={goToStart} />
          <style>{`
            @keyframes home-logos-slide {
              from {
                transform: translate3d(0, 0, 0);
              }
              to {
                transform: translate3d(calc(-100% - 40px), 0, 0);
              }
            }

            .home-logos-marquee {
              display: flex;
              gap: 40px;
              width: max-content;
            }

            .home-logos-track {
              display: flex;
              align-items: center;
              gap: 2.5rem;
              width: max-content;
              animation: home-logos-slide 34s linear infinite;
              will-change: transform;
            }

            .home-logo-item {
              filter: grayscale(100%) opacity(0.72);
              transition: filter 0.25s ease, transform 0.25s ease;
            }

            .home-logo-item:hover {
              filter: grayscale(0%) opacity(1);
              transform: translateY(-1px);
            }

            .home-logos-marquee:hover .home-logos-track {
              animation-play-state: paused;
            }

            @media (prefers-reduced-motion: reduce) {
              .home-logos-track {
                animation: none;
              }
            }
          `}</style>
        </main>

        <Footer />
      </div>
    </div>
  );
}
