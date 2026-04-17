// Types for `useFileManager`.
//
// `FileManagerOptions`:
// - Initial values for the editor buffer + file context.
//
// `FileManagerAPI` (hook return):
// - State: current code, filename, language, dirty flag
// - Actions: open / save / save-as
// - Fallback DOM props: hidden <input type="file" /> for browsers without FS Access API

export type FileManagerOptions = {
    // Initial editor code (default: "") 
    initialCode?: string;

    // Initial language for Monaco ("unknown" = plain text)
    initialLanguage?: "python" | "unknown";

    //Initial filename shown in the UI (default: "untitled")
    initialName?: string;
}


export type FileManagerAPI = {
    //state 
    code: string; // editor buffer(code)
    setCode: (s: string) => void; // update buffer + marks dirty
    isDirty: boolean; // unsaved changes
    fileName: string; // current file name

    // python or unknown
    language: NonNullable<FileManagerOptions["initialLanguage"]>; 

    //actions
    openFile: () => Promise<void>;
    saveFile: () => Promise<void>;
    saveFileAs: () => Promise<void>;

    //DOM helpers for exception to backup in case your browser don't support File System Access API
    fileInputProps: {
        ref: React.RefObject<HTMLInputElement>;
        type: "file";
        accept: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        className: string;
    };
}

