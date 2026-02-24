import { Bot, Loader2, SendHorizonal, X } from "lucide-react";
import MessageRenderer from "./MessageRenderer";

export default function ChatPanel({
  border,
  dark: d,
  text,
  sub,
  selectedVideo,
  currentUser,
  chatMessages,
  chatInput,
  chatLoading,
  onSendChat,
  onChatInputChange,
  onCloseMobile,
  chatScrollRef,
  suggestions,
}) {
  return (
    <>
      <div className={`border-b px-4 py-3 ${border} ${d ? "bg-[#0a140d]" : "bg-gradient-to-r from-[#f8fbf9] to-white"}`}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2f9d58] to-[#1a6636] shadow-md">
            <Bot size={17} className="text-white" />
            <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 bg-[#22c55e]"
              style={{ borderColor: d ? "#080f0b" : "white" }} />
          </div>
          <div>
            <p className={`text-sm font-black ${text}`}>AI Tutor</p>
            <p className={`text-[11px] ${sub}`}>
              {selectedVideo ? `${selectedVideo.title.slice(0,24)}…` : "Select a video first"}
            </p>
          </div>
          {selectedVideo && (
            <div className={`ml-auto flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${d ? "border-[#1a4a2e] bg-[#0d2a1a]" : "border-[#c8e8d4] bg-[#edf7f1]"}`}>
              <div className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <span className={`text-[10px] font-black ${d ? "text-[#4ade80]" : "text-[#1a6636]"}`}>Live</span>
            </div>
          )}
          <button type="button" onClick={onCloseMobile}
            className={`ml-auto flex h-7 w-7 items-center justify-center rounded-full lg:hidden ${d ? "bg-[#1a3a24] text-[#4a8a62]" : "bg-[#f0faf3] text-[#7a9e88]"}`}>
            <X size={14} />
          </button>
        </div>
      </div>

      <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role==="user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                msg.role==="user" ? "bg-[#2f9d58] text-white"
                : d ? "bg-[#0d2a1a] ring-1 ring-[#1a4a2e]" : "bg-[#edf7f1] ring-1 ring-[#b3dcc4]"
              }`}>
                {msg.role==="user" ? currentUser.name.charAt(0).toUpperCase() : <Bot size={13} className="text-[#2f9d58]" />}
              </div>
              <div className={`w-full max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm ${
                msg.role==="user"
                  ? "rounded-tr-sm bg-[#2f9d58] text-white shadow-sm"
                  : d ? "rounded-tl-sm bg-[#0d2a1a] text-[#9ad4b2] ring-1 ring-[#1a4a2e]"
                      : "rounded-tl-sm bg-[#f4f9f5] text-[#1a3325] ring-1 ring-[#dceae2]"
              }`}>
                {msg.content ? (
                  <MessageRenderer content={msg.content} isUser={msg.role==="user"} dark={d} />
                ) : msg.role==="assistant" ? (
                  <span className="flex items-center gap-1 py-0.5">
                    {[0,150,300].map((dl,i) => (
                      <span key={i} className="inline-block h-1.5 w-1.5 rounded-full bg-[#2f9d58]"
                        style={{ animation:"widiPulse 1s ease-in-out infinite", animationDelay:`${dl}ms` }} />
                    ))}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`border-t px-4 py-2.5 ${border}`}>
        <p className={`mb-2 text-[10px] font-black uppercase tracking-widest ${sub}`}>Quick asks</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => onSendChat(s)} disabled={chatLoading}
              className={`rounded-full border px-3 py-1 text-[11px] font-bold transition hover:border-[#2f9d58] disabled:opacity-50 ${
                d ? "border-[#1a4a2e] bg-[#0d1a11] text-[#4a8a62] hover:bg-[#0d2a1a] hover:text-[#4ade80]"
                  : "border-[#c8dece] bg-[#f4f9f5] text-[#3a6b4e] hover:bg-[#edf7f1]"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      <div className={`border-t p-3 ${border}`}>
        <div className={`flex items-end gap-2 rounded-2xl border px-3 py-2 transition focus-within:border-[#2f9d58] focus-within:ring-2 focus-within:ring-[#2f9d58]/20 ${border} ${d ? "bg-[#0d1a11]" : "bg-[#f4f9f5]"}`}>
          <textarea
            value={chatInput}
            onChange={e => onChatInputChange(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); onSendChat(); } }}
            placeholder="Ask anything about this video…"
            rows={1}
            className={`w-full resize-none bg-transparent text-sm outline-none ${d ? "text-[#c4e8d4] placeholder-[#1a4a2e]" : "text-[#1a3325] placeholder-[#9ab5a3]"}`}
            style={{ maxHeight:"100px" }}
          />
          <button type="button" onClick={() => onSendChat()}
            disabled={chatLoading || !chatInput.trim()}
            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2f9d58] text-white shadow-sm transition hover:bg-[#268248] disabled:opacity-40">
            {chatLoading ? <Loader2 size={14} className="animate-spin" /> : <SendHorizonal size={14} />}
          </button>
        </div>
        <p className={`mt-1.5 text-center text-[10px] ${sub}`}>Enter to send · Shift+Enter for new line</p>
      </div>
    </>
  );
}
