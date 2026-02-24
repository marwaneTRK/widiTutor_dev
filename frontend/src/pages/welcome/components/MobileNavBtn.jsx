export default function MobileNavBtn({ icon, label, active, badge, dark: d, onClick }) {
  const Icon = icon;
  return (
    <button type="button" onClick={onClick}
      className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-all ${
        active ? "text-[#2f9d58]" : d ? "text-[#4a8a62]" : "text-[#9ab5a3]"
      }`}>
      <div className="relative">
        <Icon size={20} />
        {badge != null && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#2f9d58] text-[8px] font-black text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span className={`text-[10px] font-bold ${active ? "text-[#2f9d58]" : ""}`}>{label}</span>
      {active && <div className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#2f9d58]" />}
    </button>
  );
}
