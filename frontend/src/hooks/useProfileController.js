import { useEffect, useMemo, useState } from "react";
import { clearAuthToken, getAuthToken } from "../utils/auth";
import {
  deleteAccount as deleteAccountRequest,
  fetchCurrentUser,
  updatePassword as updatePasswordRequest,
  updateProfile as updateProfileRequest,
} from "../services/authService";
import { extractApiError } from "../services/http";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const INITIAL_FORM = {
  name: "",
  lastName: "",
  domain: "",
  studies: "",
  email: "",
  progressGoals: "",
  profilePicture: "",
  subscriptionPlan: "free",
  subscriptionStatus: "inactive",
  subscriptionCurrentPeriodEnd: null,
  currentPassword: "",
  newPassword: "",
};

const splitDisplayName = (name, lastName) => {
  const first = (name || "").trim();
  const last = (lastName || "").trim();
  return `${first} ${last}`.trim() || "Student";
};

const mapUserToForm = (user = {}) => ({
  name: user.name || "",
  lastName: user.lastName || "",
  domain: user.domain || "",
  studies: user.studies || "",
  email: user.email || "",
  progressGoals: user.progressGoals || "",
  profilePicture: user.profilePicture || "",
  subscriptionPlan: (user.subscriptionPlan || "free").toLowerCase(),
  subscriptionStatus: (user.subscriptionStatus || "inactive").toLowerCase(),
  subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd || null,
});

export default function useProfileController({ navigate, fallbackProfilePicture }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [canChangePassword, setCanChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [temporaryPreviewUrl, setTemporaryPreviewUrl] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  const displayName = useMemo(
    () => splitDisplayName(form.name, form.lastName),
    [form.lastName, form.name]
  );

  const profilePictureUrl = useMemo(() => {
    if (temporaryPreviewUrl) {
      return temporaryPreviewUrl;
    }
    return form.profilePicture || fallbackProfilePicture;
  }, [fallbackProfilePicture, form.profilePicture, temporaryPreviewUrl]);

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
        const { response, data } = await fetchCurrentUser(token);
        if (!response.ok) {
          const errorText = extractApiError(data, "Failed to load profile.");
          setMessage({ type: "error", text: errorText });
          return;
        }

        if (data?.user) {
          const isGoogleUser = Boolean(data.user.googleId);
          const isVerified = Boolean(data.user.isVerified);
          setCanChangePassword(isVerified && !isGoogleUser);
          setForm((prev) => ({
            ...prev,
            ...mapUserToForm(data.user),
          }));
        }
      } catch (error) {
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

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setMessage({ type: "error", text: "Only JPG, PNG or WEBP images are allowed." });
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
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

      const { response: profileResponse, data: profileData } = await updateProfileRequest(
        token,
        profilePayload
      );

      if (!profileResponse.ok) {
        const errorText = extractApiError(profileData, "Profile update failed.");
        setMessage({ type: "error", text: errorText });
        return;
      }

      const updatedUser = profileData?.user || {};
      setForm((prev) => ({
        ...prev,
        ...mapUserToForm(updatedUser),
      }));

      if (temporaryPreviewUrl) {
        URL.revokeObjectURL(temporaryPreviewUrl);
      }
      setTemporaryPreviewUrl("");
      setProfilePictureFile(null);

      let passwordMessage = "";
      const wantsPasswordUpdate =
        canChangePassword &&
        (form.currentPassword.trim().length > 0 || form.newPassword.trim().length > 0);

      if (wantsPasswordUpdate) {
        if (!form.currentPassword.trim() || !form.newPassword.trim()) {
          setMessage({
            type: "error",
            text: "To change password, fill both current password and new password.",
          });
          return;
        }

        const { response: passwordResponse, data: passwordData } = await updatePasswordRequest(
          token,
          {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }
        );

        if (!passwordResponse.ok) {
          const errorText = extractApiError(passwordData, "Password update failed.");
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
    } catch (error) {
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
      const { response, data } = await deleteAccountRequest(token);
      if (!response.ok) {
        const errorText = extractApiError(data, "Failed to delete account.");
        setMessage({ type: "error", text: errorText });
        return;
      }

      clearAuthToken();
      navigate("/", { replace: true });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete account." });
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
