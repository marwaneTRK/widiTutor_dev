import { Pencil, Trash2 } from "lucide-react";

export default function ProfileSidebar({
  profilePictureUrl,
  displayName,
  progressGoals,
  onProgressGoalsChange,
  onProfilePictureChange,
  onDeleteAccount,
  saving,
}) {
  return (
    <aside className="border-b border-[#dde5df] p-5 md:border-b-0 md:border-r">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="h-36 w-36 rounded-full border border-[#c9d8ce] object-cover"
          />
          <label
            htmlFor="profile-picture"
            className="absolute bottom-1 right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-[#4fb14b] text-white shadow-sm"
            title="Change profile picture"
          >
            <Pencil size={14} />
          </label>
          <input
            id="profile-picture"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onProfilePictureChange}
            className="hidden"
          />
        </div>
        <p className="mt-3 text-3xl font-semibold leading-none text-[#252a27]">{displayName}</p>
      </div>

      <div className="mt-7 rounded-xl border border-[#c9cfcc] bg-[#f6f6f6] p-3">
        <p className="mb-2 text-base font-semibold text-[#262b28]">My Progress Goals</p>
        <textarea
          value={progressGoals}
          onChange={onProgressGoalsChange}
          placeholder="Write your learning goals..."
          className="h-44 w-full resize-none rounded-lg border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:border-[#4bb158]"
        />
      </div>

      <button
        type="button"
        onClick={onDeleteAccount}
        disabled={saving}
        className="mt-8 inline-flex items-center gap-2 text-lg font-semibold text-[#e4302a] disabled:opacity-60"
      >
        <Trash2 size={18} />
        Delete account
      </button>
    </aside>
  );
}
