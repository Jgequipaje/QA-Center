import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
const isLib = process.env.BUILD_MODE === "lib";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3333",
    },
  },
  build: isLib
    ? {
        // Library build — for consumers importing QACenter
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "QACenter",
          fileName: "index",
          formats: ["es"],
        },
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
          // Don't bundle React — consumers provide it
          external: ["react", "react-dom", "react/jsx-runtime"],
          output: {
            globals: { react: "React", "react-dom": "ReactDOM" },
          },
        },
      }
    : {
        // App build — for node bin/cli.js standalone mode
        outDir: "dist",
        emptyOutDir: true,
      },
});
