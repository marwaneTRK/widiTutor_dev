export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const withAuthHeader = (headers, token) => {
  if (!token) {
    return headers;
  }
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};

export const jsonHeaders = (token) =>
  withAuthHeader(
    {
      "Content-Type": "application/json",
    },
    token
  );

export const authHeaders = (token) => withAuthHeader({}, token);

export const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const extractApiError = (payload, fallbackMessage) =>
  payload?.error || payload?.message || fallbackMessage;

export const requestJson = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: jsonHeaders(token),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await parseJsonSafely(response);
  return { response, data };
};

export const requestFormData = async (path, { method = "POST", token, formData } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(token),
    body: formData,
  });
  const data = await parseJsonSafely(response);
  return { response, data };
};
