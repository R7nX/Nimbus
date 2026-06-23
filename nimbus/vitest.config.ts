import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Keep test imports aligned with the app's Next.js path alias.
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    // Use a browser-like DOM so React component tests can render and handle user events.
    environment: "jsdom",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
