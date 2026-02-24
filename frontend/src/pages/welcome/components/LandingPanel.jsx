import { BookOpen, Loader2, Search, Zap } from "lucide-react";
import { FEATURE_CARDS, HOW_IT_WORKS } from "../constants";

export default function LandingPanel({ transcript, transcriptLoading, onSummary, onQuiz, summaryLoading, quizLoading, selectedVideo, dark: d }) {
  const text = d ? "text-[#c4e8d4]" : "text-[#0f2119]";
  const sub = d ? "text-[#4a8a62]" : "text-[#7a9e88]";
  const card = d ? "border-[#1a3a28] bg-[#0d1f16]" : "border-[#dceae2] bg-white";

  return (
    <div className="px-4 pb-10 pt-6 sm:px-5">
      {transcriptLoading && (
        <div className={`mb-5 flex items-center gap-3 rounded-2xl border px-4 py-4 shadow-sm ${d ? "border-[#1a4a2e] bg-[#0d1f16]" : "border-[#d6eedf] bg-white"}`}>
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${d ? "bg-[#0a2016]" : "bg-[#edf7f1]"}`}>
            <Loader2 size={18} className="animate-spin text-[#2f9d58]" />
          </div>
          <div>
            <p className={`text-sm font-bold ${text}`}>Analysing video content…</p>
            <p className={`text-xs ${sub}`}>AI is reading the transcript to prepare your learning tools</p>
          </div>
          <div className="ml-auto flex gap-1">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#2f9d58]"
                style={{ animation: "widiPulse 1.2s ease-in-out infinite", animationDelay: `${i*180}ms` }} />
            ))}
          </div>
        </div>
      )}

      {!selectedVideo && !transcriptLoading && (
        <div className={`mb-6 flex flex-col items-center justify-center rounded-2xl border py-12 text-center ${d ? "border-[#1a4a2e] bg-[#0d1f16]" : "border-[#dceae2] bg-white"}`}>
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${d ? "bg-[#0a2016]" : "bg-[#edf7f1]"}`}>
            <Search size={28} className="text-[#2f9d58]" />
          </div>
          <p className={`text-base font-black ${text}`}>Search to start learning</p>
          <p className={`mt-1.5 max-w-xs text-sm ${sub}`}>Use the search bar above to find any topic. Your AI tutor is ready to help once you pick a video.</p>
        </div>
      )}

      {selectedVideo && (
        <div className={`mb-6 overflow-hidden rounded-2xl border shadow-sm ${d ? "border-[#1a4a2e] bg-[#0d1f16]" : "border-[#c8e2d4] bg-white"}`}>
          <div className="flex">
            <div className="w-1 shrink-0 bg-gradient-to-b from-[#2f9d58] to-[#1a6636]" />
            <div className="flex flex-1 items-center gap-4 px-4 py-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${d ? "bg-[#0a2016]" : "bg-[#edf7f1]"}`}>
                <BookOpen size={20} className="text-[#2f9d58]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-widest ${sub}`}>Now Studying</p>
                <p className={`mt-0.5 font-bold leading-snug truncate ${text}`}>{selectedVideo.title}</p>
                <p className={`mt-0.5 text-xs ${sub}`}>{selectedVideo.channel}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-4 sm:flex">
                <div className="text-center">
                  <div className="text-xl font-black text-[#2f9d58]">AI</div>
                  <div className={`text-[10px] font-semibold ${sub}`}>Powered</div>
                </div>
                <div className={`h-8 w-px ${d ? "bg-[#1a4a2e]" : "bg-[#dceae2]"}`} />
                <div className="text-center">
                  <div className="text-xl font-black text-[#2f9d58]">3</div>
                  <div className={`text-[10px] font-semibold ${sub}`}>Tools Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className={`mb-3 text-[10px] font-black uppercase tracking-widest ${sub}`}>Your Learning Toolkit</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {FEATURE_CARDS.map(card => {
          const Icon = card.icon;
          const loading = card.tab === "summary" ? summaryLoading : card.tab === "quiz" ? quizLoading : false;
          const disabled = !transcript || transcriptLoading;
          const color = d ? card.darkColor : card.color;
          return (
            <div key={card.title}
              className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: d ? card.darkBg : card.bgGrad, borderColor: d ? card.darkBorder : card.border }}>
              <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full opacity-10" style={{ background: color }} />
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}22` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h4 className={`mb-1.5 font-black ${d ? "text-[#d4f0e1]" : "text-[#0f2119]"}`}>{card.title}</h4>
              <p className={`mb-4 text-xs leading-relaxed ${d ? "text-[#4a7a62]" : "text-[#4a6456]"}`}>{card.desc}</p>
              {card.action ? (
                <button type="button"
                  onClick={card.tab === "summary" ? onSummary : onQuiz}
                  disabled={disabled || loading}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
                  style={{ background: disabled ? (d ? "#1a3a2a" : "#9ab5a3") : color }}>
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                  {loading ? "Generating…" : card.action}
                </button>
              ) : (
                <p className="text-center text-xs font-bold" style={{ color }}>Available in the chat panel →</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7">
        <p className={`mb-3 text-[10px] font-black uppercase tracking-widest ${sub}`}>How WidiTutor Works</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${card}`}>
                <div className="relative shrink-0">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${d ? "bg-[#0a2016]" : "bg-[#f4f9f5]"}`}>
                    <Icon size={16} className="text-[#2f9d58]" />
                  </div>
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2f9d58] text-[8px] font-black text-white">{i+1}</span>
                </div>
                <div>
                  <p className={`text-sm font-bold ${text}`}>{step.label}</p>
                  <p className={`mt-0.5 text-xs leading-relaxed ${sub}`}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-4 sm:items-center ${d ? "border-[#1a4a2e] bg-[#0a1a10]" : "border-[#d6eedf] bg-gradient-to-r from-[#f0faf4] to-[#e8f7ee]"}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f9d58]">
          <Zap size={14} className="text-white" />
        </div>
        <p className={`text-xs leading-relaxed ${d ? "text-[#4a8a62]" : "text-[#2d4e38]"}`}>
          <span className="font-black text-[#2f9d58]">Pro tip:</span>{" "}
          Watch the video first, then generate a summary — retention increases by up to 40% with active recall.
        </p>
      </div>
    </div>
  );
}
