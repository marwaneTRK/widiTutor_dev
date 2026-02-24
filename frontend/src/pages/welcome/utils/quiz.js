export function resolveCorrect(item) {
  const opts = item.options || [];
  const raw = item.correct;
  if (raw === undefined || raw === null) return "";
  if (opts.includes(raw)) return raw;
  if (typeof raw === "string" && /^[a-dA-D]$/.test(raw.trim())) {
    const idx = raw.toUpperCase().charCodeAt(0) - 65;
    if (opts[idx] !== undefined) return opts[idx];
  }
  const num = parseInt(raw, 10);
  if (!isNaN(num) && opts[num] !== undefined) return opts[num];
  return String(raw);
}
