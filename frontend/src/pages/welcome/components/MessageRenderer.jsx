import CodeBlock from "./CodeBlock";
import InlineRenderer from "./InlineRenderer";

export default function MessageRenderer({ content, isUser, dark: d }) {
  if (!content) return null;

  const segments = [];
  const re = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = re.exec(content)) !== null) {
    if (m.index > last) segments.push({ type: "text", val: content.slice(last, m.index) });
    segments.push({ type: "code", lang: m[1] || "", val: m[2].replace(/\n$/, "") });
    last = m.index + m[0].length;
  }
  if (last < content.length) segments.push({ type: "text", val: content.slice(last) });

  return (
    <div className="space-y-1">
      {segments.map((seg, si) => {
        if (seg.type === "code") {
          return <CodeBlock key={si} lang={seg.lang} code={seg.val} dark={d} />;
        }
        const lines = seg.val.split("\n").filter(l => l !== "" || si === 0);
        return (
          <div key={si} className="space-y-1">
            {lines.map((line, li) => {
              const bulletMatch = line.match(/^(\s*[-*•])\s+(.+)/);
              if (bulletMatch) {
                return (
                  <div key={li} className="flex items-start gap-2">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isUser ? "bg-white/60" : "bg-[#2f9d58]"}`} />
                    <span className="leading-relaxed"><InlineRenderer text={bulletMatch[2]} /></span>
                  </div>
                );
              }
              const numMatch = line.match(/^(\d+)\.\s+(.+)/);
              if (numMatch) {
                return (
                  <div key={li} className="flex items-start gap-2">
                    <span className={`shrink-0 text-xs font-black ${isUser ? "text-white/70" : "text-[#2f9d58]"}`}>{numMatch[1]}.</span>
                    <span className="leading-relaxed"><InlineRenderer text={numMatch[2]} /></span>
                  </div>
                );
              }
              const headMatch = line.match(/^(#{1,3})\s+(.+)/);
              if (headMatch) {
                const level = headMatch[1].length;
                const sz = level === 1 ? "text-sm font-black" : level === 2 ? "text-[13px] font-black" : "text-xs font-black";
                return <p key={li} className={`${sz} ${isUser ? "text-white" : d ? "text-[#c4e8d4]" : "text-[#0f2119]"}`}><InlineRenderer text={headMatch[2]} /></p>;
              }
              if (/^---+$/.test(line.trim())) {
                return <hr key={li} className={`my-1 border-0 border-t ${isUser ? "border-white/20" : d ? "border-[#1a4a2e]" : "border-[#dceae2]"}`} />;
              }
              if (line.trim() === "") return <div key={li} className="h-1" />;
              return <p key={li} className="leading-relaxed"><InlineRenderer text={line} /></p>;
            })}
          </div>
        );
      })}
    </div>
  );
}
