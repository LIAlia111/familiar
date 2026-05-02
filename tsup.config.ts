import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "cli/index": "src/cli/index.ts",
    "statusline/render": "src/statusline/render.ts",
  },
  format: ["esm"],
  target: "node18",
  clean: true,
  shims: true,
  banner: { js: "#!/usr/bin/env node" },
});
