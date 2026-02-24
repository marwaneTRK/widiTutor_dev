export default function VideoSkeleton({ dark: d }) {
  const sh = d ? "bg-[#1e3028]" : "bg-[#e0ece5]";
  return (
    <div className="flex gap-3 rounded-xl p-2 animate-pulse">
      <div className={`h-[60px] w-[108px] shrink-0 rounded-lg ${sh}`} />
      <div className="flex-1 space-y-2 pt-1">
        <div className={`h-3 w-full rounded ${sh}`} />
        <div className={`h-3 w-5/6 rounded ${d ? "bg-[#182820]" : "bg-[#e8f2eb]"}`} />
        <div className={`h-2.5 w-1/2 rounded ${d ? "bg-[#142218]" : "bg-[#edf5ef]"}`} />
      </div>
    </div>
  );
}
