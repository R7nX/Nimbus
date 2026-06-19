"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FileTree, type TreeNode } from "@/components/FileTree";
import { useFileManager } from "@/components/hooks/useFileManager"
import Link from "next/link";

const sampleFileTree: TreeNode[] = [
  {
    name: "app",
    type: "folder",
    children: [
      {
        name: "page.tsx",
        type: "file",
        content: `export default function HomePage() {
  return <main>Welcome to Nimbus.</main>;
}
`,
      },
      {
        name: "layout.tsx",
        type: "file",
        content: `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html lang="en"><body>{children}</body></html>;
}
`,
      },
      {
        name: "login",
        type: "folder",
        children: [
          {
            name: "page.tsx",
            type: "file",
            content: `export default function LoginPage() {
  return <form>Log in to Nimbus</form>;
}
`,
          },
        ],
      },
    ],
  },
  {
    name: "components",
    type: "folder",
    children: [
      {
        name: "FileTree.tsx",
        type: "file",
        content: `export function FileTree() {
  return <nav aria-label="Project files" />;
}
`,
      },
      {
        name: "FileToolbar.tsx",
        type: "file",
        content: `export function FileToolbar() {
  return <div>File actions</div>;
}
`,
      },
      {
        name: "hooks",
        type: "folder",
        children: [
          {
            name: "useFileManager.ts",
            type: "file",
            content: `export function useFileManager() {
  return { fileName: "temp.py" };
}
`,
          },
        ],
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    content: `{
  "name": "nimbus",
  "private": true
}
`,
  },
  {
    name: "tailwind.config.ts",
    type: "file",
    content: `import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
} satisfies Config;
`,
  },
];


export default function App() {
  const {
    code,
    setCode,          // call this in Editor onChange; it marks buffer dirty
    isDirty,
    fileName,
    language,         // inferred from file extension on open/save-as
    openFile,
    openVirtualFile,
    saveFile,
    saveFileAs,
    fileInputProps,   // spread onto a hidden <input> for non-Chromium fallback
  } = useFileManager();

  const [theme] = useState<string>("vs-dark");
  const [activeFilePath, setActiveFilePath] = useState<string>();

  const handleSelectFile = (node: TreeNode, path: string) => {
    openVirtualFile({
      name: node.name,
      contents: node.content ?? "",
    });
    setActiveFilePath(path);
  };

  // Basic layout: sidebar for file explorer + main editor area with header
  // No 'New' button because hook is load/save-only per your request
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Static sidebar for file explorer */}
      {/* TODO: implementing file tree */}
      <aside className="w-[15vw] shrink-0 bg-neutral-900 text-neutral-100">
        <header className="h-12 px-4 flex items-center border-b border-neutral-800">
          Explorer
        </header>
        <FileTree
              nodes={sampleFileTree}
              activePath={activeFilePath}
              onSelectFile={handleSelectFile}
            />
      </aside>

      {/* Main editor area */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="p-3 border-b flex items-center gap-2">
          <span className="font-semibold">VS Lite — Editor</span>
          <span className="text-sm text-gray-500">
            {fileName}
            {isDirty ? " •" : ""}
          </span>

          <div className="ml-auto flex items-center gap-2">
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
          <input {...fileInputProps} suppressHydrationWarning/>
        </header>
  
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language={language} // tracks extension (e.g., .py -> python)
            theme={theme}
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
      </main>
    </div>
  );
}
