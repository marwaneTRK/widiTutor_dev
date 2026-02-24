import { Loader2 } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eff2f1]">
      <div className="flex items-center gap-2 rounded-xl border border-[#d7dfda] bg-white px-5 py-3 text-sm text-[#495950] shadow-sm">
        <Loader2 size={16} className="animate-spin text-[#2e9a57]" />
        Loading profile...
      </div>
    </div>
  );
}
