export const extractError = async (res, fallback) => {
  try { const d = await res.json(); return d?.error || d?.message || fallback; }
  catch { return fallback; }
};

export const buildHeaders = (tok) => ({ "Content-Type": "application/json", Authorization: `Bearer ${tok}` });
