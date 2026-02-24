import { useCallback, useState } from "react";

export function useSession(key, initial) {
  const [val, setValRaw] = useState(() => {
    try {
      const s = sessionStorage.getItem(key);
      return s !== null ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  const setVal = useCallback((v) => {
    setValRaw(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { sessionStorage.setItem(key, JSON.stringify(next)); }
      catch { return next; }
      return next;
    });
  }, [key]);
  return [val, setVal];
}

export function useLocal(key, initial) {
  const [val, setValRaw] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s !== null ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  const setVal = useCallback((v) => {
    setValRaw(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); }
      catch { return next; }
      return next;
    });
  }, [key]);
  return [val, setVal];
}
