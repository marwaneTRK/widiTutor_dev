import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Bot,
  Home,
  LayoutList,
  ListChecks,
  Loader2,
  LogOut,
  Moon,
  PlayCircle,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../../utils/auth";
import logo from "../../assets/logo.svg";
import { API_URL, DEFAULT_SUGGESTIONS, QUIZ_LEVELS, WELCOME_MSG } from "./constants";
import { useLocal, useSession } from "./hooks/useStorage";
import { buildHeaders, extractError } from "./utils/api";
import { resolveCorrect } from "./utils/quiz";
import ChatPanel from "./components/ChatPanel";
import LandingPanel from "./components/LandingPanel";
import MobileNavBtn from "./components/MobileNavBtn";
import NavIcon from "./components/NavIcon";
import QuizSection from "./components/QuizSection";
import SummarySection from "./components/SummarySection";
import VideoList from "./components/VideoList";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatScrollRef = useRef(null);

  const [token, setToken] = useState(getAuthToken() || "");
  const [currentUser, setCurrentUser] = useState({ name: "Student", email: "" });

  const [dark, setDark] = useLocal("widi_dark", false);
  const [mobilePanel, setMobilePanel] = useState(null);

  const [searchQuery, setSearchQuery] = useSession("widi_query", "");
  const [videos, setVideos] = useSession("widi_videos", []);
  const [selectedVideo, setSelectedVideo] = useSession("widi_video", null);
  const [searching, setSearching] = useState(false);

  const [transcript, setTranscript] = useSession("widi_transcript", "");
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const [summary, setSummary] = useSession("widi_summary", "");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [quizCache, setQuizCache] = useSession("widi_quiz_cache", {});
  const [quiz, setQuiz] = useSession("widi_quiz", []);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useSession("widi_answers", {});
  const [quizLevel, setQuizLevel] = useSession("widi_quiz_level", "intermediate");
  const [retryMode, setRetryMode] = useState(false);

  const [chatMessages, setChatMessages] = useSession("widi_chat", [WELCOME_MSG]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useSession("widi_tab", "summary");

  const selectedVideoEmbedUrl = useMemo(() => {
    if (!selectedVideo?.id) return "";
    return `https://www.youtube.com/embed/${selectedVideo.id}`;
  }, [selectedVideo]);

  useEffect(() => {
    if (chatScrollRef.current)
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatMessages]);

  const ensureToken = useCallback(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setAuthToken(urlToken); setToken(urlToken);
      navigate("/welcome", { replace: true });
      return urlToken;
    }
    const existing = getAuthToken();
    if (!existing) { navigate("/", { replace: true }); return null; }
    setToken(existing);
    return existing;
  }, [navigate, searchParams]);

  const fetchCurrentUser = useCallback(async (tok) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${tok}` } });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.user) setCurrentUser({ name: data.user.name || "Student", email: data.user.email || "" });
    } catch { return; }
  }, []);

  const fetchTranscript = useCallback(async (videoId, tok) => {
    if (!videoId) return;
    setTranscriptLoading(true);
    setSummary(""); setQuiz([]); setSelectedAnswers({}); setQuizCache({});
    setErrorMessage("");
    setChatMessages([WELCOME_MSG]); setChatInput("");
    try {
      const res = await fetch(`${API_URL}/api/get-transcript`, {
        method: "POST", headers: buildHeaders(tok), body: JSON.stringify({ video_id: videoId }),
      });
      if (!res.ok) { setErrorMessage(await extractError(res, "Failed to fetch transcript.")); setTranscript(""); return; }
      const data = await res.json();
      setTranscript(data?.transcript || "");
    } catch { setErrorMessage("Transcript request failed."); }
    finally { setTranscriptLoading(false); }
  }, [setChatInput, setChatMessages, setErrorMessage, setQuiz, setQuizCache, setSelectedAnswers, setSummary, setTranscript, setTranscriptLoading]);

  const searchVideos = useCallback(async (q) => {
    const tok = token || getAuthToken();
    if (!tok) { navigate("/", { replace: true }); return; }
    const query = (q || "").trim();
    if (!query) return;
    setSearching(true); setErrorMessage("");
    try {
      const res = await fetch(`${API_URL}/api/search-videos`, {
        method: "POST", headers: buildHeaders(tok), body: JSON.stringify({ query, max_results: 10 }),
      });
      if (!res.ok) { setErrorMessage(await extractError(res, "Video search failed.")); setVideos([]); return; }
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setVideos(list);
    } catch { setErrorMessage("Search request failed."); }
    finally { setSearching(false); }
  }, [navigate, setErrorMessage, setSearching, setVideos, token]);

  const pickVideo = useCallback((video) => {
    const tok = token || getAuthToken();
    setSelectedVideo(video);
    fetchTranscript(video.id, tok);
    setMobilePanel(null);
  }, [fetchTranscript, setMobilePanel, setSelectedVideo, token]);

  const generateSummary = useCallback(async () => {
    if (!transcript) { setErrorMessage("Select a video first."); return; }
    const tok = token || getAuthToken();
    setSummaryLoading(true); setErrorMessage("");
    try {
      const res = await fetch(`${API_URL}/api/generate-summary`, {
        method: "POST", headers: buildHeaders(tok), body: JSON.stringify({ transcript }),
      });
      if (!res.ok) { setErrorMessage(await extractError(res, "Summary generation failed.")); return; }
      const data = await res.json();
      setSummary(data?.summary || "");
      setActiveTab("summary");
    } catch { setErrorMessage("Summary request failed."); }
    finally { setSummaryLoading(false); }
  }, [setActiveTab, setErrorMessage, setSummary, setSummaryLoading, token, transcript]);

  const generateQuiz = useCallback(async (levelOverride, forceRefresh = false) => {
    if (!transcript) { setErrorMessage("Select a video first."); return; }
    const tok = token || getAuthToken();
    const level = levelOverride || quizLevel;

    if (!forceRefresh && quizCache[level]?.length > 0) {
      setQuiz(quizCache[level]);
      setSelectedAnswers({});
      setActiveTab("quiz");
      setRetryMode(false);
      setQuizLevel(level);
      return;
    }

    setQuizLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${API_URL}/api/generate-quiz`, {
        method: "POST",
        headers: buildHeaders(tok),
        body: JSON.stringify({ transcript, difficulty: level }),
      });
      if (!res.ok) { setErrorMessage(await extractError(res, "Quiz generation failed.")); return; }
      const data = await res.json();
      const questions = Array.isArray(data?.quiz) ? data.quiz : [];
      const normalized = questions.map(q => ({
        ...q,
        correct: resolveCorrect(q),
      }));
      setQuizCache(prev => ({ ...prev, [level]: normalized }));
      setQuiz(normalized);
      setSelectedAnswers({});
      setActiveTab("quiz");
      setRetryMode(false);
      setQuizLevel(level);
    } catch { setErrorMessage("Quiz request failed."); }
    finally { setQuizLoading(false); }
  }, [quizCache, quizLevel, setActiveTab, setErrorMessage, setQuiz, setQuizCache, setQuizLevel, setQuizLoading, setRetryMode, setSelectedAnswers, token, transcript]);

  const sendChat = useCallback(async (raw) => {
    const userText = (raw || chatInput).trim();
    if (!userText || chatLoading) return;
    const tok = token || getAuthToken();
    const uid = `u-${Date.now()}`, aid = `a-${Date.now()+1}`;
    const payload = [
      { role: "system", content: `Video: '${selectedVideo?.title||""}'\nTranscript:\n${transcript.slice(0,12000)}` },
      ...chatMessages.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: userText },
    ];
    setChatMessages(p => [...p, { id: uid, role: "user", content: userText }, { id: aid, role: "assistant", content: "" }]);
    setChatInput(""); setChatLoading(true); setErrorMessage("");
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST", headers: buildHeaders(tok),
        body: JSON.stringify({ messages: payload, userContext: { id: tok.slice(0,12), name: (currentUser.name || "Student").trim(), email: currentUser.email } }),
      });
      if (!res.ok) {
        setErrorMessage(await extractError(res, "Chat failed."));
        setChatMessages(p => p.map(m => m.id===aid ? {...m,content:"I could not answer right now."} : m));
        return;
      }
      if (!res.body?.getReader) {
        const text = await res.text();
        setChatMessages(p => p.map(m => m.id===aid ? {...m,content:text} : m));
        return;
      }
      const reader = res.body.getReader(), dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value, { stream: true });
        setChatMessages(p => p.map(m => m.id===aid ? {...m,content:m.content+chunk} : m));
      }
    } catch {
      setChatMessages(p => p.map(m => m.id===aid ? {...m,content:"Connection interrupted."} : m));
    } finally { setChatLoading(false); }
  }, [chatInput, chatLoading, chatMessages, currentUser, selectedVideo, setChatInput, setChatLoading, setChatMessages, setErrorMessage, token, transcript]);

  useEffect(() => {
    const tok = ensureToken();
    if (!tok) return;
    fetchCurrentUser(tok);
  }, [ensureToken, fetchCurrentUser]);

  const handleLogout = () => { clearAuthToken(); navigate("/", { replace: true }); };
  const handleAnswer = (qi, opt) => setSelectedAnswers(p => ({ ...p, [qi]: opt }));

  const retryWrongAnswers = useCallback(() => {
    const wrongItems = quiz.filter((item, i) => {
      const resolved = item.correct;
      return selectedAnswers[i] !== resolved;
    });
    if (wrongItems.length === 0) return;
    setQuiz(wrongItems);
    setSelectedAnswers({});
    setRetryMode(true);
  }, [quiz, selectedAnswers, setQuiz, setRetryMode, setSelectedAnswers]);

  const resetQuiz = useCallback(() => {
    setSelectedAnswers({});
    setRetryMode(false);
  }, [setRetryMode, setSelectedAnswers]);
  const hasContent = summary || quiz.length > 0;

  const d = dark;
  const bg = d ? "bg-[#080f0b]" : "bg-[#f4f9f5]";
  const surface = d ? "bg-[#0d1a11]" : "bg-white";
  const border = d ? "border-[#1a3a24]" : "border-[#dceae2]";
  const text = d ? "text-[#c4e8d4]" : "text-[#0f2119]";
  const sub = d ? "text-[#4a8a62]" : "text-[#7a9e88]";

  return (
    <div style={{ fontFamily:"'DM Sans','Nunito',sans-serif" }}
      className={`min-h-screen ${bg} transition-colors duration-300`}>

      <header className={`sticky top-0 z-50 border-b ${border} ${d ? "bg-[#080f0b]/95" : "bg-white/95"} backdrop-blur-md`}>
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-3 px-3 sm:gap-4 sm:px-4 2xl:max-w-none">
          <div className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="WidiTutor" className="h-8 w-auto" />
            <span className={`hidden text-[15px] font-black tracking-tight sm:block ${text}`}>WidiTutor</span>
          </div>

          <form onSubmit={e => { e.preventDefault(); searchVideos(searchQuery); }}
            className={`mx-auto flex max-w-xl flex-1 items-center gap-2 rounded-full border px-3 py-2 shadow-inner transition focus-within:border-[#2f9d58] focus-within:ring-2 focus-within:ring-[#2f9d58]/20 sm:px-4 ${border} ${d ? "bg-[#0d1a11]" : "bg-[#f4f9f5]"}`}>
            <Search size={14} className={`shrink-0 ${sub}`} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search learning videos…"
              className={`w-full bg-transparent text-sm outline-none ${d ? "text-[#c4e8d4] placeholder-[#2a5a3a]" : "text-[#1a3325] placeholder-[#9ab5a3]"}`} />
            <button type="submit" disabled={searching}
              className="shrink-0 rounded-full bg-[#2f9d58] px-3 py-1.5 text-xs font-black text-white shadow-sm transition hover:bg-[#268248] disabled:opacity-60 sm:px-4">
              {searching ? <Loader2 size={12} className="animate-spin" /> : "Search"}
            </button>
          </form>

          <button type="button" onClick={() => navigate("/profile")}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-sm font-bold transition hover:border-[#2f9d58] sm:px-3 ${border} ${d ? "bg-[#0d1a11] text-[#c4e8d4]" : "bg-[#edf7f1] text-[#1a3325]"}`}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f9d58] text-[10px] font-black text-white">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block">{currentUser.name}</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] 2xl:max-w-none">
        <nav className={`hidden lg:flex shrink-0 flex-col items-center border-r py-4 gap-2 ${border} ${d ? "bg-[#080f0b]" : "bg-white"}`}
          style={{ width:64, height:"calc(100vh - 56px)", position:"sticky", top:"56px" }}>
          <div className="flex flex-col items-center gap-1 flex-1 w-full px-2 pt-1">
            <NavIcon icon={Home} label="Home" active dark={d} onClick={() => {}} />
            <NavIcon icon={User} label="Profile" dark={d} onClick={() => navigate("/profile")} />
            <NavIcon icon={Settings} label="Settings" dark={d} onClick={() => navigate("/profile")} />
          </div>
          <div className="flex flex-col items-center gap-1 w-full px-2 pb-2">
            <button type="button" onClick={() => setDark(v => !v)} title={d ? "Light mode" : "Dark mode"}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                d ? "bg-[#1a3a24] text-[#4ade80] hover:bg-[#224a2e]" : "text-[#5f8a70] hover:bg-[#f0faf3] hover:text-[#1a3325]"
              }`}>
              {d ? <Sun size={18} /> : <Moon size={18} />}
              <span className={`pointer-events-none absolute left-[115%] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold opacity-0 shadow-lg transition group-hover:opacity-100 ${
                d ? "bg-[#1a3a24] text-[#4ade80]" : "bg-[#1a3325] text-white"
              }`}>{d ? "Light mode" : "Dark mode"}</span>
            </button>
            <div className={`w-8 h-px my-1 ${border}`} />
            <button type="button" onClick={handleLogout} title="Logout"
              className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                d ? "text-[#6a4a4a] hover:bg-[#2a1010] hover:text-[#f87171]" : "text-[#9ab5a3] hover:bg-[#fff5f5] hover:text-[#e05c5c]"
              }`}>
              <LogOut size={18} />
              <span className={`pointer-events-none absolute left-[115%] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-bold opacity-0 shadow-lg transition group-hover:opacity-100 ${
                d ? "bg-[#2a1010] text-[#f87171]" : "bg-[#1a3325] text-white"
              }`}>Logout</span>
            </button>
          </div>
        </nav>

        <aside className={`hidden border-r lg:flex lg:flex-col shrink-0 lg:px-2 lg:py-2 ${border} ${d ? "bg-[#0a140d]" : "bg-white"}`}
          style={{ width:280, height:"calc(100vh - 56px)", position:"sticky", top:"56px" }}>
          <VideoList
            border={border}
            dark={d}
            text={text}
            sub={sub}
            videos={videos}
            searching={searching}
            selectedVideo={selectedVideo}
            onPickVideo={pickVideo}
            onCloseMobile={() => setMobilePanel(null)}
          />
        </aside>

        <main className={`flex-1 min-h-screen border-r ${border} ${bg} pb-16 lg:pb-0`}>
          <div className="bg-black">
            {selectedVideoEmbedUrl ? (
              <iframe src={selectedVideoEmbedUrl} title={selectedVideo?.title}
                className="mx-auto aspect-video w-full max-w-[1100px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            ) : (
              <div className="mx-auto flex aspect-video w-full max-w-[1100px] items-center justify-center bg-[#050d07]">
                <div className="text-center px-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d1f10]">
                    <PlayCircle size={28} className="text-[#3a8a52]" />
                  </div>
                  <p className="text-sm font-bold text-[#3a6a4a]">Search and select a video to begin</p>
                  <p className="mt-1 text-xs text-[#1e3a28]">No video loaded — search above to get started</p>
                </div>
              </div>
            )}
          </div>

          <div className={`border-b px-4 py-4 sm:px-5 ${border} ${surface}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className={`text-base font-black leading-snug sm:text-[17px] ${text}`}>
                  {selectedVideo?.title || "No video selected"}
                </h1>
                {selectedVideo?.channel && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2f9d58] text-[9px] font-black text-white">
                      {selectedVideo.channel.charAt(0).toUpperCase()}
                    </div>
                    <p className={`text-sm font-semibold ${sub}`}>{selectedVideo.channel}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={generateSummary}
                  disabled={summaryLoading || !transcript || transcriptLoading}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black shadow-sm transition hover:shadow-md disabled:opacity-50 sm:px-4 sm:text-sm ${
                    d ? "border-[#1a4a2e] bg-[#0d2a1a] text-[#4ade80]" : "border-[#a8dfc0] bg-gradient-to-b from-[#edf7f1] to-[#d8f0e4] text-[#1a6636]"
                  }`}>
                  {summaryLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  {summaryLoading ? "Generating…" : "AI Summary"}
                </button>
                <button type="button" onClick={() => generateQuiz(quizLevel)}
                  disabled={quizLoading || !transcript || transcriptLoading}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black shadow-sm transition hover:shadow-md disabled:opacity-50 sm:px-4 sm:text-sm ${
                    d ? "border-[#1a3a55] bg-[#0a1e2e] text-[#60a5fa]" : "border-[#a3cfee] bg-gradient-to-b from-[#edf5fb] to-[#d4e9f7] text-[#1a5a7a]"
                  }`}>
                  {quizLoading ? <Loader2 size={13} className="animate-spin" /> : <ListChecks size={13} />}
                  {quizLoading ? "Generating…" : `Quiz ${QUIZ_LEVELS.find(l=>l.id===quizLevel)?.emoji || ""}`}
                </button>
              </div>
            </div>
            {transcriptLoading && (
              <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                d ? "border-[#3a2a0a] bg-[#1a1008] text-[#c8a840]" : "border-[#f0d98b] bg-[#fef9ec] text-[#8a6a1a]"
              }`}>
                <Loader2 size={12} className="animate-spin" />
                <span className="text-xs font-semibold">AI is reading the transcript…</span>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className={`mx-4 mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm sm:mx-5 ${
              d ? "border-[#4a1a1a] bg-[#1a0a0a] text-[#f87171]" : "border-[#f3c7c7] bg-[#fff5f5] text-[#a34242]"
            }`}>⚠ {errorMessage}</div>
          )}

          {!hasContent && (
            <LandingPanel
              transcript={transcript} transcriptLoading={transcriptLoading}
              onSummary={generateSummary} onQuiz={() => generateQuiz(quizLevel)}
              summaryLoading={summaryLoading} quizLoading={quizLoading}
              selectedVideo={selectedVideo} dark={d} />
          )}

          {hasContent && (
            <div className="p-4 sm:p-5">
              <div className={`mb-5 flex gap-1 rounded-2xl p-1 shadow-sm ring-1 ${d ? "bg-[#0d1a11] ring-[#1a3a24]" : "bg-white ring-[#dceae2]"}`}>
                {summary && (
                  <button type="button" onClick={() => setActiveTab("summary")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-black transition ${
                      activeTab==="summary" ? "bg-[#2f9d58] text-white shadow-sm" : d ? "text-[#4a8a62] hover:text-[#4ade80]" : "text-[#5f8a70] hover:text-[#1a6636]"
                    }`}>
                    <Sparkles size={14} /> AI Summary
                  </button>
                )}
                {quiz.length > 0 && (
                  <button type="button" onClick={() => setActiveTab("quiz")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-black transition ${
                      activeTab==="quiz" ? "bg-[#1a6e9f] text-white shadow-sm" : d ? "text-[#4a8a62] hover:text-[#60a5fa]" : "text-[#5f8a70] hover:text-[#1a5a7a]"
                    }`}>
                    <ListChecks size={14} /> Quiz
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                      activeTab==="quiz" ? "bg-white/25 text-white" : d ? "bg-[#1a3a55] text-[#60a5fa]" : "bg-[#d4e9f7] text-[#1a5a7a]"
                    }`}>{quiz.length}</span>
                  </button>
                )}
              </div>

              {activeTab==="summary" && summary && (
                <SummarySection summary={summary} dark={d} text={text} sub={sub} />
              )}

              {activeTab==="quiz" && (
                <QuizSection
                  quiz={quiz}
                  selectedAnswers={selectedAnswers}
                  quizLevel={quizLevel}
                  quizCache={quizCache}
                  quizLoading={quizLoading}
                  retryMode={retryMode}
                  dark={d}
                  text={text}
                  sub={sub}
                  onGenerateQuiz={generateQuiz}
                  onRetryWrongAnswers={retryWrongAnswers}
                  onResetQuiz={resetQuiz}
                  onSelectAnswer={handleAnswer}
                />
              )}
            </div>
          )}
        </main>

        <aside className={`hidden lg:flex shrink-0 flex-col border-l ${border} ${d ? "bg-[#080f0b]" : "bg-white"}`}
          style={{ width:376, height:"calc(100vh - 56px)", position:"sticky", top:"56px" }}>
          <ChatPanel
            border={border}
            dark={d}
            text={text}
            sub={sub}
            selectedVideo={selectedVideo}
            currentUser={currentUser}
            chatMessages={chatMessages}
            chatInput={chatInput}
            chatLoading={chatLoading}
            onSendChat={sendChat}
            onChatInputChange={setChatInput}
            onCloseMobile={() => setMobilePanel(null)}
            chatScrollRef={chatScrollRef}
            suggestions={DEFAULT_SUGGESTIONS}
          />
        </aside>
      </div>

      <nav className={`fixed bottom-0 left-0 right-0 z-40 flex items-center border-t lg:hidden ${border} ${d ? "bg-[#080f0b]/97" : "bg-white/97"} backdrop-blur-md`}>
        <MobileNavBtn
          icon={Home} label="Home" active={!mobilePanel}
          dark={d} onClick={() => setMobilePanel(null)} />
        <MobileNavBtn
          icon={LayoutList} label="Videos"
          badge={videos.length > 0 ? videos.length : null}
          active={mobilePanel==="videos"}
          dark={d} onClick={() => setMobilePanel(v => v==="videos" ? null : "videos")} />
        <MobileNavBtn
          icon={Bot} label="Chat"
          badge={chatMessages.length > 1 ? chatMessages.length - 1 : null}
          active={mobilePanel==="chat"}
          dark={d} onClick={() => setMobilePanel(v => v==="chat" ? null : "chat")} />
        <MobileNavBtn
          icon={d ? Sun : Moon} label={d ? "Light" : "Dark"}
          dark={d} onClick={() => setDark(v => !v)} />
        <MobileNavBtn
          icon={User} label="Profile"
          dark={d} onClick={() => navigate("/profile")} />
      </nav>

      {mobilePanel && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobilePanel(null)} />
      )}

      <div className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl shadow-2xl lg:hidden transition-transform duration-300 ease-out ${border} ${d ? "bg-[#0a140d]" : "bg-white"} ${
        mobilePanel==="videos" ? "translate-y-0" : "translate-y-full"
      }`} style={{ height:"75vh" }}>
        <VideoList
          border={border}
          dark={d}
          text={text}
          sub={sub}
          videos={videos}
          searching={searching}
          selectedVideo={selectedVideo}
          onPickVideo={pickVideo}
          onCloseMobile={() => setMobilePanel(null)}
        />
      </div>

      <div className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl shadow-2xl lg:hidden transition-transform duration-300 ease-out ${border} ${d ? "bg-[#080f0b]" : "bg-white"} ${
        mobilePanel==="chat" ? "translate-y-0" : "translate-y-full"
      }`} style={{ height:"80vh" }}>
        <ChatPanel
          border={border}
          dark={d}
          text={text}
          sub={sub}
          selectedVideo={selectedVideo}
          currentUser={currentUser}
          chatMessages={chatMessages}
          chatInput={chatInput}
          chatLoading={chatLoading}
          onSendChat={sendChat}
          onChatInputChange={setChatInput}
          onCloseMobile={() => setMobilePanel(null)}
          chatScrollRef={chatScrollRef}
          suggestions={DEFAULT_SUGGESTIONS}
        />
      </div>

      <style>{`
        @keyframes musicBar {
          from { height:4px; }
          to   { height:13px; }
        }
        @keyframes widiPulse {
          0%,100% { transform:translateY(0); opacity:1; }
          50%      { transform:translateY(-4px); opacity:0.5; }
        }
      `}</style>
    </div>
  );
}
