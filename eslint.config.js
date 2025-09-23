import js from "@eslint/js";
import globals from "globals";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  {
    ignores: [
      ".svelte-kit/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "static/sw.js",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        parser: typescriptParser,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
  },
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
  },
];
