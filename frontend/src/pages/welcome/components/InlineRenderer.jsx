import InlineCode from "./InlineCode";

export default function InlineRenderer({ text }) {
  const parts = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", val: text.slice(last, m.index) });
    const raw = m[0];
    if (raw.startsWith("`")) parts.push({ type: "code", val: raw.slice(1, -1) });
    else parts.push({ type: "bold", val: raw.slice(2, -2) });
    last = m.index + raw.length;
  }
  if (last < text.length) parts.push({ type: "text", val: text.slice(last) });

  return (
    <>
      {parts.map((p, i) => {
        if (p.type === "code") return <InlineCode key={i} text={p.val} />;
        if (p.type === "bold") return <strong key={i} className="font-black">{p.val}</strong>;
        return <span key={i}>{p.val}</span>;
      })}
    </>
  );
}
