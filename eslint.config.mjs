import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { files: ["src/**/*.{ts,tsx}"] },
  eslint.configs.recommended,
  tseslint.configs.stylistic,
  tseslint.configs.recommendedTypeChecked,
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
    ignores: [
      "tailwind.config.js",
      "eslint.config.mjs",
      "vite.config.ts",
      "tests/**/*",
      "**/*.test.js",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  }
);
