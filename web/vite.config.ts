import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_TARGET = "http://localhost:8080";
const API_PATH = "/api";
const WS_PATH = "/ws";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    strictPort: true,
    proxy: {
      [API_PATH]: API_TARGET,
      [WS_PATH]: { target: API_TARGET, ws: true },
    },
  },
});
