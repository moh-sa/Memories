/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: { port: 3000 },
  preview: { port: 3000 },
  build: { outDir: "build" },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/index.tsx",
        "src/setupTests.ts",
        "src/types/**",
        "src/test/**",
        "src/**/*.{test,spec}.{ts,tsx}",
      ],
      thresholds: { lines: 60 },
    },
  },
});
