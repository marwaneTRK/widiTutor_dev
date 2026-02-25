import { Loader2 } from "lucide-react";

export default function ProfileLoading({ dark, border }) {
  return (
    <div className={`flex min-h-screen items-center justify-center ${dark ? "bg-[#080f0b]" : "bg-[#f4f9f5]"}`}>
      <div
        className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm shadow-sm ${
          dark ? `${border} bg-[#0d1a11] text-[#6fb389]` : "border-[#d7dfda] bg-white text-[#495950]"
        }`}
      >
        <Loader2 size={16} className="animate-spin text-[#2e9a57]" />
        Loading profile...
      </div>
    </div>
  );
}
