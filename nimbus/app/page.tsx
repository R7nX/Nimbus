"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function App() {
  const [code, setCode] = useState(`function greet(n){ return "Hello, " + n; }\nconsole.log(greet("World"));`);
  return (
    <div className="h-screen flex flex-col">
      <header className="p-3 border-b">VS Lite — Editor</header>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
}
