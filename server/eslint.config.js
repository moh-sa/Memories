// @ts-check
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import n from "eslint-plugin-n";

export default tseslint.config(
  { ignores: ["dist", "coverage", "**/*.config.{js,ts}", "seed/seed.json"] },
  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      n.configs["flat/recommended-module"],
    ],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "@stylistic": stylistic },
    rules: {
      ...stylistic.configs.customize({ indent: 2, quotes: "double", semi: true }).rules,
      // TypeScript resolves .js->.ts specifiers; eslint-plugin-n cannot:
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
      // Express accepts promise-returning handlers; only relax the void-return
      // check for function arguments (does not affect behavior).
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { arguments: false } }],
      // Numbers are safe to interpolate into template literals.
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    },
  },
  {
    // Test files assert on loosely-typed values (e.g. supertest response bodies).
    files: ["**/*.{test,spec}.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
