import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileTree, type TreeNode } from "./FileTree";

/**
 * FileTree is the sidebar boundary for project navigation.
 * These tests protect its public behavior: nested rendering, folder toggling,
 * active-file styling, and file selection callbacks.
 */
const nodes: TreeNode[] = [
  {
    name: "app",
    type: "folder",
    children: [
      { name: "page.tsx", type: "file", content: "export default function Page() {}" },
      {
        name: "login",
        type: "folder",
        children: [{ name: "page.tsx", type: "file", content: "login page" }],
      },
    ],
  },
  { name: "package.json", type: "file", content: "{}" },
];

describe("FileTree", () => {
  it("renders folders and files with nested indentation", () => {
    render(<FileTree nodes={nodes} onSelectFile={vi.fn()} />);

    expect(screen.getByRole("navigation", { name: "Project files" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\[folder\] app/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /\[file\] page\.tsx/ })).toHaveLength(2);

    expect(screen.getByRole("button", { name: /\[folder\] app/ })).toHaveStyle({
      paddingLeft: "8px",
    });
    expect(screen.getByRole("button", { name: /\[folder\] login/ })).toHaveStyle({
      paddingLeft: "24px",
    });
  });

  it("collapses and expands folder contents when a folder is clicked", async () => {
    const user = userEvent.setup();

    render(<FileTree nodes={nodes} onSelectFile={vi.fn()} />);

    const appFolder = screen.getByRole("button", { name: /\[folder\] app/ });
    expect(appFolder).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /\[folder\] login/ })).toBeInTheDocument();

    // Verify both branches of the folder toggle: collapsed children are removed
    // from the tree, and expanding restores the same nested content.
    await user.click(appFolder);

    expect(appFolder).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: /\[folder\] login/ })).not.toBeInTheDocument();

    await user.click(appFolder);

    expect(appFolder).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /\[folder\] login/ })).toBeInTheDocument();
  });

  it("calls onSelectFile with the selected file node and path", async () => {
    const user = userEvent.setup();
    const onSelectFile = vi.fn();

    render(
      <FileTree
        nodes={nodes}
        activePath="package.json"
        onSelectFile={onSelectFile}
      />
    );

    await user.click(screen.getByRole("button", { name: /\[file\] package\.json/ }));

    expect(onSelectFile).toHaveBeenCalledWith(nodes[1], "package.json");
    expect(screen.getByRole("button", { name: /\[file\] package\.json/ })).toHaveClass(
      "bg-sky-900/50"
    );
  });
});
