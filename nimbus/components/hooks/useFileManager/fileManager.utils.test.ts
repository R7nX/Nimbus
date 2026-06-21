import { describe, expect, it } from "vitest";
import { inferLanguageFromName } from "./fileManager.utils";

describe("inferLanguageFromName", () => {
  it("returns python for Python files", () => {
    expect(inferLanguageFromName("main.py")).toBe("python");
  });

  it("matches Python file extensions case-insensitively", () => {
    expect(inferLanguageFromName("SCRIPT.PY")).toBe("python");
  });

  it("returns unknown for unsupported file extensions", () => {
    expect(inferLanguageFromName("README.md")).toBe("unknown");
  });
});
