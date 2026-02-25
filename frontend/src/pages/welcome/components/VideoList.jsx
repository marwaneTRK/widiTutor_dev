import { PlayCircle, Search, X } from "lucide-react";
import VideoSkeleton from "./VideoSkeleton";

export default function VideoList({
  border,
  dark: d,
  text,
  sub,
  videos,
  searching,
  selectedVideo,
  onPickVideo,
  onCloseMobile,
}) {
  return (
    <>
      <div className={`border-b px-4 py-3 ${border}`}>
        <div className="flex items-center justify-between">
          <p className={`text-[10px] font-black uppercase tracking-widest ${sub}`}>
            {searching ? "Searching…" : videos.length > 0 ? `${videos.length} Videos Found` : "Videos"}
          </p>
          <button type="button" onClick={onCloseMobile}
            className={`flex h-7 w-7 items-center justify-center rounded-full lg:hidden ${d ? "bg-[#1a3a24] text-[#4a8a62]" : "bg-[#f0faf3] text-[#7a9e88]"}`}>
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {searching ? (
          <div className="space-y-1 px-2">{[...Array(6)].map((_,i) => <VideoSkeleton key={i} dark={d} />)}</div>
        ) : videos.length > 0 ? (
          <div className="space-y-0.5 px-2">
            {videos.map((video, idx) => {
              const isActive = selectedVideo?.id === video.id;
              return (
                <button key={video.id} type="button" onClick={() => onPickVideo(video)}
                  className={`group relative flex w-full gap-3 rounded-xl px-2 py-2 text-left transition-all ${
                    isActive ? d ? "bg-[#0d2a1a]" : "bg-[#e8f7ee]"
                             : d ? "hover:bg-[#0a1e10]" : "hover:bg-[#f4f9f5]"
                  }`}>
                  {isActive && <div className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#2f9d58]" />}
                  <div className="relative shrink-0 overflow-hidden rounded-lg" style={{ width:104, height:58 }}>
                    <img src={video.thumbnail} alt={video.title}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105" />
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/25">
                        <div className="scale-0 rounded-full bg-white/90 p-1.5 shadow-md transition group-hover:scale-100">
                          <PlayCircle size={13} className="text-[#1a3325]" />
                        </div>
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#2f9d58]/25">
                        <div className="flex items-end gap-[3px]">
                          {[0,1,2].map(b => (
                            <div key={b} className="w-[3px] rounded-full bg-white"
                              style={{ animation:"musicBar 0.7s ease-in-out infinite alternate", animationDelay:`${b*120}ms`, height:10 }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className={`absolute left-1.5 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded px-1 text-[9px] font-black ${
                      isActive ? "bg-[#2f9d58] text-white" : "bg-black/55 text-white"
                    }`}>{idx+1}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`line-clamp-2 text-[11.5px] leading-snug ${
                      isActive ? `font-black ${d ? "text-[#c4e8d4]" : "text-[#1a3325]"}`
                               : `font-semibold ${d ? "text-white group-hover:text-[#f1fff7]" : "text-[#2d4a3a] group-hover:text-[#1a3325]"}`
                    }`}>{video.title}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2f9d58] text-[7px] font-black text-white">
                        {video.channel?.charAt(0)?.toUpperCase()||"?"}
                      </div>
                      <p className={`line-clamp-1 text-[10px] ${sub}`}>{video.channel}</p>
                    </div>
                    {isActive && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#2f9d58] px-2 py-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-[9px] font-black text-white">Now Learning</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${d ? "bg-[#0d2a1a]" : "bg-[#edf7f1]"}`}>
              <Search size={22} className="text-[#7ab890]" />
            </div>
            <p className={`text-sm font-bold ${text}`}>No results yet</p>
            <p className={`mt-1 text-xs ${sub}`}>Search above to find videos</p>
          </div>
        )}
      </div>
      {videos.length > 0 && !searching && (
        <div className={`border-t px-4 py-2 ${border}`}>
          <p className={`text-center text-[10px] ${sub}`}>Click any video to load it</p>
        </div>
      )}
    </>
  );
}
