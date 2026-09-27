// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jackrose.co.nz",
  trailingSlash: "never",
  build: { format: "directory" },
});
