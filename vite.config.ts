import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  test: {
    globals: true, // To work with react-testing-library
    environment: "jsdom", // To work with react-testing-library
    setupFiles: "./tests/setup.js",
    coverage: {
      include: ["src"],
      exclude: [
        "src-tauri/**",
        "**/index.ts",
        "**/tests",
        "**/_*",
        "src/app/providers",
        "src/app/routes",
      ],
    },
    // coverage: { enabled: true }, // shows coverage in vitest --ui, but slows running tests
  },
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
