import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  const base = command === "build" ? "/vanilla-js-snake-canvas/" : "/";

  return {
    base,
    root: "./src",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    server: {
      hmr: false,
    },
  };
});
