import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx", "src/components/*/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
