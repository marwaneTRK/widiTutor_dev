import { API_URL, jsonHeaders, requestJson } from "./http";

export const searchVideos = (token, query, maxResults = 10) =>
  requestJson("/api/search-videos", {
    method: "POST",
    token,
    body: { query, max_results: maxResults },
  });

export const fetchTranscript = (token, videoId) =>
  requestJson("/api/get-transcript", {
    method: "POST",
    token,
    body: { video_id: videoId },
  });

export const generateSummary = (token, transcript) =>
  requestJson("/api/generate-summary", {
    method: "POST",
    token,
    body: { transcript },
  });

export const generateQuiz = (token, transcript) =>
  requestJson("/api/generate-quiz", {
    method: "POST",
    token,
    body: { transcript },
  });

export const sendChat = (token, payload) =>
  fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(payload),
  });
