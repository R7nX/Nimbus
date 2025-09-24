"use client"
import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import Header from "@/components/header";
import { useFileManager } from "@/components/useFileManager"
import Link from "next/link";


export default function App() {
const {
    code,
    setCode,          // call this in Editor onChange; it marks buffer dirty
    isDirty,
    fileName,
    language,         // inferred from file extension on open/save-as
    openFile,
    saveFile,
    saveFileAs,
    fileInputProps,   // spread onto a hidden <input> for non-Chromium fallback
  } = useFileManager();

  // UI-only theme (you can add a theme toggle if you like)
  const [theme] = useState<string>("vs-dark");

  return (
    <div className="h-screen flex flex-col">
      <header className="p-3 border-b flex items-center gap-2">
        <span className="font-semibold">VS Lite — Editor</span>
        <span className="text-sm text-gray-500">
          {fileName}
          {isDirty ? " •" : ""}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {/* No 'New' button because hook is load/save-only per your request */}
          <button className="px-3 py-1 border rounded" onClick={openFile}>
            Open
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={saveFile}
            disabled={!isDirty} // Save enabled only when there are changes
            title={isDirty ? "Save (changes present)" : "Nothing to save"}
          >
            Save
          </button>
          <button className="px-3 py-1 border rounded" onClick={saveFileAs}>
            Save As
          </button>
          <Link href="/login" className="underline ml-2">
            Log In
          </Link>
        </div>

        {/* Hidden input for Safari/Firefox open fallback */}
        <input {...fileInputProps} />
      </header>

      <div className="flex-1">
        <Editor
          height="100%"
          language={language} // tracks extension (e.g., .py -> python)
          theme={theme}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
}
