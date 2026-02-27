const express = require("express");
const User = require("../model/User");
const authMiddleware = require("../middleware/authMiddleware");
const { generateInternalAuth } = require("../helpers/internalAuth");
const { FASTAPI_INTERNAL_URL, FASTAPI_HEALTH_PATH } = require("../config/fastapi");
const {
  assertQuizAccess,
  markQuizUsage,
  assertChatAccess,
  markChatUsage,
} = require("../services/entitlementService");

const router = express.Router();
const MAX_TRANSCRIPT_LENGTH = 15000;

const getUserContext = (user) => {
  return {
    id: user._id.toString(),
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  };
};

const getUserForAi = async (req) => {
  return User.findById(req.user.id).select(
    "name lastName email subscriptionPlan dailyUsageDate dailyQuizCount dailyChatCount createdAt"
  );
};

const buildInternalHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const internalAuth = generateInternalAuth();
  if (internalAuth) {
    headers["X-Internal-Auth"] = internalAuth;
  }
  return headers;
};

const forwardJsonRequest = async (path, payload) => {
  return fetch(`${FASTAPI_INTERNAL_URL}${path}`, {
    method: "POST",
    headers: buildInternalHeaders(),
    body: JSON.stringify(payload),
  });
};

const checkFastApiHealth = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${FASTAPI_INTERNAL_URL}${FASTAPI_HEALTH_PATH}`, {
      method: "GET",
      headers: buildInternalHeaders(),
      signal: controller.signal,
    });

    if (!response.ok) {
      const message = await getUpstreamError(response);
      return { healthy: false, statusCode: response.status, message };
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      payload = null;
    }

    return { healthy: true, statusCode: response.status, payload };
  } catch (error) {
    const message =
      error.name === "AbortError" ? "FastAPI health check timed out" : "FastAPI unreachable";
    return { healthy: false, statusCode: 503, message };
  } finally {
    clearTimeout(timeout);
  }
};

router.get("/ai/health", async (req, res) => {
  const result = await checkFastApiHealth();
  if (!result.healthy) {
    return res.status(503).json({
      ok: false,
      fastapiUrl: FASTAPI_INTERNAL_URL,
      healthPath: FASTAPI_HEALTH_PATH,
      error: result.message,
      upstreamStatus: result.statusCode,
    });
  }

  return res.status(200).json({
    ok: true,
    fastapiUrl: FASTAPI_INTERNAL_URL,
    healthPath: FASTAPI_HEALTH_PATH,
    upstreamStatus: result.statusCode,
    upstream: result.payload,
  });
});

const getUpstreamError = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const data = await response.json();
      return data?.error || data?.message || data?.detail || "AI service request failed";
    } catch (error) {
      return "AI service request failed";
    }
  }

  try {
    const text = await response.text();
    return text || "AI service request failed";
  } catch (error) {
    return "AI service request failed";
  }
};

router.post("/generate-summary", authMiddleware, async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({ error: "Valid transcript required" });
    }
    if (transcript.length > MAX_TRANSCRIPT_LENGTH) {
      return res
        .status(400)
        .json({ error: `Transcript too long (max ${MAX_TRANSCRIPT_LENGTH} characters)` });
    }

    const user = await getUserForAi(req);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userContext = getUserContext(user);

    const aiResponse = await forwardJsonRequest("/internal/generate-summary", {
      transcript,
      userContext,
    });

    if (!aiResponse.ok) {
      const message = await getUpstreamError(aiResponse);
      return res.status(502).json({ error: message });
    }

    const result = await aiResponse.json();
    return res.json(result);
  } catch (error) {
    console.error("Summary generation error:", error);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
});

router.post("/generate-quiz", authMiddleware, async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({ error: "Valid transcript required" });
    }
    if (transcript.length > MAX_TRANSCRIPT_LENGTH) {
      return res
        .status(400)
        .json({ error: `Transcript too long (max ${MAX_TRANSCRIPT_LENGTH} characters)` });
    }

    const user = await getUserForAi(req);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const quizAccess = await assertQuizAccess(user);
    if (!quizAccess.allowed) {
      return res.status(quizAccess.statusCode || 403).json({
        error: quizAccess.message,
        usage: quizAccess.usage,
      });
    }

    const userContext = getUserContext(user);

    const aiResponse = await forwardJsonRequest("/internal/generate-quiz", {
      transcript,
      userContext,
    });

    if (!aiResponse.ok) {
      const message = await getUpstreamError(aiResponse);
      return res.status(502).json({ error: message });
    }

    const result = await aiResponse.json();
    await markQuizUsage(user);
    return res.json(result);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return res.status(500).json({ error: "Failed to generate quiz" });
  }
});

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const user = await getUserForAi(req);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const chatAccess = await assertChatAccess(user);
    if (!chatAccess.allowed) {
      return res.status(chatAccess.statusCode || 403).json({
        error: chatAccess.message,
        usage: chatAccess.usage,
      });
    }

    const userContext = getUserContext(user);

    const aiResponse = await forwardJsonRequest("/internal/chat", { messages, userContext });
    if (!aiResponse.ok) {
      const message = await getUpstreamError(aiResponse);
      return res.status(502).json({ error: message });
    }

    if (!aiResponse.body || typeof aiResponse.body.getReader !== "function") {
      const text = await aiResponse.text();
      return res.send(text);
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = aiResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        await markChatUsage(user);
        res.end();
        break;
      }
      res.write(value);
    }
    return undefined;
  } catch (error) {
    console.error("Chat error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Chat request failed" });
    }
    res.end();
    return undefined;
  }
});

router.post("/search-videos", authMiddleware, async (req, res) => {
  try {
    const { query, max_results: maxResults } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Valid query required" });
    }

    const aiResponse = await forwardJsonRequest("/internal/search-videos", {
      query,
      max_results: maxResults,
    });

    if (!aiResponse.ok) {
      const message = await getUpstreamError(aiResponse);
      return res.status(502).json({ error: message });
    }

    const result = await aiResponse.json();
    return res.json(result);
  } catch (error) {
    console.error("Search videos error:", error);
    return res.status(500).json({ error: "Search failed" });
  }
});

router.post("/get-transcript", authMiddleware, async (req, res) => {
  try {
    const { video_id: videoId } = req.body;
    if (!videoId || typeof videoId !== "string") {
      return res.status(400).json({ error: "Valid video_id required" });
    }

    const aiResponse = await forwardJsonRequest("/internal/get-transcript", {
      video_id: videoId,
    });

    if (!aiResponse.ok) {
      const message = await getUpstreamError(aiResponse);
      return res.status(502).json({ error: message });
    }

    const result = await aiResponse.json();
    return res.json(result);
  } catch (error) {
    console.error("Transcript error:", error);
    return res.status(500).json({ error: "Transcript fetch failed" });
  }
});

module.exports = router;
