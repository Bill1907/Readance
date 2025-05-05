import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // React 컴포넌트를 사용하는 페이지들
        popup: resolve(__dirname, "popup.html"),
        options: resolve(__dirname, "options.html"),
        sidepanel: resolve(__dirname, "sidepanel.html"),

        // 백그라운드와 콘텐츠 스크립트
        background: resolve(__dirname, "src/background.ts"),
        content: resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "background" || chunkInfo.name === "content"
            ? "[name].js" // background.js, content.js
            : "assets/[name]-[hash].js"; // React 컴포넌트용 청크는 assets 폴더에
        },
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
