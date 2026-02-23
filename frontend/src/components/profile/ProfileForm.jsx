import { Eye, EyeOff, Loader2 } from "lucide-react";
import { DOMAIN_OPTIONS, STUDIES_OPTIONS } from "../../constants/profileOptions";

export default function ProfileForm({
  form,
  onFieldChange,
  onSubmit,
  saving,
  message,
  showCurrentPassword,
  showNewPassword,
  onToggleCurrentPassword,
  onToggleNewPassword,
}) {
  return (
    <form onSubmit={onSubmit} className="p-6">
      <p className="mb-6 rounded-lg border border-[#d8e1db] bg-white px-3 py-2 text-sm text-[#4a5b50]">
        Editable fields: first name, last name, domain, studies, email, profile picture, and
        password.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-[#848a86]">First Name</span>
          <input
            value={form.name}
            onChange={onFieldChange("name")}
            className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] outline-none focus:bg-white"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[#848a86]">Last Name</span>
          <input
            value={form.lastName}
            onChange={onFieldChange("lastName")}
            className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] outline-none focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[#848a86]">My Domain</span>
          <input
            list="domain-options"
            value={form.domain}
            onChange={onFieldChange("domain")}
            className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] outline-none focus:bg-white"
            placeholder="Designer"
          />
          <datalist id="domain-options">
            {DOMAIN_OPTIONS.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[#848a86]">My Studies</span>
          <select
            value={form.studies}
            onChange={onFieldChange("studies")}
            className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] outline-none focus:bg-white"
          >
            <option value="">Select studies</option>
            {STUDIES_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-1 block text-sm text-[#848a86]">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={onFieldChange("email")}
          className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] outline-none focus:bg-white"
          required
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <span className="mb-1 block text-sm text-[#848a86]">My Upgrade</span>
          <div className="mt-2 flex items-center gap-6 rounded-xl border border-[#d8dfda] bg-[#edf1ee] px-4 py-3 text-base text-[#3f4742]">
            <span className="inline-flex items-center gap-2">
              Free
              <span className="h-3 w-3 rounded-full border border-[#7d8680]" />
            </span>
            <span className="inline-flex items-center gap-2">
              Pro
              <span className="h-3 w-3 rounded-full border border-[#5ab665] bg-[#25b02d]" />
            </span>
            <span className="inline-flex items-center gap-2">
              Basic
              <span className="h-3 w-3 rounded-full border border-[#7d8680]" />
            </span>
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm text-[#848a86]">Expiry date</span>
          <input
            value="18.03.2027"
            readOnly
            className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] text-[#5a635d] outline-none"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-[#848a86]">Current Password</span>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={form.currentPassword}
              onChange={onFieldChange("currentPassword")}
              className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 pr-12 text-[17px] outline-none focus:bg-white"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={onToggleCurrentPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8880]"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-[#848a86]">New Password</span>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={form.newPassword}
              onChange={onFieldChange("newPassword")}
              className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 pr-12 text-[17px] outline-none focus:bg-white"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={onToggleNewPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8880]"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#14b716] px-6 py-3 text-lg font-semibold text-white shadow-[0_8px_22px_rgba(20,183,22,0.35)] transition hover:brightness-95 disabled:opacity-70"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
        Update Profile
      </button>

      {message.text ? (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-[#b2dfbe] bg-[#ebfaef] text-[#2f7b45]"
              : "border-[#efc0c0] bg-[#fff2f2] text-[#a04545]"
          }`}
        >
          {message.text}
        </div>
      ) : null}
    </form>
  );
}
