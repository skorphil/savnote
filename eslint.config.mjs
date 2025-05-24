import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked, // For stylistic rules
    ],
    rules: {
      "@typescript-eslint/no-confusing-void-expression": "error", // HERE i have it!
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-floating-promises": "error", // but removing void will fight with this rule!
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },

  // eslint.configs.recommended,
  // tseslint.configs.stylistic,
  // tseslint.configs.recommendedTypeChecked,
  // tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["*", "!src/", "!src/**/*", "tests/**/*", "**/*.test.js"],
  },
  {}
);
