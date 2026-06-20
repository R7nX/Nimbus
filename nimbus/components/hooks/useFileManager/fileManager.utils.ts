import type { Language } from "./fileManager.language";


// Check the language based on the extension
export function inferLanguageFromName(name: string): Language {
  const lower = name.toLowerCase();

  if (lower.endsWith(".py")) return "python";
  else return "unknown";
}


export function downloadBlob(text: string, name: string){
    const blob = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
}
