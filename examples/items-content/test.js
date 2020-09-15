//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/items-content/index.html`);
  });

  fit('should display content inside items', async () => {
    await expect(page).toMatchElement('.my-item-content', {
      text: 'My HTML content here!',
    });
  });
});
