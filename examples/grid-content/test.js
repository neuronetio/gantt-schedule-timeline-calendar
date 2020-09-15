//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/grid-content/index.html`);
  });

  fit('should display content inside grid cells', async () => {
    await expect(page).toMatchElement('.my-grid-cell', { text: '!' });
    await expect(page).toMatchElement('.my-grid-cell-wrapper');
  });
});
