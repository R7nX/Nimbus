import type { Language } from ".//fileManager.type";

export const PLAIN_TEXT_EXTS = [
  ".py",
  ".ts",
  ".js",
  ".json",
  ".txt",
  ".html",
  ".css",
  ".md",
];

export const PICKER_TYPES = [
  {
    description: "Code files",
    accept: { "text/plain": PLAIN_TEXT_EXTS },
  },
] as const;

// Default file extensions
export function defaultExt(lang: Language | string): string {
  switch (lang) {
    case "typescript": return ".ts";
    case "javascript": return ".js";
    case "json":       return ".json";
    case "html":       return ".html";
    case "css":        return ".css";
    case "python":
    default:           return ".py";
  }
}