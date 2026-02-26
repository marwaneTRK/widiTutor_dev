const plans = [
  {
    name: "Free",
    price: "$0",
    billing: "/month",
    description: "5 Days Free-Trail & 7 Days if you share with friends.",
    features: [
      "Learning videos",
      "One Quiz to try ",
      "Community support",
      "Chat with Tutor 2 Days",
    ],
    featured: false,
  },
  {
    name: "Pro",
    price: "$70",
    billing: "/Year",
    description: "Perfect for growing your knowledge , Unlimited learning.",
    features: [
      "Unlimited Learning",
      "Unlimited Videos",
      "Unlimited Quizzes",
      "Unlimited Conversation with Tutor",
    ],
    featured: true,
    badge: "Popular",
  },
  {
    name: "Basic",
    price: "$7",
    billing: "/month",
    description: "Limited Learning.",
    features: [
      "Learning videos",
      "5 Quizzes Per Day",
      "Dedicated manager",
      "Chat with Tutor",
    ],
    featured: false,
  },
];

function CheckIcon({ featured }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        featured ? "bg-white/15 text-lime-300" : "bg-zinc-900 text-zinc-100"
      }`}
      aria-hidden="true"
    >
      {"\u2713"}
    </span>
  );
}

export default function Pricing({
  onUpgradeNow = () => {
    window.alert("Upgrade flow is not configured yet.");
  },
}) {
  return (
    <section className="min-h-screen bg-white px-6 py-16 text-zinc-900 dark:bg-neutral-950 dark:text-zinc-100 sm:px-10">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-14 text-left">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose your plan
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Get started today , no credit card required .
          </p>
        </div>

        <div className="grid items-end gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const card = (
              <div
                className={`relative rounded-[35px] px-7 py-8 sm:px-9 sm:py-9 ${
                  plan.featured
                    ? "bg-[#1f1f1f] text-white"
                    : "bg-white text-zinc-900 dark:bg-neutral-900 dark:text-zinc-100"
                }`}
              >
                {plan.badge ? (
                  <span className="absolute right-6 top-6 rounded-full bg-green-600/30 px-4 py-1 text-xs font-semibold text-lime-300">
                    {plan.badge}
                  </span>
                ) : null}

                <h2 className="text-2xl font-semibold">{plan.name}</h2>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-semibold leading-none">
                    {plan.price}
                  </span>
                  <span
                    className={`pb-1 text-sm ${
                      plan.featured ? "text-zinc-300" : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {plan.billing}
                  </span>
                </div>

                <p
                  className={`mt-4 min-h-12 text-sm leading-6 ${
                    plan.featured ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {plan.description}
                </p>

                <button
                  type="button"
                  onClick={() => onUpgradeNow(plan)}
                  className={`mt-7 h-[59px] w-full rounded-[13px] text-sm font-semibold transition ${
                    plan.featured
                      ? "bg-white text-zinc-900 hover:bg-zinc-100"
                      : "bg-[#272727] text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Upgrade Now
                </button>

                <div
                  className={`my-7 h-px ${
                    plan.featured ? "bg-white/30" : "bg-zinc-300 dark:bg-neutral-700"
                  }`}
                />

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <CheckIcon featured={plan.featured} />
                      <span
                        className={plan.featured ? "text-zinc-200" : "text-zinc-600 dark:text-zinc-400"}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );

            if (plan.featured) {
              return (
                <div
                  key={plan.name}
                  className="rounded-[35px] bg-gradient-to-b from-lime-400 to-green-500 p-[2px] shadow-[0_0_22px_rgba(255,255,255,0.20)]"
                >
                  {card}
                </div>
              );
            }

            return (
              <div key={plan.name} className="shadow-[0_1px_12px_rgba(0,0,0,0.2)]">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
