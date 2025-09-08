"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import Header from "@/components/header";
import Link from "next/link";
export default function App() {
  const [code, setCode] = useState(`function greet(n){ return "Hello, " + n; }\nconsole.log(greet("World"));`);
  return (
    <div className="h-screen flex flex-col">
      <header className="p-3 border-b">VS Lite — Editor</header>
              {/* Login Button */}
      {/* <div className="absolute top-4 right-4 z-20">
        <Link href="/login">

            Log In

        </Link>
        </div> */}
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
