import React, { useCallback, useState, useRef, useMemo, useEffect } from "react";
import type { Language, FileManagerAPI, FileManagerOptions, VirtualFile } from "./fileManager.type";
import { PICKER_TYPES, PLAIN_TEXT_EXTS, defaultExt } from "./fileManager.const";
import { inferLanguageFromName, downloadBlob } from "./fileManager.utils";

type FilePickerWindow = Window &
    typeof globalThis & {
        showOpenFilePicker: (options: {
            types: typeof PICKER_TYPES;
            excludeAcceptAllOptions: boolean;
            multiple: false;
        }) => Promise<FileSystemFileHandle[]>;
        showSaveFilePicker: (options: {
            suggestedName: string;
            types: typeof PICKER_TYPES;
        }) => Promise<FileSystemFileHandle>;
    };


export function useFileManager(opts: FileManagerOptions = {}): FileManagerAPI {
    // DELETE LATER! Create temp python file at start
    const {
        initialCode = "def helloWorld():\n  return 'Hello World'\n",
        initialLanguage = "python",
        initialName = "temp.py",
    } = opts;

    const [code, _setCode] = useState<string>(initialCode);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>(initialName);
    const [language, setLanguage] = useState<Language>(initialLanguage)

    /** Handle to the file picked via FS Access API; null = fallback or unsaved buffer */
    const fileHandleRef = useRef<FileSystemFileHandle | null>(null); 
    /** Hidden input for non-Chromium fallback open */
    const hiddenFileInputRef = useRef<HTMLInputElement>(null!);

    const supportFSA = useMemo(
        () => typeof window != "undefined" && "showOpenFilePicker" in window,
    []);

    // save code
    const setCode = useCallback((s:string) => {
        _setCode(s);
        setIsDirty(true);
    }, []);

    const writeHandle = useCallback(
        async (handle: FileSystemFileHandle, contents: string) => {
            // @ts-expect-error: FS Access API types may not be in TS lib
            const perm = await handle.requestPermission?.({mode: "readwrite"});

            if (perm === "denied") throw new Error("Permission to write was denied");
            const writable = await handle.createWritable();
            await writable.write(contents);
            await writable.close();
        }, []
    );

    const openFile = useCallback(
        async () => {
            try{
                if (supportFSA) {
                    const pickerWindow = window as FilePickerWindow;
                    const [handle] = await pickerWindow.showOpenFilePicker({
                        types: PICKER_TYPES,
                        excludeAcceptAllOptions: false,
                        multiple: false,
                    });
                    const file = await handle.getFile();
                    const text = await file.text();

                    fileHandleRef.current = handle; // Remember where we open the file from
                    setFileName(file.name);
                    _setCode(text);
                    setIsDirty(false);
                    setLanguage(inferLanguageFromName(file.name));
                    return;
                }

                // Fallback path (Safari/Firefox): trigger hidden <input type="file">
                hiddenFileInputRef.current?.click();
            } catch (e) {
                console.error("openFile error", e);
            }
        }, [supportFSA]
    );



    const onHiddenFilePicked = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (!f) return;

            const reader = new FileReader();
            reader.onload = () => {
                _setCode(String(reader.result ?? ""));
                setFileName(f.name);
                setIsDirty(false);
                setLanguage(inferLanguageFromName(f.name));
            };
            reader.readAsText(f);

            e.target.value = "";
            fileHandleRef.current = null;
        }, []
    );

    const openVirtualFile = useCallback((file: VirtualFile) => {
        fileHandleRef.current = null;
        setFileName(file.name);
        setLanguage(inferLanguageFromName(file.name));
        _setCode(file.contents);
        setIsDirty(false);
    }, []);

    const saveFileAs = useCallback(async () => {
    try {
      if (supportFSA) {
        const pickerWindow = window as FilePickerWindow;
        const handle = await pickerWindow.showSaveFilePicker({
          suggestedName: fileName || `untitled${defaultExt(language)}`,
          types: PICKER_TYPES,
        });
        await writeHandle(handle, code);
        fileHandleRef.current = handle;
        const f = await handle.getFile();
        setFileName(f.name);
        setIsDirty(false);
      } else {
        downloadBlob(code, fileName || `untitled${defaultExt(language)}`);
        setIsDirty(false);
      }
    } catch (e) {
      console.error("saveFileAs error", e);
    }
    }, [supportFSA, code, fileName, language, writeHandle]);

    const saveFile = useCallback(async () => {
    try {
      if (supportFSA) {
        if (fileHandleRef.current) {
          await writeHandle(fileHandleRef.current, code);
          setIsDirty(false);
        } else {
          await saveFileAs();
        }
      } else {
        downloadBlob(code, fileName || `untitled${defaultExt(language)}`);
        setIsDirty(false);
        }
        } catch (e) {
        console.error("saveFile error", e);
        }
    }, [supportFSA, code, fileName, language, saveFileAs, writeHandle]);

    // Warn on navigation if there are unsaved changes
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
        if (!isDirty) return;
        e.preventDefault();
        e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const fileInputProps = useMemo(
    () => ({
      ref: hiddenFileInputRef,
      type: "file" as const,
      accept: PLAIN_TEXT_EXTS.join(","),
      onChange: onHiddenFilePicked,
      className: "hidden",
    }),
        [onHiddenFilePicked]
    );

    return {
        code, 
        setCode,
        isDirty,
        fileName,
        language,
        openFile,
        openVirtualFile,
        saveFile,
        saveFileAs,
        fileInputProps,
    };
}
