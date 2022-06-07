import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1600,
  viewportHeight: 1000,
  video: true,
  videoUploadOnPasses: false,
  projectId: 'qdqmtw',
  env: {
    wait: 1,
    wait_load: 1,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // async setupNodeEvents(on, config) {
    //   return import('./cypress/plugins/index.js').then((fn) => {
    //     fn.default(on, config);
    //   });
    // },
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
