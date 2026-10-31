import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/core/**/*.test.ts", "tests/themes/**/*.test.ts", "tests/integration/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/core/**", "src/services/**"],
      reporter: ["text", "html"],
    },
  },
});
