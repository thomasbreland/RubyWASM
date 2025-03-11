import path from "path";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// allow base URL to be set by environment, e.g., during pipeline, for deploying to GitHub Pages subdirectory
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.GH_PAGES_BASE_URL : '/';

export default defineConfig({
  base: BASE_URL,
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    }
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        boot: path.resolve(__dirname, 'boot.html'),
      },
    },
  },
  plugins: [
    VitePWA({
      srcDir: ".",
      filename: "rails.sw.js",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        injectionPoint: null,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
