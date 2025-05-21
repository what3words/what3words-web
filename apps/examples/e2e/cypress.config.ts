import { defineConfig } from "cypress";

import { e2eConfig } from "./config";

export default defineConfig({
  chromeWebSecurity: false,
  reporter: "junit",
  ...e2eConfig,
});
