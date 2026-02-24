import { Sparkles } from "lucide-react";
import SummaryRenderer from "./SummaryRenderer";

export default function SummarySection({ summary, dark: d, text, sub }) {
  if (!summary) return null;

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${d ? "border-[#1a4a2e] bg-[#0d1a11]" : "border-[#c8e8d4] bg-white"}`}>
      <div className={`flex items-center justify-between border-b px-5 py-4 ${d ? "border-[#1a4a2e] bg-[#091510]" : "border-[#ddf0e6] bg-gradient-to-r from-[#f4fbf7] to-white"}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${d ? "bg-[#0a2016]" : "bg-[#edf7f1]"}`}>
            <Sparkles size={18} className="text-[#2f9d58]" />
          </div>
          <div>
            <h3 className={`font-black ${text}`}>AI Summary</h3>
            <p className={`text-[11px] ${sub}`}>Generated from the full video transcript</p>
          </div>
        </div>
        <div className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 sm:flex ${d ? "border-[#1a4a2e] bg-[#0a2016]" : "border-[#c8e8d4] bg-[#edf7f1]"}`}>
          <span className={`text-[10px] font-black uppercase tracking-wide ${d ? "text-[#4a8a62]" : "text-[#7a9e88]"}`}>
            {summary.trim().split(/\s+/).length} words
          </span>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7">
        <SummaryRenderer content={summary} dark={d} />
      </div>
    </div>
  );
}
