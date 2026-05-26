import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    allowedHosts: ["localhost", "links.prontofy.com.br", "www.links.prontofy.com.br"],
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/webhook": {
        target: "https://teste-n8n-editor.6esqeg.easypanel.host",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
