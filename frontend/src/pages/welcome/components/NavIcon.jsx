export default function NavIcon({ icon, label, active, dark: d, onClick }) {
  const Icon = icon;
  return (
    <button type="button" onClick={onClick} title={label}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
        active ? "bg-[#2f9d58] text-white shadow-md"
                : d ? "text-[#4a8a62] hover:bg-[#0d2a1a] hover:text-[#4ade80]"
                    : "text-[#7a9e88] hover:bg-[#f0faf3] hover:text-[#1a3325]"
      }`}>
      <Icon size={18} />
      <span className={`pointer-events-none absolute left-[115%] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold opacity-0 shadow-lg transition group-hover:opacity-100 ${
        d ? "bg-[#0d2a1a] text-[#4ade80]" : "bg-[#1a3325] text-white"
      }`}>{label}</span>
    </button>
  );
}
