import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.js"],
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.js"],
      exclude: [
        "src/assets/**",
        "src/app/**/fields.js",
        "src/app/**/steps.js",
        "src/app/**/index.js",
        "src/app.js",
        "src/**/*.test.js",
      ],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
      reportsDirectory: "reports/coverage",
      reporter: ["lcov", "text-summary"],
    },
  },
});
