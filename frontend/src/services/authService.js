import { API_URL, requestFormData, requestJson } from "./http";

export const getGoogleAuthUrl = () => `${API_URL}/api/auth/google`;

export const registerUser = (payload) =>
  requestJson("/api/auth/register", {
    method: "POST",
    body: payload,
  });

export const loginUser = ({ email, password }) =>
  requestJson("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const requestPasswordReset = ({ email }) =>
  requestJson("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });

export const resetPassword = ({ token, newPassword }) =>
  requestJson("/api/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  });

export const fetchCurrentUser = (token) =>
  requestJson("/api/auth/me", {
    method: "GET",
    token,
  });

export const updateProfile = (token, formData) =>
  requestFormData("/api/auth/profile", {
    method: "PUT",
    token,
    formData,
  });

export const updatePassword = (token, payload) =>
  requestJson("/api/auth/password", {
    method: "PUT",
    token,
    body: payload,
  });

export const deleteAccount = (token) =>
  requestJson("/api/auth/account", {
    method: "DELETE",
    token,
  });
