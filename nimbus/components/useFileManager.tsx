import { useCallback, useEffect, useMemo, useRef, useState } from "react";


export type FileManagerOptions = {
  initialCode? string;
  initialLanguage?:
    "python"
  | "typescript"
  | "javascript"
  | "json"
  | "html"
  | "css";
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
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  
}


