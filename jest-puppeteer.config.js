const headless = process.env.HEADLESS === '1' ? true : false;

module.exports = {
  launch: {
    dumpio: false,
    headless,
    defaultViewport: null,
    args: ['--start-maximized'],
    //devtools: !headless,
    //slowMo: headless ? 0 : 25,
  },
  server: {
    command: 'node examples/server.js',
    port: process.env.PORT || 8080,
  },
  browser: 'chromium',
  browserContext: 'default',
};
