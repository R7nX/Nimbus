// components/FileToolbar.tsx
"use client";

export function FileToolbar({
  onNew,
  onOpen,
  onSave,
  onRemove,
}: {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onRemove: () => void;
}) {
  const Btn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      className="px-3 py-1.5 text-sm rounded-md border border-neutral-800 
                 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99]"
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800 bg-neutral-900/60">
      <Btn label="New File" onClick={onNew} />
      <Btn label="Open File" onClick={onOpen} />
      <Btn label="Save" onClick={onSave} />
      <Btn label="Remove File" onClick={onRemove} />
    </div>
  );
}
