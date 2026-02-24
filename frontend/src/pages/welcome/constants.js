import { Brain, ListChecks, MessageSquare, PlayCircle, Sparkles, Trophy, Zap } from "lucide-react";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const DEFAULT_SUGGESTIONS = [
  "Explain in simple terms",
  "Key takeaways?",
  "Give me a quiz question",
  "What should I learn next?",
];

export const WELCOME_MSG = {
  id: "welcome-assistant",
  role: "assistant",
  content: "Hi! I'm your AI tutor. Select a video and ask me anything about it — I'll help you understand, summarize, or quiz you. 🎓",
};

export const FEATURE_CARDS = [
  {
    icon: Sparkles, color: "#2f9d58", darkColor: "#4ade80",
    bgGrad: "linear-gradient(135deg,#edf7f1 0%,#d4f0e1 100%)",
    darkBg: "linear-gradient(135deg,#0d2b1a 0%,#0a2016 100%)",
    border: "#a8dfc0", darkBorder: "#1a4a2e",
    title: "AI Summary",
    desc: "Get a concise breakdown of the video — key concepts and takeaways in seconds.",
    action: "Generate Summary", tab: "summary",
  },
  {
    icon: ListChecks, color: "#1a6e9f", darkColor: "#60a5fa",
    bgGrad: "linear-gradient(135deg,#edf5fb 0%,#d0e8f7 100%)",
    darkBg: "linear-gradient(135deg,#0a1e2e 0%,#071828 100%)",
    border: "#a3cfee", darkBorder: "#1a3a55",
    title: "Practice Quiz",
    desc: "Test your understanding with AI-generated questions and instant feedback.",
    action: "Generate Quiz", tab: "quiz",
  },
  {
    icon: MessageSquare, color: "#7c3aed", darkColor: "#a78bfa",
    bgGrad: "linear-gradient(135deg,#f5f0ff 0%,#e6d9ff 100%)",
    darkBg: "linear-gradient(135deg,#1a0d2e 0%,#130820 100%)",
    border: "#c4a9f7", darkBorder: "#3a1a6e",
    title: "Ask Anything",
    desc: "Chat with your AI tutor about any part of the video, on demand.",
    action: null, tab: "chat",
  },
];

export const HOW_IT_WORKS = [
  { icon: PlayCircle, label: "Pick a video", desc: "Search to find educational content you want to master." },
  { icon: Brain, label: "AI analyses it", desc: "Our AI reads the full transcript and understands it deeply." },
  { icon: Zap, label: "Learn smarter", desc: "Use summaries, quizzes, and chat to absorb knowledge faster." },
  { icon: Trophy, label: "Test yourself", desc: "Quiz yourself to lock in understanding and track progress." },
];

export const QUIZ_LEVELS = [
  { id: "beginner", label: "Beginner", emoji: "🌱", desc: "Simple recall questions", color: "#2f9d58", dark: "#4ade80", bg: "#edf7f1", darkBg: "#0d2a1a", border: "#a8dfc0", darkBorder: "#1a4a2e" },
  { id: "intermediate", label: "Intermediate", emoji: "🔥", desc: "Applied understanding", color: "#1a6e9f", dark: "#60a5fa", bg: "#edf5fb", darkBg: "#0a1e2e", border: "#a3cfee", darkBorder: "#1a3a55" },
  { id: "advanced", label: "Advanced", emoji: "🧠", desc: "Deep analysis & edge cases", color: "#7c3aed", dark: "#a78bfa", bg: "#f5f0ff", darkBg: "#1a0d2e", border: "#c4a9f7", darkBorder: "#3a1a6e" },
  { id: "challenge", label: "Challenge", emoji: "⚡", desc: "Expert-level problem solving", color: "#b45309", dark: "#fbbf24", bg: "#fef9ec", darkBg: "#1a1008", border: "#f0d98b", darkBorder: "#3a2a0a" },
];
