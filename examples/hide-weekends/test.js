//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/examples/hide-weekends/index.html`);
  });

  it('should not display weekends', async () => {
    await expect(page).not.toMatchElement('.gstc-date-small', { text: 'Sunday' });
  });
});
