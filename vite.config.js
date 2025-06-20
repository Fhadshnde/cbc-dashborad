import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "https://hawkama.cbc-api.app/",
      "/uploads": "https://hawkama.cbc-api.app/", 
    },
  },
});