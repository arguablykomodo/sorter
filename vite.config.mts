import type { UserConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

import "solid-js";

export default {
  plugins: [solidPlugin()],
  build: {
    outDir: "_site",
    target: "esnext",
  },
} as UserConfig;
