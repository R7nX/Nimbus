"use client"
import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import Header from "@/components/header";
import { useFileManager } from "@/components/useFileManager"
import Link from "next/link";


export default function App() {
    const [code, setCode] = useState<string>(`def Hello(): \n return "Hello World`);
  const [language, setLanguage] = useState<string>("python");
  const [theme, setTheme] = useState<string>("vs-dark");
  const [file, setFileName] = useState<string>("untitled.py");
  const [isDirty, setIsDirty] = useState<boolean>(false); // Track whether the file is unsaved
  const fileHandleRef = useRef<FileSystemFileHandle | null> (null);
  const hiddenFileInputRef = useRef<HTMLInputElement | null> (null);



  return (
    <div className="h-screen flex flex-col">
<header className="p-3 border-b flex items-center gap-2">
<span className="font-semibold">VS Lite — Editor</span>
<span className="text-sm text-gray-500">{fileName}{isDirty ? " •" : ""}</span>
<div className="ml-auto flex items-center gap-2">
<button className="px-3 py-1 border rounded" onClick={() => newFile()}>New</button>
<button className="px-3 py-1 border rounded" onClick={openFile}>Open</button>
<button className="px-3 py-1 border rounded" onClick={saveFile}>Save</button>
<button className="px-3 py-1 border rounded" onClick={saveFileAs}>Save As</button>
<Link href="/login" className="underline ml-2">Log In</Link>
</div>
<input {...fileInputProps} />
</header>


<div className="flex-1">
<Editor
height="100%"
language="python"
theme="vs-dark"
value={code}
onChange={(v) => setCode(v ?? "")}
options={{ fontSize: 14, minimap: { enabled: false } }}
/>
</div>
</div>
);
}
  );
}
