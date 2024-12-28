import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // Here's the important part - add this
    strictPort: true,
    port: 5173, // You can specify the port
  },
});
