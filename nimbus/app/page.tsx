"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FileTree, type TreeNode } from "@/components/FileTree";
import { TabBar, type OpenFileTab } from "@/components/TabBar";
import { useFileManager } from "@/components/hooks/useFileManager"
import Link from "next/link";

// File structure for the file explorer. In a real app, this would come from the backend or filesystem.
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

  // File tree section:
  // --------------------------------------------------------------------------------
  // Handle Single Click on file in FileTree: open in "preview" mode (reusing same tab) 
  // and mark as dirty on edit.
  const handleSelectFile = (node: TreeNode, path: string) => {
    const nextFile: OpenFileTab = {
      id: path,
      name: node.name,
      contents: node.content ?? "",
      isDirty: false,
      isPreview: true,
    }

    setOpenFiles((files) => {
      const alreadyOpen = files.some((file) => file.id === path);

      if (alreadyOpen) {
        return files;
      }

      const activeFile = files.find((file) => file.id === activeFileId);

      if (activeFile?.isPreview) {
        return files.map((file) =>
          file.id === activeFileId ? nextFile : file
        );
      }

      return [...files, nextFile];
    });
    
    LoadFileHelper(path, nextFile);
    
  };

  // Handle Double Click on file in FileTree: open in "normal" mode (new tab if preview, 
  // or reuse if already open) and mark as dirty on edit.
  const handleOpenFile = (node: TreeNode, path: string) => {
    const nextFile: OpenFileTab = {
      id: path,
      name: node.name,
      contents: node.content ?? "",
      isDirty: false,
      isPreview: false,
    }

    setOpenFiles((files) => {
      const alreadyOpen = files.some((file) => file.id === path);

      if (alreadyOpen) {
        return files.map((file) =>
          file.id === path ? { ...file, isPreview: false } : file
        );
      }

      return [...files, nextFile];
    });

    LoadFileHelper(path, nextFile);
  }

  // Help set which file is active in the editor and open it in the file manager 
  // (which tracks dirty state, etc.)
  function LoadFileHelper(path: string, nextFile: OpenFileTab) {
    setActiveFileId(path);
    setActiveFilePath(path);

    openVirtualFile({
      name: nextFile.name,
      contents: nextFile.contents,
    });
  }

  // Tab bar section:
  // --------------------------------------------------------------------------------
  const [openFiles, setOpenFiles] = useState<OpenFileTab[]>([
     {
      id: "temp.py",
      name: "temp.py",
      contents: code,
      isDirty: false,
      isPreview: false,
    },
  ]);
  const [activeFileId, setActiveFileId] = useState<string>("temp.py");

  // Handle click on tab in TabBar: switch to that file and open in file manager
  const handleSelectTab = (id: string) => {
    const file = openFiles.find((file) => file.id === id);
    if (!file) return;

    setActiveFileId(file.id);
    setActiveFilePath(file.id);
    openVirtualFile({
      name: file.name,
      contents: file.contents,
    });
  };

  // Basic layout: sidebar for file explorer + main editor area with header
  // No 'New' button because hook is load/save-only per your request
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Static sidebar for file explorer */}
      <aside className="w-[15vw] shrink-0 bg-neutral-900 text-neutral-100">
        <header className="h-12 px-4 flex items-center border-b border-neutral-800">
          Explorer
        </header>
        <FileTree
              nodes={sampleFileTree}
              activePath={activeFilePath}
              onSelectFile={handleSelectFile}
              onOpenFile={handleOpenFile}
            />
      </aside>

      {/* Main editor area */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="p-3 border-b flex items-center gap-2">
          <span className="font-semibold">VS Lite — Editor</span>

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
  
        {/* Tab bar for open files */}
        <TabBar
          files={openFiles}
          activeFileId={activeFileId ?? ""}
          onSelectFile={handleSelectTab}
        />

        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language={language} // tracks extension (e.g., .py -> python)
            theme={theme}
            value={code}
            onChange={(v) => {
              const nextCode = v ?? "";
              setCode(nextCode);
              setOpenFiles((files) =>
                files.map((file) =>
                  file.id === activeFileId
                    ? { ...file, contents: nextCode, isDirty: true }
                    : file
                )
              );
            }}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
      </main>
    </div>
  );

}
