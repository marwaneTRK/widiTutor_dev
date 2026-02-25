import { Bell, Moon, Pencil, Sun } from "lucide-react";

export default function ProfileHeader({ firstName, blurEffect, dark, border, text, sub, onToggleDark }) {
  return (
    <header
      className={`relative overflow-hidden border-b px-5 py-4 ${border} ${
        dark ? "bg-[#080f0b]/95" : "bg-white/95"
      } backdrop-blur-md`}
    >
      <img
        src={blurEffect}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute right-0 top-0 h-full w-[420px] ${dark ? "opacity-20" : "opacity-45"}`}
      />
      <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between">
        <p className={`inline-flex items-center gap-2 text-lg font-semibold ${text}`}>
          <Pencil size={18} />
          Edit Profile
        </p>
        <div className={`flex items-center gap-3 ${sub}`}>
          <button
            type="button"
            onClick={onToggleDark}
            className={`grid h-9 w-9 place-items-center rounded-full border transition ${
              dark
                ? "border-[#1a3a24] bg-[#0d1a11] text-[#6fb389] hover:text-[#9ad9b2]"
                : "border-[#ced8d2] bg-white text-[#5f8a70] hover:text-[#2f9f58]"
            }`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            className={`grid h-9 w-9 place-items-center rounded-full border ${
              dark ? "border-[#1a3a24] bg-[#0d1a11]" : "border-[#ced8d2] bg-white"
            }`}
          >
            <Bell size={16} />
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#1f2421] text-sm font-semibold text-white">
            {(firstName || "M").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
