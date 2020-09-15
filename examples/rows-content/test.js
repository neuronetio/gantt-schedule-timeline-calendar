//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/rows-content/index.html`);
  });

  fit('should display content inside grid cells', async () => {
    await expect(page).toMatchElement('.my-row-content', {
      text: 'ROW HTML HERE - CLICK ME',
    });
    await expect(page).toMatchElement('.my-row-content-column');
  });
});
