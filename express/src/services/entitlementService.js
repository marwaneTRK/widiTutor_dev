const DAY_MS = 24 * 60 * 60 * 1000;
const BASIC_DAILY_QUIZ_LIMIT = 5;
const BASIC_DAILY_CHAT_LIMIT = 20;
const FREE_CHAT_DAYS = 2;

const normalizePlan = (plan) => {
  const value = String(plan || "free").toLowerCase();
  if (value === "basic" || value === "pro" || value === "free") {
    return value;
  }
  return "free";
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const resetDailyUsageIfNeeded = async (user) => {
  const today = todayKey();
  if (user.dailyUsageDate === today) {
    return;
  }
  user.dailyUsageDate = today;
  user.dailyQuizCount = 0;
  user.dailyChatCount = 0;
  await user.save();
};

const getPlanFeatures = (plan) => {
  const normalized = normalizePlan(plan);
  if (normalized === "pro") {
    return {
      plan: "pro",
      canUseQuiz: true,
      canUseChat: true,
      quizDailyLimit: null,
      chatDailyLimit: null,
      chatWindowDays: null,
    };
  }

  if (normalized === "basic") {
    return {
      plan: "basic",
      canUseQuiz: true,
      canUseChat: true,
      quizDailyLimit: BASIC_DAILY_QUIZ_LIMIT,
      chatDailyLimit: BASIC_DAILY_CHAT_LIMIT,
      chatWindowDays: null,
    };
  }

  return {
    plan: "free",
    canUseQuiz: false,
    canUseChat: true,
    quizDailyLimit: 0,
    chatDailyLimit: null,
    chatWindowDays: FREE_CHAT_DAYS,
  };
};

const getFreeChatRemainingDays = (user) => {
  const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
  const now = new Date();
  const elapsedDays = Math.floor((now - createdAt) / DAY_MS);
  return Math.max(0, FREE_CHAT_DAYS - elapsedDays);
};

const assertQuizAccess = async (user) => {
  await resetDailyUsageIfNeeded(user);
  const features = getPlanFeatures(user.subscriptionPlan);
  if (!features.canUseQuiz) {
    return {
      allowed: false,
      statusCode: 403,
      message: "Quizzes are not available on the Free plan. Upgrade to Basic or Pro.",
      usage: {
        plan: features.plan,
        quizDailyLimit: features.quizDailyLimit,
        quizUsedToday: user.dailyQuizCount || 0,
      },
    };
  }

  if (features.quizDailyLimit !== null && user.dailyQuizCount >= features.quizDailyLimit) {
    return {
      allowed: false,
      statusCode: 429,
      message: `Daily quiz limit reached (${features.quizDailyLimit}/${features.quizDailyLimit}) for Basic plan.`,
      usage: {
        plan: features.plan,
        quizDailyLimit: features.quizDailyLimit,
        quizUsedToday: user.dailyQuizCount || 0,
      },
    };
  }

  return {
    allowed: true,
    usage: {
      plan: features.plan,
      quizDailyLimit: features.quizDailyLimit,
      quizUsedToday: user.dailyQuizCount || 0,
    },
  };
};

const markQuizUsage = async (user) => {
  await resetDailyUsageIfNeeded(user);
  user.dailyQuizCount += 1;
  await user.save();
};

const assertChatAccess = async (user) => {
  await resetDailyUsageIfNeeded(user);
  const features = getPlanFeatures(user.subscriptionPlan);
  if (!features.canUseChat) {
    return {
      allowed: false,
      statusCode: 403,
      message: "Chat is not available on your current plan.",
      usage: null,
    };
  }

  if (features.plan === "free") {
    const remainingDays = getFreeChatRemainingDays(user);
    if (remainingDays <= 0) {
      return {
        allowed: false,
        statusCode: 403,
        message: "Free chat is available only for your first 2 days. Upgrade to continue.",
        usage: {
          plan: features.plan,
          freeChatDaysRemaining: 0,
        },
      };
    }
    return {
      allowed: true,
      usage: {
        plan: features.plan,
        freeChatDaysRemaining: remainingDays,
      },
    };
  }

  if (features.chatDailyLimit !== null && user.dailyChatCount >= features.chatDailyLimit) {
    return {
      allowed: false,
      statusCode: 429,
      message: `Daily chat limit reached (${features.chatDailyLimit}/${features.chatDailyLimit}) for Basic plan.`,
      usage: {
        plan: features.plan,
        chatDailyLimit: features.chatDailyLimit,
        chatUsedToday: user.dailyChatCount || 0,
      },
    };
  }

  return {
    allowed: true,
    usage: {
      plan: features.plan,
      chatDailyLimit: features.chatDailyLimit,
      chatUsedToday: user.dailyChatCount || 0,
    },
  };
};

const markChatUsage = async (user) => {
  await resetDailyUsageIfNeeded(user);
  user.dailyChatCount += 1;
  await user.save();
};

module.exports = {
  getPlanFeatures,
  assertQuizAccess,
  markQuizUsage,
  assertChatAccess,
  markChatUsage,
  resetDailyUsageIfNeeded,
};

