export default function InlineCode({ text }) {
  return (
    <code className="mx-0.5 rounded-md border border-[#2a3a2a] bg-[#0d1117] px-1.5 py-0.5 text-[12px] font-mono text-[#4ade80]">
      {text}
    </code>
  );
}
