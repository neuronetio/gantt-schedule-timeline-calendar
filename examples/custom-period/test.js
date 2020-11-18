//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/examples/custom-period/index.html`);
  });

  it('should display weeks', async () => {
    await expect(page).toMatchElement('.gstc__chart-calendar-date-content--week', {
      text: '27th to 9th, week 05 to 06',
    });
  });
});
