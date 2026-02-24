import { readingTime } from "../utils/summary";

function SummaryInline({ text }) {
  const parts = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ t: "plain", v: text.slice(last, m.index) });
    const raw = m[0];
    if (raw.startsWith("**")) parts.push({ t: "bold", v: raw.slice(2, -2) });
    else if (raw.startsWith("*")) parts.push({ t: "italic", v: raw.slice(1, -1) });
    else parts.push({ t: "code", v: raw.slice(1, -1) });
    last = m.index + raw.length;
  }
  if (last < text.length) parts.push({ t: "plain", v: text.slice(last) });
  return (
    <>
      {parts.map((p, i) => {
        if (p.t === "bold") return <strong key={i} className="font-black">{p.v}</strong>;
        if (p.t === "italic") return <em key={i} className="italic">{p.v}</em>;
        if (p.t === "code") return <code key={i} className="mx-0.5 rounded-md bg-[#0d1117] px-1.5 py-0.5 text-[11px] font-mono text-[#4ade80]">{p.v}</code>;
        return <span key={i}>{p.v}</span>;
      })}
    </>
  );
}

export default function SummaryRenderer({ content, dark: d }) {
  if (!content?.trim()) return null;

  const lines = content.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) { i++; continue; }

    if (/^#\s+/.test(trimmed)) {
      blocks.push({ type: "h1", text: trimmed.replace(/^#\s+/, "") });
      i++; continue;
    }

    if (/^##\s+/.test(trimmed)) {
      blocks.push({ type: "h2", text: trimmed.replace(/^##\s+/, "") });
      i++; continue;
    }

    if (/^###\s+/.test(trimmed)) {
      blocks.push({ type: "h3", text: trimmed.replace(/^###\s+/, "") });
      i++; continue;
    }

    if (trimmed.endsWith(":") && trimmed.length < 80 && !/^[-*•]/.test(trimmed)) {
      blocks.push({ type: "h2", text: trimmed.slice(0, -1) });
      i++; continue;
    }

    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      i++; continue;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*•]\s+/, ""));
        i++;
      }
      blocks.push({ type: "bullets", items });
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({ type: "numbered", items });
      continue;
    }

    const kvMatch = trimmed.match(/^([^:]{2,40}):\s+(.{10,})$/);
    if (kvMatch && !trimmed.endsWith(":")) {
      blocks.push({ type: "kv", key: kvMatch[1], value: kvMatch[2] });
      i++; continue;
    }

    if (/^[>!]/.test(trimmed) || /^(note|tip|important|warning|key takeaway)[:]/i.test(trimmed)) {
      const calloutText = trimmed.replace(/^[>!]\s*/, "").replace(/^(note|tip|important|warning|key takeaway):\s*/i, "");
      blocks.push({ type: "callout", text: calloutText });
      i++; continue;
    }

    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3}\s|[-*•]\s|\d+[.)]\s|[-*_]{3,}$|[>!])/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "para", text: paraLines.join(" ") });
    }
  }

  const headColor = d ? "text-[#c4e8d4]" : "text-[#0f2119]";
  const subColor = d ? "text-[#8ad4b0]" : "text-[#1a6636]";
  const bodyColor = d ? "text-[#9ad4b2]" : "text-[#2d4e38]";
  const muteColor = d ? "text-[#4a8a62]" : "text-[#7a9e88]";
  const bulletDot = d ? "bg-[#2f9d58]" : "bg-[#2f9d58]";
  const dividerCls = d ? "border-[#1a4a2e]" : "border-[#dceae2]";
  const kvBg = d ? "bg-[#0a2016] border-[#1a4a2e]" : "bg-[#f0faf5] border-[#c8e8d4]";
  const calloutBg = d ? "bg-[#0a1e2e] border-[#1a4a55] text-[#7dd3fc]" : "bg-[#eff8ff] border-[#93c5fd] text-[#1e4d8c]";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={`h-px flex-1 ${dividerCls} border-t`} />
        <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest ${muteColor}`}>
          ⏱ {readingTime(content)}
        </span>
        <div className={`h-px flex-1 ${dividerCls} border-t`} />
      </div>

      {blocks.map((block, bi) => {
        switch (block.type) {
          case "h1":
            return (
              <div key={bi} className="pt-1">
                <h2 className={`text-xl font-black leading-tight tracking-tight ${headColor}`}>
                  <SummaryInline text={block.text} />
                </h2>
                <div className="mt-1.5 h-0.5 w-10 rounded-full bg-[#2f9d58]" />
              </div>
            );

          case "h2":
            return (
              <div key={bi} className={`flex items-center gap-3 pt-2 ${bi > 0 ? "border-t " + dividerCls : ""}`}>
                <div className="h-4 w-1 shrink-0 rounded-full bg-[#2f9d58]" />
                <h3 className={`text-[15px] font-black leading-snug ${subColor}`}>
                  <SummaryInline text={block.text} />
                </h3>
              </div>
            );

          case "h3":
            return (
              <h4 key={bi} className={`text-[13px] font-black uppercase tracking-wide ${muteColor}`}>
                <SummaryInline text={block.text} />
              </h4>
            );

          case "divider":
            return <hr key={bi} className={`border-t ${dividerCls}`} />;

          case "bullets":
            return (
              <ul key={bi} className="space-y-2">
                {block.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-3">
                    <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${bulletDot}`} />
                    <span className={`text-sm leading-relaxed ${bodyColor}`}>
                      <SummaryInline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "numbered":
            return (
              <ol key={bi} className="space-y-2">
                {block.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2f9d58] text-[10px] font-black text-white mt-0.5">
                      {ii + 1}
                    </span>
                    <span className={`text-sm leading-relaxed ${bodyColor}`}>
                      <SummaryInline text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            );

          case "kv":
            return (
              <div key={bi} className={`flex flex-col gap-0.5 rounded-xl border px-4 py-3 sm:flex-row sm:items-baseline sm:gap-3 ${kvBg}`}>
                <span className={`shrink-0 text-[11px] font-black uppercase tracking-wide ${subColor}`}>
                  {block.key}
                </span>
                <span className={`text-sm leading-relaxed ${bodyColor}`}>
                  <SummaryInline text={block.value} />
                </span>
              </div>
            );

          case "callout":
            return (
              <div key={bi} className={`flex items-start gap-3 rounded-xl border-l-4 border-[#3b82f6] px-4 py-3 ${calloutBg}`}>
                <span className="mt-0.5 shrink-0 text-base">💡</span>
                <p className="text-sm leading-relaxed">
                  <SummaryInline text={block.text} />
                </p>
              </div>
            );

          case "para":
          default:
            return (
              <p key={bi} className={`text-sm leading-[1.85] ${bodyColor}`}>
                <SummaryInline text={block.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
