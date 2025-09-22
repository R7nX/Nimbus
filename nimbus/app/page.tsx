"use client"
import { useState } from "react";
import Editor from "@monaco-editor/react";
import Header from "@/components/header";
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

  );
}


// Check if the browser support Save/Load files
const supportsFileSystemAccess = useMemo(() => {
  return typeof window != "undefined" && "showOpenFilePicker" in window;
}, []);

// Map default file extension, Ex: if you are coding a python file -> the save file will automatically save it as something.py
const extFromLang = (lang: string) => {
  switch(lang){
    case "javascript":
    case "typescript":
      return ".ts";
    case "html";
      return ".html";
    case "json":
      return ".json";
    case "css":
      return ".css";
    case "python":
      return ".py";
    default:
      return ".py";
  }
}


const pickerTypes = useMemo(() => {
  return [
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
  ];
}, []);


async function saveFile(){

}


async function openFile(){

}

async function saveFileAs(){


}

async function writeHandle(handle: FileSystemFileHandle, contents: string){

}
