import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    base: isProd ? "/PortfolioSite/" : "/",

    plugins: [react()],

    build: {
      target: "es2018",
      sourcemap: false,
      minify: "esbuild",
      cssCodeSplit: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 800,

      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            motion: ["framer-motion"],
            headlessui: ["@headlessui/react"],
          },
        },
      },
    },

    esbuild: {
      // В проде убираем console.log / debugger
      drop: isProd ? ["console", "debugger"] : [],
    },
  };
});
