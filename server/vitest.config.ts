import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["**/*.ts"],
      exclude: [
        "**/*.d.ts",
        "**/*.config.ts",
        "seed/**",
        "index.ts",
        "app.ts",
        "types/**",
        "test/**",
        "**/*.{test,spec}.ts",
      ],
      thresholds: { lines: 60 },
    },
  },
});
