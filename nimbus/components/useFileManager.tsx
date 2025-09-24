import { useCallback, useEffect, useMemo, useRef, useState } from "react";



export type FileManagerOptions = {
  /** Initial buffer text */
  initialCode?: string;
  /** Initial Monaco language (affects default extension via extFromLang) */
  initialLanguage?: "python" | "typescript" | "javascript" | "json" | "html" | "css";
  /** Initial display name in the UI (doesn’t create a file) */
  initialName?: string;
};

export type UseFileManager = {
  code: string; 
  setCode: (s: string) => void;
  isDirty: boolean; // Tells if the file is saved or not
  fileName: string;
  language: FileManagerOptions["initialLanguage"];

  // actions
  newFile: (name?: string, language?: UseFileManager["language"]) => void;
  openFile: () => Promise<void>;
  saveFile: () => Promise<void>;
  saveFileAs: () => Promise<void>;


  //DOM helpers for exception
  fileInputProps: {
    ref: React.RefObject<HTMLInputElement>;
    type: "file";
    accept: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className: string;
  };
};

export function useFileManager(opts: FileManagerOptions = {}): UseFileManager {
  const {
    initialCode = "def hello():\n return 'Hello, World!'\n",
    initialLanguage = "python",
    initialName = "untitled.py",
  } = opts;

  const [code, setCode] = useState<string>(initialCode);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>(initialName);
  const [language, setLanguage] = useState<UseFileManager>(initialLanguage);
  /** Handle to the file picked via FS Access API; null = fallback or unsaved buffer */
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
  /** Hidden input for non-Chromium fallback open */
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  /** Feature-detect the File System Access API (Chromium browsers) */
  const supportsFSA = useMemo {
    () => typeof window != "undefined" && "showOpenFilePicker" in window, []
  };

  /** File picker filter: show common text/code extensions */
  const pickerTypes = useMemo {
    () => [
      {
        description: "Code files", 
        accept: {
          "text/plain": [
            ".py",
            ".ts",
            ".js",
            ".json",
            ".txt",
            ".html", 
            ".css",
            ".md",
          ],
        },
      },
    ],
    []
  };

  /** Choose a default extension based on editor language (for Save As suggestedName) */
  const extFromLang = useCallback((lang: string) => {
    switch (lang) {
      case "typescript":
      return ".ts";
      case "javascript":
      return ".js";
      case "json":
      return ".json";
      case "html":
      return ".html";
      case "css":
      return ".css";
      case "python":
      default:
      return ".py";
      }
    }, []); 

  /** Infer Monaco language from filename (used on successful open/save-as) */
  const inferLanguageFromName = useCallback((name: string) => {
    if (name.endsWith(".ts")) setLanguage("typescript");
    else if (name.endsWith(".js")) setLanguage("javascript");
    else if (name.endsWith(".json")) setLanguage("json");
    else if (name.endsWith(".html")) setLanguage("html");
    else if (name.endsWith(".css")) setLanguage("css");
    else setLanguage("python");
  }, []);

  /** Replace buffer text and mark as dirty (use this in your editor onChange) */
  const setCode = useCallback((s: string) => {
    _setCode(s);
    setIsDirty(true);
  }, []);


  /** Fallback: trigger a plain-text download (used when FS Access API is unavailable) */
  const downloadBlob = useCallback((text: string, name: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);


  /** Write contents to a FileSystemFileHandle (Chromium) */
  const writeHandle = useCallback(
    async (handle: FileSystemFileHandle, contents: string) => {
      // Some browsers require explicit permission before writing
      // @ts-expect-error: FS Access API types may not be in TS lib
      const perm = await handle.requestPermission?.({ mode: "readwrite" });
      if (perm === "denied") throw new Error("Permission denied");

      const writable = await handle.createWritable();
      await writable.write(contents);
      await writable.close();
    },
    []
  );




  /** OPEN: pick a file, read as text, load into buffer */
  const openFile = useCallback(async () => {
    try {
      if (supportsFSA) {
        // @ts-expect-error: FS Access API
        const [handle] = await (window as any).showOpenFilePicker({
          types: pickerTypes,
          excludeAcceptAllOption: false,
          multiple: false,
        });
        const file = await handle.getFile();
        const text = await file.text();

        fileHandleRef.current = handle; // remember where we opened from
        setFileName(file.name);
        _setCode(text); // direct set (not dirty—matches disk)
        setIsDirty(false);
        inferLanguageFromName(file.name);
        return;
      }

      // Fallback path (Safari/Firefox): trigger hidden <input type="file">
      hiddenFileInputRef.current?.click();
    } catch (e) {
      console.error("openFile error", e);
    }
  }, [supportsFSA, pickerTypes, inferLanguageFromName]);

  
  /** Fallback <input> -> read the selected file into the buffer */
  const onHiddenFilePicked = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;

      const reader = new FileReader();
      reader.onload = () => {
        _setCode(String(reader.result ?? "")); // direct set (not dirty—matches disk)
        setFileName(f.name);
        setIsDirty(false);
        inferLanguageFromName(f.name);
      };
      reader.readAsText(f);

      // reset input so selecting the same file later still triggers change
      e.target.value = "";
      // No FileSystemFileHandle available in this path
      fileHandleRef.current = null;
    },
    [inferLanguageFromName]
  );

  /** SAVE AS: prompt for a location/name, then write buffer there */
  const saveFileAs = useCallback(async () => {
    try {
      if (supportsFSA) {
        // @ts-expect-error: FS Access API
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName || `untitled${extFromLang(language)}`,
          types: pickerTypes,
        });
        await writeHandle(handle, code);
        fileHandleRef.current = handle;
        const f = await handle.getFile();
        setFileName(f.name);
        setIsDirty(false);
      } else {
        // Fallback: download the current buffer as a file
        downloadBlob(code, fileName || `untitled${extFromLang(language)}`);
        setIsDirty(false);
      }
    } catch (e) {
      console.error("saveFileAs error", e);
    }
  }, [supportsFSA, code, fileName, language, pickerTypes, writeHandle, downloadBlob, extFromLang]);

  /** SAVE: write to previously opened/saved file if we have a handle; otherwise Save As */
  const saveFile = useCallback(async () => {
    try {
      if (supportsFSA) {
        if (fileHandleRef.current) {
          await writeHandle(fileHandleRef.current, code);
          setIsDirty(false);
        } else {
          await saveFileAs();
        }
      } else {
        // Fallback has no persistent handle—download the file
        downloadBlob(code, fileName || `untitled${extFromLang(language)}`);
        setIsDirty(false);
      }
    } catch (e) {
      console.error("saveFile error", e);
    }
  }, [supportsFSA, code, fileName, language, writeHandle, saveFileAs, downloadBlob, extFromLang]);

  /** Props for the hidden input used in the fallback open path */
  const fileInputProps = useMemo(
    () => ({
      ref: hiddenFileInputRef,
      type: "file" as const,
      accept: [".py", ".ts", ".js", ".json", ".txt", ".html", ".css", ".md"].join(","),
      onChange: onHiddenFilePicked,
      className: "hidden",
    }),
    [onHiddenFilePicked]
  );
  
  return {
    code,
    setCode, // marks dirty
    isDirty,
    fileName,
    language,
    openFile,
    saveFile,
    saveFileAs,
    fileInputProps,
  };


}


