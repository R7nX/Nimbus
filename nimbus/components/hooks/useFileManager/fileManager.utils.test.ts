import { describe, expect, it } from "vitest";
import { inferLanguageFromName } from "./fileManager.utils";

describe("inferLanguageFromName", () => {
  /**
   * Maps a file name to the Monaco language id that should be used to edit it.
   * This is used whenever a file is opened or selected from the explorer.
   */
  it("returns python for Python files", () => {
    expect(inferLanguageFromName("main.py")).toBe("python");
  });

  it("matches file extensions case-insensitively", () => {
    expect(inferLanguageFromName("SCRIPT.PY")).toBe("python");
  });

  it("returns unknown for unsupported file extensions", () => {
    // .txt is not mapped to any language, so the editor falls back to plain text.
    expect(inferLanguageFromName("README.txt")).toBe("unknown");
  });
});
