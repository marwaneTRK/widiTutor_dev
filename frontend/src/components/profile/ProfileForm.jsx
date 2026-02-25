import { Eye, EyeOff, Loader2 } from "lucide-react";
import { DOMAIN_OPTIONS, STUDIES_OPTIONS } from "../../constants/profileOptions";

export default function ProfileForm({
  dark,
  border,
  text,
  sub,
  form,
  onFieldChange,
  onSubmit,
  saving,
  message,
  canChangePassword,
  showCurrentPassword,
  showNewPassword,
  onToggleCurrentPassword,
  onToggleNewPassword,
}) {
  const fieldClass = `h-12 w-full rounded-xl border px-4 text-[17px] outline-none ${
    dark
      ? "border-[#1a3a24] bg-[#08130c] text-[#c4e8d4] placeholder-[#4a8a62] focus:bg-[#0d1a11]"
      : "border-[#66ba6c] bg-[#edf1ee] text-[#2b2f2c] focus:bg-white"
  }`;

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-[760px] p-6">
      <p className={`mb-6 rounded-lg border px-3 py-2 text-sm ${border} ${dark ? "bg-[#0d1a11] text-[#6fb389]" : "bg-white text-[#4a5b50]"}`}>
        Editable fields: first name, last name, domain, studies, email, and profile picture.
        {canChangePassword ? " Password can be updated in this account." : " Password is managed by Google sign-in."}
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className={`mb-1 block text-sm ${sub}`}>First Name</span>
          <input
            value={form.name}
            onChange={onFieldChange("name")}
            className={fieldClass}
            required
          />
        </label>
        <label className="block">
          <span className={`mb-1 block text-sm ${sub}`}>Last Name</span>
          <input
            value={form.lastName}
            onChange={onFieldChange("lastName")}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className={`mb-1 block text-sm ${sub}`}>My Domain</span>
          <input
            list="domain-options"
            value={form.domain}
            onChange={onFieldChange("domain")}
            className={fieldClass}
            placeholder="Designer"
          />
          <datalist id="domain-options">
            {DOMAIN_OPTIONS.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className={`mb-1 block text-sm ${sub}`}>My Studies</span>
          <select
            value={form.studies}
            onChange={onFieldChange("studies")}
            className={fieldClass}
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

      <label className="mt-5 block max-w-[760px]">
        <span className={`mb-1 block text-sm ${sub}`}>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={onFieldChange("email")}
          className={fieldClass}
          required
        />
      </label>

      <div className="mt-5 grid max-w-[760px] gap-5 md:grid-cols-2">
        <div>
          <span className={`mb-1 block text-sm ${sub}`}>My Upgrade</span>
          <div
            className={`mt-2 flex items-center gap-6 rounded-xl border px-4 py-3 text-base ${
              dark ? "border-[#1a3a24] bg-[#0d1a11] text-[#c4e8d4]" : "border-[#d8dfda] bg-[#edf1ee] text-[#3f4742]"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              Free
              <span className={`h-3 w-3 rounded-full border ${dark ? "border-[#4a8a62]" : "border-[#7d8680]"}`} />
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
          <span className={`mb-1 block text-sm ${sub}`}>Expiry date</span>
          <input
            value="18.03.2027"
            readOnly
            className={`h-12 w-full rounded-xl border px-4 text-[17px] outline-none ${
              dark ? "border-[#1a3a24] bg-[#0d1a11] text-[#6fb389]" : "border-[#66ba6c] bg-[#edf1ee] text-[#5a635d]"
            }`}
          />
        </label>
      </div>

      {canChangePassword ? (
        <div className="mt-5 grid max-w-[760px] gap-5 md:grid-cols-2">
          <label className="block">
            <span className={`mb-1 block text-sm ${sub}`}>Current Password</span>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={form.currentPassword}
                onChange={onFieldChange("currentPassword")}
                className={`${fieldClass} pr-12`}
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
            <span className={`mb-1 block text-sm ${sub}`}>New Password</span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={onFieldChange("newPassword")}
                className={`${fieldClass} pr-12`}
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
      ) : null}

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
              ? dark
                ? "border-[#1a3a24] bg-[#0d1a11] text-[#4ade80]"
                : "border-[#b2dfbe] bg-[#ebfaef] text-[#2f7b45]"
              : dark
                ? "border-[#4a1a1a] bg-[#1a0a0a] text-[#f87171]"
                : "border-[#efc0c0] bg-[#fff2f2] text-[#a04545]"
          }`}
        >
          {message.text}
        </div>
      ) : null}
    </form>
  );
}
