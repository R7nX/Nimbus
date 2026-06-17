import { describe, expect, it } from "vitest";
import { inferLanguageFromName } from "./fileManager.utils";

describe("inferLanguageFromName", () => {
  it.each([
    ["main.js", "javascript"],
    ["component.ts", "typescript"],
    ["settings.json", "json"],
    ["index.html", "html"],
    ["styles.css", "css"],
    ["script.py", "python"],
    ["README.md", "python"],
  ] as const)("infers %s as %s", (fileName, language) => {
    expect(inferLanguageFromName(fileName)).toBe(language);
  });
});
