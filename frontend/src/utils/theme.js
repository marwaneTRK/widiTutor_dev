const THEME_KEY = "widi_dark";

function parseTheme(value, fallback = false) {
  try {
    return value !== null ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getStoredTheme(defaultValue = false) {
  return parseTheme(localStorage.getItem(THEME_KEY), defaultValue);
}

export function applyTheme(isDark) {
  document.documentElement.classList.toggle("dark", Boolean(isDark));
}

export function setStoredTheme(isDark) {
  localStorage.setItem(THEME_KEY, JSON.stringify(Boolean(isDark)));
  applyTheme(Boolean(isDark));
  window.dispatchEvent(new CustomEvent("widi-theme-change", { detail: Boolean(isDark) }));
}

export function initTheme(defaultValue = false) {
  const isDark = getStoredTheme(defaultValue);
  applyTheme(isDark);
  return isDark;
}

