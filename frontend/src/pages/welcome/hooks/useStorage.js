import { useCallback, useState } from "react";
import { applyTheme } from "../../../utils/theme";

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
      const parsed = s !== null ? JSON.parse(s) : initial;
      if (key === "widi_dark") {
        applyTheme(Boolean(parsed));
      }
      return parsed;
    } catch { return initial; }
  });
  const setVal = useCallback((v) => {
    setValRaw(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try {
        localStorage.setItem(key, JSON.stringify(next));
        if (key === "widi_dark") {
          applyTheme(Boolean(next));
          window.dispatchEvent(new CustomEvent("widi-theme-change", { detail: Boolean(next) }));
        }
      }
      catch { return next; }
      return next;
    });
  }, [key]);
  return [val, setVal];
}
