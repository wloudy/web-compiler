import { DEFAULT_CODE, type ProjectCode } from "@/lib/default-code";

const STORAGE_KEY = "web-compiler-project";

export function loadFromStorage(): ProjectCode {
  if (typeof window === "undefined") return DEFAULT_CODE;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_CODE;

  try {
    const parsed = JSON.parse(raw) as Partial<ProjectCode>;
    return {
      html: parsed.html ?? DEFAULT_CODE.html,
      css: parsed.css ?? DEFAULT_CODE.css,
      javascript: parsed.javascript ?? DEFAULT_CODE.javascript
    };
  } catch {
    return DEFAULT_CODE;
  }
}

export function saveToStorage(code: ProjectCode): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(code));
}
