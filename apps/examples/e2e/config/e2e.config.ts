const config: Cypress.ConfigOptions = {
  e2e: {
    setupNodeEvents(on: any, config: any) {
      // implement node event listeners here
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
    specPattern: "cypress/integration/**/*.spec.{js,jsx,ts,tsx}",
    screenshotsFolder: "cypress/screenshots/e2e",
    videosFolder: "cypress/videos/e2e",
    reporterOptions: {
      mochaFile: "cypress/results/e2e/result-[hash].xml",
    },
    env: {
      tag: "e2e",
    },
    baseUrl: "http://localhost:3000",
  },
};

export default config;
