import globals from "globals";
import vitest from "@vitest/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/wallaby.conf.js",
      "**/node_modules",
      "**/reports",
      "**/.aws-sam",
      "**/dist",
    ],
  },
  ...compat.extends(
    "prettier",
    "eslint:recommended",
    "plugin:prettier/recommended"
  ),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-console": 2,

      "padding-line-between-statements": [
        "error",
        {
          blankLine: "any",
          prev: "*",
          next: "*",
        },
      ],
    },
  },
  {
    files: ["src/**/*.test.js"],

    plugins: {
      vitest,
    },

    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },

    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];
