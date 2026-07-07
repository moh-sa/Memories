// @ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

export default tseslint.config(
  { ignores: ["build", "dist", "coverage", "**/*.config.{js,ts}"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactYouMightNotNeedAnEffect.configs.recommended,
      reactRefresh.configs.recommended,
    ],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: { "@stylistic": stylistic, "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // React accepts promise-returning handlers; relax the void-return check
      // for JSX attributes and function arguments (does not affect behavior).
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { arguments: false, attributes: false } }],
      // Numbers are safe to interpolate into template literals.
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      // TypeScript prop types make eslint-plugin-react's prop-types redundant.
      "react/prop-types": "off",
      ...stylistic.configs.customize({ indent: 2, quotes: "double", semi: true, jsx: true }).rules,
    },
  },
);
