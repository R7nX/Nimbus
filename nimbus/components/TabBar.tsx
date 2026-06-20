export type OpenFileTab = {
  id: string;
  name: string;
  contents: string;
  isDirty: boolean;
  isPreview: boolean;
};

type TabBarProps = {
  files: OpenFileTab[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
};

// This is a simple tab bar component that displays open files and their dirty state.
// It also allows switching between files by clicking on the tabs.
export function TabBar({ files, activeFileId, onSelectFile }: TabBarProps) {
  return (
    <div className="flex overflow-x-auto border-b border-neutral-800 bg-neutral-900">
      {/* Map through the files and create a tab for each one */}
      {files.map((file) => {
        const isActive = file.id === activeFileId;

        return (
          <button
            key={file.id}
            type="button"
            onClick={() => onSelectFile(file.id)}
            className={[
              "h-10 shrink-0 px-4 text-sm border-r border-neutral-800",
              "flex items-center gap-1",
              isActive
                ? "bg-neutral-800 text-white border-b-2 border-b-blue-500"
                : "bg-neutral-900 text-neutral-400 hover:text-white",
            ].join(" ")}
          >
            <span>{file.name}</span>
            {file.isDirty ? <span>•</span> : null}
          </button>
        );
      })}
    </div>
  );
}