import type { UserConfig } from "npm:vite";

export default {
  build: {
    outDir: "_site",
    target: "esnext",
  },
} as UserConfig;
