/// <reference types="vitest/config" />

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],

    define: {
      global: "globalThis",
      "process.env": {},
    },

    optimizeDeps: {
      include: ["buffer", "process"],
    },

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./test/setup/testSetup.tsx"],
      include: ["./test/**/*.{test,spec}.{ts,tsx}"],
      coverage: {
        reporter: ["text", "json", "html"],
        exclude: ["node_modules/", "test/"],
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@test": path.resolve(__dirname, "test"),
        "@src": path.resolve(__dirname, "src"),

        buffer: "buffer",
        process: "process",
      },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },

    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});