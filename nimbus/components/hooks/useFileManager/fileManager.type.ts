export type Language = "python" | "javascript" | "typescript" | "json" | "html" | "css";


export type FileManagerOptions = {
    initialCode?: string;
    initialLanguage?: "python" | "javascript" | "typescript" | "json" | "html" | "css";
    initialName?: string;
}

export type FileManagerAPI = {
    //state 
    code: string;
    setCode: (s: string) => void;
    isDirty: boolean;
    fileName: string;
    language: NonNullable<FileManagerOptions["initialLanguage"]>;

    //actions
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
}

