import { Brain, Loader2, RotateCcw, Trophy, Zap } from "lucide-react";
import { QUIZ_LEVELS } from "../constants";

export default function QuizSection({
  quiz,
  selectedAnswers,
  quizLevel,
  quizCache,
  quizLoading,
  retryMode,
  dark: d,
  text,
  sub,
  onGenerateQuiz,
  onRetryWrongAnswers,
  onResetQuiz,
  onSelectAnswer,
}) {
  if (quiz.length === 0) return null;

  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalCorrect = Object.entries(selectedAnswers).filter(([qi, ans]) => ans === quiz[+qi]?.correct).length;
  const totalWrong = totalAnswered - totalCorrect;
  const allDone = totalAnswered === quiz.length;
  const currentLevel = QUIZ_LEVELS.find(l => l.id === quizLevel) || QUIZ_LEVELS[1];
  const scorePercent = allDone ? Math.round((totalCorrect / quiz.length) * 100) : null;

  return (
    <div>
      <div className={`mb-5 overflow-hidden rounded-2xl border shadow-sm ${d ? "border-[#1a3a28] bg-[#0d1a11]" : "border-[#dceae2] bg-white"}`}>
        <div className="flex flex-wrap items-center gap-3 px-5 pt-4 pb-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${d ? "bg-[#0a1e2e]" : "bg-[#edf5fb]"}`}>
            <Brain size={18} className={d ? "text-[#60a5fa]" : "text-[#1a6e9f]"} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-black ${text}`}>{retryMode ? "Retry Mode" : "Knowledge Quiz"}</h3>
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black"
                style={{ background: d ? currentLevel.darkBg : currentLevel.bg, color: d ? currentLevel.dark : currentLevel.color, border: `1px solid ${d ? currentLevel.darkBorder : currentLevel.border}` }}>
                {currentLevel.emoji} {currentLevel.label}
              </span>
              {retryMode && (
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black ${d ? "border-[#7a2020] bg-[#1a0808] text-[#f87171]" : "border-[#f3c7c7] bg-[#fff5f5] text-[#a34242]"}`}>
                  ✗ {quiz.length} wrong answered
                </span>
              )}
            </div>
            <p className={`text-[11px] ${sub}`}>{totalAnswered}/{quiz.length} answered · {totalCorrect} correct{totalWrong > 0 ? ` · ${totalWrong} wrong` : ""}</p>
          </div>
          {allDone && (
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
              scorePercent >= 80 ? d ? "border-[#1a4a2e] bg-[#0d2a1a]" : "border-[#c8e8d4] bg-[#edf7f1]"
              : scorePercent >= 50 ? d ? "border-[#3a2a0a] bg-[#1a1008]" : "border-[#f0d98b] bg-[#fef9ec]"
              : d ? "border-[#7a2020] bg-[#1a0808]" : "border-[#f3c7c7] bg-[#fff5f5]"
            }`}>
              <Trophy size={14} className={scorePercent >= 80 ? "text-[#2f9d58]" : scorePercent >= 50 ? "text-[#b45309]" : "text-[#e05c5c]"} />
              <span className={`text-sm font-black ${
                scorePercent >= 80 ? d ? "text-[#4ade80]" : "text-[#1a6636]"
                : scorePercent >= 50 ? d ? "text-[#fbbf24]" : "text-[#92400e]"
                : d ? "text-[#f87171]" : "text-[#a34242]"
              }`}>{scorePercent}%</span>
            </div>
          )}
        </div>

        <div className={`mx-5 mb-3 h-1.5 overflow-hidden rounded-full ${d ? "bg-[#1a3a28]" : "bg-[#e8f4ee]"}`}>
          <div className="h-full rounded-full bg-[#2f9d58] transition-all duration-500"
            style={{ width: `${quiz.length > 0 ? (totalAnswered / quiz.length) * 100 : 0}%` }} />
        </div>

        <div className={`border-t px-5 py-3 ${d ? "border-[#1a3a28]" : "border-[#edf5f0]"}`}>
          <p className={`mb-2 text-[10px] font-black uppercase tracking-widest ${sub}`}>Difficulty Level</p>
          <div className="flex flex-wrap gap-1.5">
            {QUIZ_LEVELS.map(lvl => {
              const isCached = quizCache[lvl.id]?.length > 0;
              const isActive = quizLevel === lvl.id;
              return (
                <button key={lvl.id} type="button"
                  onClick={() => onGenerateQuiz(lvl.id)}
                  disabled={quizLoading}
                  title={isCached ? `Switch to ${lvl.label} (cached)` : `Generate ${lvl.label} quiz`}
                  className="relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    background: isActive ? (d ? lvl.darkBg : lvl.bg) : "transparent",
                    borderColor: isActive ? (d ? lvl.darkBorder : lvl.border) : (d ? "#1a3a28" : "#dceae2"),
                    color: isActive ? (d ? lvl.dark : lvl.color) : (d ? "#4a8a62" : "#7a9e88"),
                    fontWeight: isActive ? 900 : 600,
                  }}>
                  {lvl.emoji} {lvl.label}
                  {isCached && !isActive && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#2f9d58]" title="Cached" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {allDone && (
          <div className={`flex flex-wrap gap-2 border-t px-5 py-3 ${d ? "border-[#1a3a28]" : "border-[#edf5f0]"}`}>
            {totalWrong > 0 && (
              <button type="button" onClick={onRetryWrongAnswers}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black transition hover:scale-105 ${
                  d ? "border-[#7a2020] bg-[#1a0808] text-[#f87171] hover:bg-[#2a0a0a]"
                    : "border-[#f3c7c7] bg-[#fff5f5] text-[#a34242] hover:bg-[#ffe8e8]"
                }`}>
                <RotateCcw size={12} /> Retry {totalWrong} wrong answer{totalWrong > 1 ? "s" : ""}
              </button>
            )}
            <button type="button" onClick={onResetQuiz}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black transition hover:scale-105 ${
                d ? "border-[#1a4a2e] bg-[#0d2a1a] text-[#4ade80] hover:bg-[#0a3a1a]"
                  : "border-[#a8dfc0] bg-[#edf7f1] text-[#1a6636] hover:bg-[#d8f0e4]"
              }`}>
              <RotateCcw size={12} /> Redo this quiz
            </button>
            <button type="button" onClick={() => onGenerateQuiz(quizLevel, true)} disabled={quizLoading}
              className="inline-flex items-center gap-2 rounded-full bg-[#2f9d58] px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#268248] hover:scale-105 disabled:opacity-50">
              {quizLoading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
              New {QUIZ_LEVELS.find(l=>l.id===quizLevel)?.emoji} {QUIZ_LEVELS.find(l=>l.id===quizLevel)?.label} quiz
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {quiz.map((item, index) => {
          const correctAnswer = item.correct;
          const userAnswer = selectedAnswers[index];
          const hasAnswered = userAnswer !== undefined;
          const userWasRight = hasAnswered && userAnswer === correctAnswer;

          return (
            <div key={`${item.question}-${index}`}
              className={`rounded-2xl border p-4 shadow-sm transition-all sm:p-5 ${
                !hasAnswered
                  ? d ? "border-[#1a3a28] bg-[#0d1a11]" : "border-[#dceae2] bg-white"
                  : userWasRight
                    ? d ? "border-[#2f9d58] bg-[#08200f]" : "border-[#a8dfc0] bg-[#f0faf5]"
                    : d ? "border-[#5a2020] bg-[#130808]" : "border-[#f3c7c7] bg-[#fff8f8]"
              }`}>

              <div className="mb-4 flex items-start gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white mt-0.5 ${
                  !hasAnswered ? "bg-[#1a6e9f]"
                  : userWasRight ? "bg-[#2f9d58]"
                  : "bg-[#e05c5c]"
                }`}>{index + 1}</span>
                <p className={`font-bold leading-snug ${text}`}>{item.question}</p>
              </div>

              <div className="space-y-2 pl-9">
                {(item.options || []).map(option => {
                  const isTheCorrectAnswer = option === correctAnswer;
                  const isWhatUserPicked = option === userAnswer;
                  let btnCls, iconCls, iconSymbol, labelCls;

                  if (!hasAnswered) {
                    btnCls = d
                      ? "border-[#1a3a28] bg-[#0a1a0e] hover:border-[#2f9d58] hover:bg-[#0d2a1a] cursor-pointer"
                      : "border-[#e0ece4] bg-[#f8fbf9] hover:border-[#2f9d58] hover:bg-[#edf7f1] cursor-pointer";
                    iconCls = d ? "border-[#2a5a3a] bg-transparent" : "border-[#c8dece] bg-transparent";
                    iconSymbol = null;
                    labelCls = d ? "text-[#9ad4b2]" : "text-[#2d4e38]";
                  } else if (isTheCorrectAnswer) {
                    btnCls = d
                      ? "border-[#2f9d58] bg-[#0d2a1a] cursor-default"
                      : "border-[#2f9d58] bg-[#e8f7ee] cursor-default";
                    iconCls = "border-[#2f9d58] bg-[#2f9d58]";
                    iconSymbol = "✓";
                    labelCls = d ? "text-[#4ade80] font-black" : "text-[#1a6636] font-black";
                  } else if (isWhatUserPicked) {
                    btnCls = d
                      ? "border-[#7a2020] bg-[#1a0808] cursor-default"
                      : "border-[#e05c5c] bg-[#fff0f0] cursor-default";
                    iconCls = "border-[#e05c5c] bg-[#e05c5c]";
                    iconSymbol = "✗";
                    labelCls = d ? "text-[#f87171]" : "text-[#a34242]";
                  } else {
                    btnCls = d
                      ? "border-[#1a2a20] bg-[#080f0b] opacity-35 cursor-default"
                      : "border-[#e8e8e8] bg-[#f9f9f9] opacity-40 cursor-default";
                    iconCls = d ? "border-[#1a3a28] bg-transparent" : "border-[#d4d4d4] bg-transparent";
                    iconSymbol = null;
                    labelCls = d ? "text-[#4a7a62]" : "text-[#a0a0a0]";
                  }

                  return (
                    <button key={option} type="button"
                      onClick={() => !hasAnswered && onSelectAnswer(index, option)}
                      disabled={hasAnswered}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-200 ${btnCls}`}>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-black text-white ${iconCls}`}>
                        {iconSymbol}
                      </span>
                      <span className={`flex-1 ${labelCls}`}>{option}</span>
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className={`mt-4 flex items-start gap-3 rounded-xl px-4 py-3 pl-12 ${
                  userWasRight
                    ? d ? "bg-[#0d2a1a] border border-[#2f9d58]/40" : "bg-[#e8f7ee] border border-[#a8dfc0]"
                    : d ? "bg-[#1a0808] border border-[#e05c5c]/30" : "bg-[#fff0f0] border border-[#f3c7c7]"
                }`}>
                  <span className={`text-lg leading-none ${userWasRight ? "text-[#2f9d58]" : "text-[#e05c5c]"}`}>
                    {userWasRight ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className={`text-xs font-black ${userWasRight ? d ? "text-[#4ade80]" : "text-[#1a6636]" : d ? "text-[#f87171]" : "text-[#a34242]"}`}>
                      {userWasRight ? "Correct! Well done." : "Not quite right."}
                    </p>
                    {!userWasRight && (
                      <p className={`mt-0.5 text-xs ${d ? "text-[#9ad4b2]" : "text-[#3a6a4a]"}`}>
                        The correct answer is: <strong>{correctAnswer}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
