import { useCallback } from "react";
import type { Language } from "./fileManager.type";


export function inferLanguageFromName(name: string) {
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    return "python";
};


export function downloadBlob(text: string, name: string){
    const blob = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
}