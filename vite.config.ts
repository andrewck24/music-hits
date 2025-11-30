import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
          "chart-vendor": ["recharts"],
          "i18n-vendor": [
            "i18next",
            "i18next-browser-languagedetector",
            "i18next-http-backend",
            "react-i18next",
          ],
          "utility-vendor": ["zod", "fuse.js"],
        },
      },
    },
  },
});
