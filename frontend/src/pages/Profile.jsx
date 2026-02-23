import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/profile/ProfileForm";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileLoading from "../components/profile/ProfileLoading";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import useProfileController from "../hooks/useProfileController";
import widiLookingIcon from "../assets/widi_looking_icon.svg";
import blurEffect from "../assets/blur.svg";

export default function Profile() {
  const navigate = useNavigate();
  const {
    loading,
    saving,
    message,
    form,
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
    return <ProfileLoading />;
  }

  return (
    <div className="min-h-screen bg-[#eff2f1] text-[#2b2f2c]">
      <ProfileHeader firstName={form.name} blurEffect={blurEffect} />

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
            <ProfileSidebar
              profilePictureUrl={profilePictureUrl}
              displayName={displayName}
              progressGoals={form.progressGoals}
              onProgressGoalsChange={handleFieldChange("progressGoals")}
              onProfilePictureChange={handleProfilePictureChange}
              onDeleteAccount={deleteAccount}
              saving={saving}
            />
            <ProfileForm
              form={form}
              onFieldChange={handleFieldChange}
              onSubmit={submitProfile}
              saving={saving}
              message={message}
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
