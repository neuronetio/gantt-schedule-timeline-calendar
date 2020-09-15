//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/tooltip/index.html`);
  });

  fit('should display slots', async () => {
    await expect(page).toMatchElement('.my-item');
  });
});
