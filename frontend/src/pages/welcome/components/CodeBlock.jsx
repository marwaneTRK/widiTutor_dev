import { Check, Copy } from "lucide-react";
import useCopy from "../hooks/useCopy";
import { colorLine } from "../utils/syntaxHighlight";

export default function CodeBlock({ lang, code }) {
  const [copied, copy] = useCopy();
  const lines = code.split("\n");
  const displayLang = lang || "code";

  const langColors = {
    python: { bg: "#3776ab22", text: "#4b9cd3", dot: "#4b9cd3" },
    javascript: { bg: "#f7df1e22", text: "#f7df1e", dot: "#f7df1e" },
    js: { bg: "#f7df1e22", text: "#f7df1e", dot: "#f7df1e" },
    typescript: { bg: "#3178c622", text: "#3d8fcf", dot: "#3d8fcf" },
    ts: { bg: "#3178c622", text: "#3d8fcf", dot: "#3d8fcf" },
    bash: { bg: "#2f9d5822", text: "#4ade80", dot: "#4ade80" },
    sh: { bg: "#2f9d5822", text: "#4ade80", dot: "#4ade80" },
    sql: { bg: "#e97c0922", text: "#f59e0b", dot: "#f59e0b" },
    html: { bg: "#e34c2622", text: "#e87058", dot: "#e87058" },
    css: { bg: "#1572b622", text: "#38bdf8", dot: "#38bdf8" },
    json: { bg: "#ffffff11", text: "#d4d4d4", dot: "#d4d4d4" },
    java: { bg: "#ed272722", text: "#f87171", dot: "#f87171" },
    rust: { bg: "#ce412b22", text: "#fb923c", dot: "#fb923c" },
    go: { bg: "#00acd722", text: "#67e8f9", dot: "#67e8f9" },
    c: { bg: "#a8b9cc22", text: "#c8d8e8", dot: "#c8d8e8" },
    cpp: { bg: "#00599c22", text: "#60a5fa", dot: "#60a5fa" },
  };
  const lc = langColors[displayLang.toLowerCase()] || { bg: "#ffffff11", text: "#9ca3af", dot: "#9ca3af" };

  return (
    <div className="my-2 overflow-hidden rounded-xl border border-[#1e3a2a] shadow-lg" style={{ fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace" }}>
      <div className="flex items-center justify-between bg-[#0d1117] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md px-2 py-0.5" style={{ background: lc.bg }}>
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: lc.dot }} />
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: lc.text }}>
              {displayLang}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 rounded-lg border border-[#2a3a2a] bg-[#161b22] px-2.5 py-1 text-[10px] font-bold text-[#8b949e] transition hover:border-[#2f9d58] hover:text-[#4ade80]"
        >
          {copied ? <Check size={11} className="text-[#4ade80]" /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="overflow-x-auto bg-[#0d1117] px-0 py-3">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => {
              const segments = colorLine(line);
              return (
                <tr key={i} className="group hover:bg-[#ffffff08]">
                  <td className="select-none border-r border-[#21262d] pr-3 pl-4 text-right text-[11px] leading-6 text-[#3d4c3d]"
                    style={{ width: 36, userSelect: "none" }}>
                    {i + 1}
                  </td>
                  <td className="pl-4 pr-6 text-[12.5px] leading-6 text-[#d4d4d4]">
                    {segments.map((seg, si) =>
                      seg.cls
                        ? <span key={si} className={seg.cls}>{seg.text}</span>
                        : <span key={si}>{seg.text}</span>
                    )}
                    {line === "" && <span>&nbsp;</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
