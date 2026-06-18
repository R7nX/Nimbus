import { useState } from "react";

export type TreeNode = {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: TreeNode[];
};

type FileTreeProps = {
  nodes: TreeNode[];
  activePath?: string;
  onSelectFile: (node: TreeNode, path: string) => void;
};

type TreeNodeRowProps = {
  node: TreeNode;
  depth: number;
  path: string;
  activePath?: string;
  onSelectFile: (node: TreeNode, path: string) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
};

function TreeNodeRow({
  node,
  depth,
  path,
  activePath,
  onSelectFile,
  expandedFolders,
  onToggleFolder,
}: TreeNodeRowProps) {
  const isFolder = node.type === "folder";
  const isActive = path === activePath;
  const isExpanded = expandedFolders.has(path);
  const label = isFolder ? `[folder] ${node.name}` : `[file] ${node.name}`;

  return (
    <li>
      <button
        type="button"
        className={`flex w-full items-center rounded py-1 pr-2 text-left text-sm transition-colors ${
          isActive
            ? "bg-sky-900/50 text-sky-100"
            : "text-neutral-300 hover:bg-neutral-800/70 hover:text-neutral-100"
        } ${isFolder ? "font-semibold" : "font-normal"}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            onToggleFolder(path);
          } else {
            onSelectFile(node, path);
          }
        }}
        aria-expanded={isFolder ? isExpanded : undefined}
      >
        <span>{label}</span>
        {isFolder ? (
          <span className="ml-auto text-neutral-500" aria-hidden="true">
            {isExpanded ? "" : "↓"}
          </span>
        ) : null}
      </button>

      {isFolder && isExpanded && node.children?.length ? (
        <ul aria-label={`${path} contents`}>
          {node.children.map((child) => (
            <TreeNodeRow
              key={`${path}/${child.name}`}
              node={child}
              depth={depth + 1}
              path={`${path}/${child.name}`}
              activePath={activePath}
              onSelectFile={onSelectFile}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function getInitialExpandedFolders(nodes: TreeNode[], parentPath = ""): string[] {
  return nodes.flatMap((node) => {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;

    if (node.type !== "folder") {
      return [];
    }

    return [path, ...getInitialExpandedFolders(node.children ?? [], path)];
  });
}

export function FileTree({ nodes, activePath, onSelectFile }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState(
    () => new Set(getInitialExpandedFolders(nodes))
  );

  const handleToggleFolder = (path: string) => {
    setExpandedFolders((current) => {
      const next = new Set(current);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  };

  return (
    <nav aria-label="Project files">
      <ul className="space-y-0.5">
        {nodes.map((node) => (
          <TreeNodeRow
            key={node.name}
            node={node}
            depth={0}
            path={node.name}
            activePath={activePath}
            onSelectFile={onSelectFile}
            expandedFolders={expandedFolders}
            onToggleFolder={handleToggleFolder}
          />
        ))}
      </ul>
    </nav>
  );
}
