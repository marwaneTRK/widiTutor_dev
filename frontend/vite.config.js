import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@layouts": "/src/layouts",
      "@pages": "/src/pages",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000", // proxy to your Express backend
    },
  },
});
