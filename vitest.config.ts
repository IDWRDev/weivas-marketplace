import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}},
  test:{dir:"src",environment:"jsdom",setupFiles:["./src/test/setup.ts"],clearMocks:true,globals:true},
});
