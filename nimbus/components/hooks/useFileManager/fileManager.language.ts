// hooks/useFileManager/fileManger.language.ts: 
// Define language support + metadata
//
// Scope (current):
// - Nimbus Editor supports Python only.
//
// Types:
// - `Language`: supported languages (currently just "python").
//
// Metadata (`LANGUAGE_META`):
// Single source of truth mapping each Language to UI + Monaco config:
// - label: display name shown in the UI
// - icon: path to the language icon asset
// - monacoId: Monaco language id used for syntax highlighting
// - defaultExt: default file extension used for Save As / new files

export type Language =
  | "python"
  | "unknown";

export type LanguageMeta = {
  label: string;
  icon: string;
  monacoId: string;
  defaultExt: string;
};

export const LANGUAGE_META: Record< Language, LanguageMeta> = {
    python:     { label: "Python",     icon: "/icons/python.svg",     monacoId: "python",     defaultExt: ".py" },
    unknown:    { label: "Unknown", icon: "/icons/unknown.svg",    monacoId: "plaintext", defaultExt: ".txt" },
};
