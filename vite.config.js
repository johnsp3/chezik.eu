import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [sveltekit(), wasm()],
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    exclude: ["lucide-svelte"],
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["lucide-svelte"],
        },
      },
    },
  },
});
