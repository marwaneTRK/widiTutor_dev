import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { clearAuthToken, getAuthToken } from "../utils/auth";
import widiLookingIcon from "../assets/widi_looking_icon.svg";
import blurEffect from "../assets/blur.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DOMAIN_OPTIONS = [
  "Design",
  "Development",
  "Data",
  "AI",
  "Business",
  "Education",
];

const STUDIES_OPTIONS = [
  "ui & ux design",
  "frontend development",
  "backend development",
  "data science",
  "ai & ml",
  "product management",
];

const extractError = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const splitDisplayName = (name, lastName) => {
  const first = (name || "").trim();
  const last = (lastName || "").trim();
  return `${first} ${last}`.trim() || "Student";
};

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [temporaryPreviewUrl, setTemporaryPreviewUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    domain: "",
    studies: "",
    email: "",
    progressGoals: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
  });

  const displayName = useMemo(
    () => splitDisplayName(form.name, form.lastName),
    [form.lastName, form.name]
  );

  const profilePictureUrl = useMemo(() => {
    if (temporaryPreviewUrl) {
      return temporaryPreviewUrl;
    }
    return form.profilePicture || widiLookingIcon;
  }, [form.profilePicture, temporaryPreviewUrl]);

  useEffect(() => {
    return () => {
      if (temporaryPreviewUrl) {
        URL.revokeObjectURL(temporaryPreviewUrl);
      }
    };
  }, [temporaryPreviewUrl]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorText = await extractError(response, "Failed to load profile.");
          setMessage({ type: "error", text: errorText });
          return;
        }

        const data = await response.json();
        if (data?.user) {
          setForm((prev) => ({
            ...prev,
            name: data.user.name || "",
            lastName: data.user.lastName || "",
            domain: data.user.domain || "",
            studies: data.user.studies || "",
            email: data.user.email || "",
            progressGoals: data.user.progressGoals || "",
            profilePicture: data.user.profilePicture || "",
          }));
        }
    } catch {
        setMessage({ type: "error", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFieldChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setMessage({ type: "error", text: "Only JPG, PNG or WEBP images are allowed." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Profile picture must be 5MB or smaller." });
      return;
    }

    if (temporaryPreviewUrl) {
      URL.revokeObjectURL(temporaryPreviewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setTemporaryPreviewUrl(previewUrl);
    setProfilePictureFile(file);
    setMessage({ type: "", text: "" });
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    const token = getAuthToken();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const profilePayload = new FormData();
      profilePayload.append("name", form.name.trim());
      profilePayload.append("lastName", form.lastName.trim());
      profilePayload.append("domain", form.domain.trim());
      profilePayload.append("studies", form.studies.trim());
      profilePayload.append("email", form.email.trim());
      profilePayload.append("progressGoals", form.progressGoals.trim());
      if (profilePictureFile) {
        profilePayload.append("profilePicture", profilePictureFile);
      }

      const profileResponse = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: profilePayload,
      });

      if (!profileResponse.ok) {
        const errorText = await extractError(profileResponse, "Profile update failed.");
        setMessage({ type: "error", text: errorText });
        return;
      }

      const profileData = await profileResponse.json();
      const updatedUser = profileData?.user || {};
      setForm((prev) => ({
        ...prev,
        name: updatedUser.name || "",
        lastName: updatedUser.lastName || "",
        domain: updatedUser.domain || "",
        studies: updatedUser.studies || "",
        email: updatedUser.email || "",
        progressGoals: updatedUser.progressGoals || "",
        profilePicture: updatedUser.profilePicture || "",
      }));

      if (temporaryPreviewUrl) {
        URL.revokeObjectURL(temporaryPreviewUrl);
      }
      setTemporaryPreviewUrl("");
      setProfilePictureFile(null);

      let passwordMessage = "";
      const wantsPasswordUpdate =
        form.currentPassword.trim().length > 0 || form.newPassword.trim().length > 0;

      if (wantsPasswordUpdate) {
        if (!form.currentPassword.trim() || !form.newPassword.trim()) {
          setMessage({
            type: "error",
            text: "To change password, fill both current password and new password.",
          });
          return;
        }

        const passwordResponse = await fetch(`${API_URL}/api/auth/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        });

        if (!passwordResponse.ok) {
          const errorText = await extractError(passwordResponse, "Password update failed.");
          setMessage({
            type: "error",
            text: `${profileData?.message || "Profile updated"} but ${errorText}`,
          });
          return;
        }

        setForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
        passwordMessage = " Password updated.";
      }

      setMessage({
        type: "success",
        text: `${profileData?.message || "Profile updated successfully."}${passwordMessage}`,
      });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const approved = window.confirm(
      "Delete your account permanently? This action cannot be undone."
    );
    if (!approved) {
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch(`${API_URL}/api/auth/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await extractError(response, "Failed to delete account.");
        setMessage({ type: "error", text: errorText });
        return;
      }

      clearAuthToken();
      navigate("/", { replace: true });
    } catch {
      setMessage({ type: "error", text: "Failed to delete account." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eff2f1]">
        <div className="flex items-center gap-2 rounded-xl border border-[#d7dfda] bg-white px-5 py-3 text-sm text-[#495950] shadow-sm">
          <Loader2 size={16} className="animate-spin text-[#2e9a57]" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eff2f1] text-[#2b2f2c]">
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
              {(form.name || "M").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-5">
        <button
          type="button"
          onClick={() => navigate("/welcome")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#4f5f55] hover:text-[#2f9f58]"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <section className="overflow-hidden rounded-3xl border border-[#d7e0da] bg-[#f4f5f4] shadow-sm">
          <div className="grid md:grid-cols-[320px_minmax(0,1fr)]">
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
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-3 text-3xl font-semibold leading-none text-[#252a27]">
                  {displayName}
                </p>
              </div>

              <div className="mt-7 rounded-xl border border-[#c9cfcc] bg-[#f6f6f6] p-3">
                <p className="mb-2 text-base font-semibold text-[#262b28]">My Progress Goals</p>
                <textarea
                  value={form.progressGoals}
                  onChange={handleFieldChange("progressGoals")}
                  placeholder="Write your learning goals..."
                  className="h-44 w-full resize-none rounded-lg border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:border-[#4bb158]"
                />
              </div>

              <button
                type="button"
                onClick={deleteAccount}
                disabled={saving}
                className="mt-8 inline-flex items-center gap-2 text-lg font-semibold text-[#e4302a] disabled:opacity-60"
              >
                <Trash2 size={18} />
                Delete account
              </button>
            </aside>

            <form onSubmit={submitProfile} className="p-6">
              <p className="mb-6 rounded-lg border border-[#d8e1db] bg-white px-3 py-2 text-sm text-[#4a5b50]">
                Editable fields: first name, last name, domain, studies, email, profile picture,
                and password.
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm text-[#848a86]">First Name</span>
                  <input
                    value={form.name}
                    onChange={handleFieldChange("name")}
                    className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] outline-none focus:bg-white"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-[#848a86]">Last Name</span>
                  <input
                    value={form.lastName}
                    onChange={handleFieldChange("lastName")}
                    className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 text-[17px] outline-none focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#848a86]">My Domain</span>
                  <input
                    list="domain-options"
                    value={form.domain}
                    onChange={handleFieldChange("domain")}
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
                    onChange={handleFieldChange("studies")}
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
                  onChange={handleFieldChange("email")}
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
                      onChange={handleFieldChange("currentPassword")}
                      className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 pr-12 text-[17px] outline-none focus:bg-white"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
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
                      onChange={handleFieldChange("newPassword")}
                      className="h-12 w-full rounded-xl border border-[#66ba6c] bg-[#edf1ee] px-4 pr-12 text-[17px] outline-none focus:bg-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
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
          </div>
        </section>
      </main>
    </div>
  );
}
