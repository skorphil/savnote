import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  {
    extends: ["plugin:react/jsx-runtime"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
