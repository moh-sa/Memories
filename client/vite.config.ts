/// <reference types="vitest/config" />
import type { IncomingMessage } from "node:http";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

function spaBypass(req: IncomingMessage) {
  if (req.headers.accept?.includes("text/html")) {
    return "/index.html";
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_URL || "http://localhost:5000";

  const proxyConfig = {
    target: apiTarget,
    changeOrigin: true,
    bypass: spaBypass,
  };

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 3000,
      proxy: {
        "/auth": proxyConfig,
        "/user": proxyConfig,
        "/memory": proxyConfig,
        "/comment": proxyConfig,
        "/search": proxyConfig,
        "/recommendations": proxyConfig,
      },
    },
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
  };
});
