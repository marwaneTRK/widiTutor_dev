import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocal } from "./welcome/hooks/useStorage";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileLoading from "../components/profile/ProfileLoading";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import useProfileController from "../hooks/useProfileController";
import widiLookingIcon from "../assets/widi_looking_icon.svg";
import blurEffect from "../assets/blur.svg";

export default function Profile() {
  const navigate = useNavigate();
  const [dark, setDark] = useLocal("widi_dark", false);

  const bg = dark ? "bg-[#080f0b]" : "bg-[#f4f9f5]";
  const surface = dark ? "bg-[#0d1a11]" : "bg-[#f4f5f4]";
  const border = dark ? "border-[#1a3a24]" : "border-[#dceae2]";
  const text = dark ? "text-[#c4e8d4]" : "text-[#0f2119]";
  const sub = dark ? "text-[#4a8a62]" : "text-[#7a9e88]";

  const {
    loading,
    saving,
    message,
    form,
    canChangePassword,
    displayName,
    profilePictureUrl,
    showCurrentPassword,
    showNewPassword,
    setShowCurrentPassword,
    setShowNewPassword,
    handleFieldChange,
    handleProfilePictureChange,
    submitProfile,
    deleteAccount,
  } = useProfileController({
    navigate,
    fallbackProfilePicture: widiLookingIcon,
  });

  if (loading) {
    return <ProfileLoading dark={dark} border={border} />;
  }

  return (
    <div className={`min-h-screen ${bg} ${text}`}>
      <ProfileHeader
        firstName={form.name}
        blurEffect={blurEffect}
        dark={dark}
        border={border}
        text={text}
        sub={sub}
        onToggleDark={() => setDark((prev) => !prev)}
      />

      <main className="mx-auto w-full max-w-[1240px] px-4 py-5">
        <button
          type="button"
          onClick={() => navigate("/welcome")}
          className={`mb-4 inline-flex items-center gap-2 text-sm font-medium transition ${
            dark ? "text-[#6fb389] hover:text-[#9ad9b2]" : "text-[#4f5f55] hover:text-[#2f9f58]"
          }`}
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <section className={`overflow-hidden rounded-3xl border shadow-sm ${border} ${surface}`}>
          <div className="grid md:justify-center md:grid-cols-[320px_820px]">
            <ProfileSidebar
              dark={dark}
              border={border}
              profilePictureUrl={profilePictureUrl}
              displayName={displayName}
              progressGoals={form.progressGoals}
              onProgressGoalsChange={handleFieldChange("progressGoals")}
              onProfilePictureChange={handleProfilePictureChange}
              onDeleteAccount={deleteAccount}
              saving={saving}
            />
            <ProfileForm
              dark={dark}
              border={border}
              text={text}
              sub={sub}
              form={form}
              onFieldChange={handleFieldChange}
              onSubmit={submitProfile}
              saving={saving}
              message={message}
              canChangePassword={canChangePassword}
              showCurrentPassword={showCurrentPassword}
              showNewPassword={showNewPassword}
              onToggleCurrentPassword={() => setShowCurrentPassword((prev) => !prev)}
              onToggleNewPassword={() => setShowNewPassword((prev) => !prev)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
