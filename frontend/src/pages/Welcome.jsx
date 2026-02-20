import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FileText,
  ListChecks,
  Loader2,
  LogOut,
  MessageCircle,
  Search,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../utils/auth";
import logo from "../assets/logo.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DEFAULT_VIDEO_QUERY = "learn python fast";
const DEFAULT_SUGGESTIONS = [
  "Explain this topic in simple terms",
  "Give me practice questions",
  "Give me a short summary",
];

const extractError = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data?.error || data?.message || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
};

const buildAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export default function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatEndRef = useRef(null);

  const [token, setToken] = useState(getAuthToken() || "");
  const [currentUser, setCurrentUser] = useState({
    name: "Student",
    email: "",
  });

  const [searchQuery, setSearchQuery] = useState(DEFAULT_VIDEO_QUERY);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searching, setSearching] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [transcriptMeta, setTranscriptMeta] = useState(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [quiz, setQuiz] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome-assistant",
      role: "assistant",
      content: "hey",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const selectedVideoEmbedUrl = useMemo(() => {
    if (!selectedVideo?.id) return "";
    return `https://www.youtube.com/embed/${selectedVideo.id}`;
  }, [selectedVideo]);

  const ensureToken = useCallback(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setAuthToken(urlToken);
      setToken(urlToken);
      navigate("/welcome", { replace: true });
      return urlToken;
    }

    const existingToken = getAuthToken();
    if (!existingToken) {
      navigate("/", { replace: true });
      return null;
    }
    setToken(existingToken);
    return existingToken;
  }, [navigate, searchParams]);

  const fetchCurrentUser = useCallback(async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data?.user) {
        setCurrentUser({
          name: data.user.name || "Student",
          email: data.user.email || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  }, []);

  const fetchTranscript = useCallback(async (videoId, authToken) => {
    if (!videoId) return;
    setTranscriptLoading(true);
    setSummary("");
    setQuiz([]);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/get-transcript`, {
        method: "POST",
        headers: buildAuthHeaders(authToken),
        body: JSON.stringify({ video_id: videoId }),
      });

      if (!response.ok) {
        const message = await extractError(
          response,
          "Failed to fetch transcript.",
        );
        setErrorMessage(message);
        setTranscript("");
        setTranscriptMeta(null);
        return;
      }

      const data = await response.json();
      setTranscript(data?.transcript || "");
      setTranscriptMeta({
        method: data?.method || "unknown",
        length: data?.length || 0,
      });
    } catch (error) {
      console.error("Transcript request failed:", error);
      setErrorMessage("Transcript request failed.");
    } finally {
      setTranscriptLoading(false);
    }
  }, []);

  const searchVideos = useCallback(
    async (queryValue) => {
      const authToken = token || getAuthToken();
      if (!authToken) {
        navigate("/", { replace: true });
        return;
      }

      const query = (queryValue || "").trim();
      if (!query) return;

      setSearching(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_URL}/api/search-videos`, {
          method: "POST",
          headers: buildAuthHeaders(authToken),
          body: JSON.stringify({ query, max_results: 10 }),
        });

        if (!response.ok) {
          const message = await extractError(response, "Video search failed.");
          setErrorMessage(message);
          setVideos([]);
          return;
        }

        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        setVideos(list);

        if (list.length > 0) {
          setSelectedVideo(list[0]);
          fetchTranscript(list[0].id, authToken);
        }
      } catch (error) {
        console.error("Search request failed:", error);
        setErrorMessage("Search request failed.");
      } finally {
        setSearching(false);
      }
    },
    [fetchTranscript, navigate, token],
  );

  const generateSummary = useCallback(async () => {
    if (!transcript) {
      setErrorMessage("Select a video and load transcript first.");
      return;
    }

    const authToken = token || getAuthToken();
    if (!authToken) return;

    setSummaryLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${API_URL}/api/generate-summary`, {
        method: "POST",
        headers: buildAuthHeaders(authToken),
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        const message = await extractError(
          response,
          "Summary generation failed.",
        );
        setErrorMessage(message);
        return;
      }

      const data = await response.json();
      setSummary(data?.summary || "");
    } catch (error) {
      console.error("Summary request failed:", error);
      setErrorMessage("Summary request failed.");
    } finally {
      setSummaryLoading(false);
    }
  }, [token, transcript]);

  const generateQuiz = useCallback(async () => {
    if (!transcript) {
      setErrorMessage("Select a video and load transcript first.");
      return;
    }

    const authToken = token || getAuthToken();
    if (!authToken) return;

    setQuizLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${API_URL}/api/generate-quiz`, {
        method: "POST",
        headers: buildAuthHeaders(authToken),
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        const message = await extractError(response, "Quiz generation failed.");
        setErrorMessage(message);
        return;
      }

      const data = await response.json();
      setQuiz(Array.isArray(data?.quiz) ? data.quiz : []);
    } catch (error) {
      console.error("Quiz request failed:", error);
      setErrorMessage("Quiz request failed.");
    } finally {
      setQuizLoading(false);
    }
  }, [token, transcript]);

  const sendChatMessage = useCallback(
    async (rawText) => {
      const userText = (rawText || chatInput).trim();
      if (!userText || chatLoading) return;

      const authToken = token || getAuthToken();
      if (!authToken) return;

      const userId = `user-${Date.now()}`;
      const assistantId = `assistant-${Date.now() + 1}`;
      const userMessage = { id: userId, role: "user", content: userText };
      const transcriptForPrompt = transcript.slice(0, 12000);
      const title = selectedVideo?.title || "No selected video";

      const payloadMessages = [
        {
          role: "system",
          content: `Video: '${title}'\nTranscript:\n${transcriptForPrompt}`,
        },
        ...chatMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: userText },
      ];

      setChatMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setChatInput("");
      setChatLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: buildAuthHeaders(authToken),
          body: JSON.stringify({
            messages: payloadMessages,
            userContext: {
              id: authToken.slice(0, 12),
              name: currentUser.name || "Student",
              email: currentUser.email || "",
            },
          }),
        });

        if (!response.ok) {
          const message = await extractError(response, "Chat request failed.");
          setErrorMessage(message);
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: "I could not answer right now." }
                : msg,
            ),
          );
          return;
        }

        if (!response.body || typeof response.body.getReader !== "function") {
          const text = await response.text();
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: text } : msg,
            ),
          );
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let streamDone = false;

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) {
            streamDone = true;
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: `${msg.content}${chunk}` }
                : msg,
            ),
          );
        }
      } catch (error) {
        console.error("Chat request failed:", error);
        setErrorMessage("Chat request failed.");
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: "Connection interrupted." }
              : msg,
          ),
        );
      } finally {
        setChatLoading(false);
      }
    },
    [
      chatInput,
      chatLoading,
      chatMessages,
      currentUser.email,
      currentUser.name,
      selectedVideo,
      token,
      transcript,
    ],
  );

  useEffect(() => {
    const authToken = ensureToken();
    if (!authToken) return;

    fetchCurrentUser(authToken);
    searchVideos(DEFAULT_VIDEO_QUERY);
  }, [ensureToken, fetchCurrentUser, searchVideos]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#edf3ef] text-[#1f2937]">
      <header className="border-b border-[#dbe7de] bg-[#e6efe8] px-4 py-3">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WidiTutor" className="h-9 w-auto" />
            <div>
              <p className="text-sm font-semibold">WidiTutor</p>
              <p className="text-xs text-[#5d6f65]">AI Learning Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">
              {currentUser.name}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-[#c7d7cb] bg-white px-3 py-2 text-sm font-medium hover:bg-[#f2f7f3]"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] gap-4 p-4 lg:grid-cols-[minmax(0,2fr)_380px]">
        <main className="space-y-4">
          <section className="rounded-3xl border border-[#d5e2d9] bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-2xl border border-[#dbe7de] bg-[#f7faf8]">
              {selectedVideoEmbedUrl ? (
                <iframe
                  src={selectedVideoEmbedUrl}
                  title={selectedVideo?.title || "Selected video"}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video items-center justify-center text-sm text-[#64756a]">
                  Search and pick a video to start.
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedVideo?.title || "No video selected"}
                </h2>
                <p className="text-sm text-[#5f7267]">
                  {selectedVideo?.channel || "Channel"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={generateSummary}
                  disabled={summaryLoading || !transcript}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#bdd7c6] bg-[#f0faf3] px-3 py-2 text-sm font-medium text-[#245a35] disabled:opacity-60"
                >
                  {summaryLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <FileText size={16} />
                  )}
                  Summary
                </button>
                <button
                  type="button"
                  onClick={generateQuiz}
                  disabled={quizLoading || !transcript}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#bdd7c6] bg-[#f0faf3] px-3 py-2 text-sm font-medium text-[#245a35] disabled:opacity-60"
                >
                  {quizLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <ListChecks size={16} />
                  )}
                  Quiz
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-[#d5e2d9] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[#245a35]">
                <MessageCircle size={18} />
                <h3 className="font-semibold">Ask Tutor</h3>
              </div>

              <div className="h-[320px] overflow-y-auto rounded-2xl border border-[#dbe7de] bg-[#f8fbf9] p-3">
                <div className="space-y-3">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "ml-auto bg-[#e7f4ec] text-[#1f3a28]"
                          : "bg-white text-[#233227]"
                      }`}
                    >
                      {msg.content ||
                        (msg.role === "assistant" ? "Typing..." : "")}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {DEFAULT_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendChatMessage(suggestion)}
                    className="rounded-lg border border-[#c8d9cd] bg-white px-3 py-1.5 text-xs hover:bg-[#f2f7f3]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[#c9d9cd] bg-white px-3 py-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  placeholder="Ask anything about this video..."
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => sendChatMessage()}
                  disabled={chatLoading || !chatInput.trim()}
                  className="rounded-lg bg-[#2f9d58] p-2 text-white disabled:opacity-60"
                >
                  {chatLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <SendHorizonal size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-[#d5e2d9] bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-[#245a35]">
                  <Sparkles size={18} />
                  <h3 className="font-semibold">Summary</h3>
                </div>
                {summary ? (
                  <p className="text-sm leading-relaxed text-[#36493d]">
                    {summary}
                  </p>
                ) : (
                  <p className="text-sm text-[#697d71]">
                    Generate a summary after transcript is loaded.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-[#d5e2d9] bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-[#245a35]">
                  <ListChecks size={18} />
                  <h3 className="font-semibold">Quiz</h3>
                </div>
                {quiz.length > 0 ? (
                  <div className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
                    {quiz.map((item, index) => (
                      <div
                        key={`${item.question}-${index}`}
                        className="rounded-xl border border-[#dde9df] p-3"
                      >
                        <p className="text-sm font-medium">
                          {index + 1}. {item.question}
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-[#4f6157]">
                          {(item.options || []).map((option) => (
                            <li
                              key={option}
                              className={
                                option === item.correct
                                  ? "font-semibold text-[#1f6a38]"
                                  : ""
                              }
                            >
                              - {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#697d71]">
                    Generate quiz to show questions.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-[#d5e2d9] bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-semibold text-[#245a35]">
                  Transcript
                </h3>
                {transcriptLoading ? (
                  <div className="flex items-center gap-2 text-sm text-[#65796d]">
                    <Loader2 size={16} className="animate-spin" />
                    Loading transcript...
                  </div>
                ) : transcript ? (
                  <>
                    <p className="mb-2 text-xs text-[#6a7f73]">
                      Method: {transcriptMeta?.method || "unknown"} | Length:{" "}
                      {transcriptMeta?.length || 0}
                    </p>
                    <p className="max-h-[180px] overflow-y-auto rounded-xl border border-[#e0ebe3] bg-[#f9fcfa] p-2 text-xs leading-relaxed text-[#44584e]">
                      {transcript.slice(0, 2500)}
                      {transcript.length > 2500 ? "..." : ""}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[#697d71]">
                    Select a video to fetch transcript.
                  </p>
                )}
              </div>
            </div>
          </section>

          {errorMessage && (
            <div className="rounded-2xl border border-[#f3c7c7] bg-[#fff3f3] px-4 py-3 text-sm text-[#a34242]">
              {errorMessage}
            </div>
          )}
        </main>

        <aside className="rounded-3xl border border-[#d5e2d9] bg-white p-4 shadow-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              searchVideos(searchQuery);
            }}
            className="mb-3 flex items-center gap-2 rounded-2xl border border-[#d5e2d9] px-3 py-2"
          >
            <Search size={16} className="text-[#5f7368]" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search or paste your link"
              className="w-full bg-transparent text-sm outline-none"
            />
            <button
              type="submit"
              disabled={searching}
              className="rounded-lg bg-[#2f9d58] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {searching ? "..." : "Go"}
            </button>
          </form>

          <div className="max-h-[calc(100vh-220px)] space-y-2 overflow-y-auto pr-1">
            {videos.map((video) => (
              <button
                key={video.id}
                type="button"
                onClick={() => {
                  setSelectedVideo(video);
                  fetchTranscript(video.id, token || getAuthToken());
                }}
                className={`flex w-full gap-3 rounded-2xl border p-2 text-left transition ${
                  selectedVideo?.id === video.id
                    ? "border-[#6bc78b] bg-[#f2fbf5]"
                    : "border-[#d9e5dc] hover:bg-[#f7fbf8]"
                }`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-16 w-28 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium">
                    {video.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-[#607469]">
                    {video.channel}
                  </p>
                </div>
              </button>
            ))}
            {!searching && videos.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#d4e0d7] p-4 text-center text-sm text-[#71867a]">
                No videos yet. Search to begin.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
