//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/examples/minutes-zoom/index.html`);
  });

  it('should display weeks', async () => {
    await expect(page).toMatchElement('.gstc__chart-calendar-date-content--minute', {
      text: '00:15',
    });
  });
});
