//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/plugin-item-image/index.html`);
  });

  it('should display image inside item', async () => {
    await expect(page).toMatchElement('.item-image');
  });
});
