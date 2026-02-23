import { Bell, Globe, Pencil } from "lucide-react";

export default function ProfileHeader({ firstName, blurEffect }) {
  return (
    <header className="relative overflow-hidden border-b border-[#dfe6e1] bg-[#f8faf9] px-5 py-4">
      <img
        src={blurEffect}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-[420px] opacity-45"
      />
      <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between">
        <p className="inline-flex items-center gap-2 text-lg font-semibold text-[#1f2623]">
          <Pencil size={18} />
          Edit Profile
        </p>
        <div className="flex items-center gap-3 text-[#505b54]">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#ced8d2] bg-white"
          >
            <Globe size={16} />
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#ced8d2] bg-white"
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
