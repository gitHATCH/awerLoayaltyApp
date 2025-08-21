// tsup.config.ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/main/main.ts", "src/main/preload.ts"],
  format: ["cjs"],
  target: "node18",
  outDir: "dist/main",
  external: ["electron"],   // <-- clave
  sourcemap: false,
  clean: true,
  dts: false,
  watch: process.env.WATCH === "true"
})
