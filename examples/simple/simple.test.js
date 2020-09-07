//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

const dayjs = require('dayjs');

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/simple/simple.esm.html`);
  });

  fit('should display things', async () => {
    await expect(page).toMatchElement(
      '.gstc__list-column-header-resizer-container--gstcid-label',
      {
        text: 'Label',
      }
    );
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--gstcid-1-gstcid-label',
      {
        text: 'Row 1',
      }
    );
    // await expect(page).toMatchElement(
    //   '.gstc__chart-timeline-grid-row--gstcid-2'
    // );
    // await expect(page).toMatchElement('.gstc__chart-calendar-date--level-1');
    // await expect(page).toMatchElement('.gstc__scroll-bar--vertical');
    // await expect(page).toMatchElement('.gstc__scroll-bar--horizontal');
    // await expect(page).toMatchElement(
    //   '.gstc__chart-timeline-grid-row-cell.current'
    // );
  });

  it('should expand row', async () => {
    await expect(page).not.toMatchElement(
      '.gstc__list-column-row-content--2-label'
    );
    await page.click('.gstc__list-column-row-expander--1');
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--2-label',
      { text: 'row id: 2' }
    );
    await page.click('.gstc__list-column-row-expander--1');
    await expect(page).not.toMatchElement(
      '.gstc__list-column-row-content--2-label'
    );
  });

  it('should hide left side list', async () => {
    await page.click('.gstc__list-toggle');
    await expect(page).not.toMatchElement('.gstc__list');
    await page.click('.gstc__list-toggle');
    await expect(page).toMatchElement('.gstc__list');
  });

  it('should change chart height (inner)', async () => {
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--1-label'
    );
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--5-label'
    );
    await page.evaluate(() => {
      state.update('config.innerHeight', 100);
    });
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--1-label'
    );
    await expect(page).not.toMatchElement(
      '.gstc__list-column-row-content--5-label'
    );
    await page.evaluate(() => {
      state.update('config.innerHeight', 400);
    });
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--1-label'
    );
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--5-label'
    );
  });

  it('should scroll vertically with scrollbar', async () => {
    const { left, top } = await page.evaluate(() => {
      const { left, top } = document
        .querySelector('.gstc__scroll-bar-inner--vertical')
        .getBoundingClientRect();
      return { left, top };
    });
    const topRow1 = await page.evaluate(() =>
      state.get('$data.list.visibleRows.0')
    );
    expect(topRow1).toEqual('0');
    await page.mouse.move(left + 5, top + 5); // 5 because of rounded corners
    await page.mouse.down();
    await page.mouse.move(left + 5, top + 100);
    await page.mouse.up();
    const topRow2 = await page.evaluate(() =>
      state.get('$data.list.visibleRows.0')
    );
    expect(topRow2).toEqual('23');
  });

  it('should scroll horizontally with scrollbar', async () => {
    const { left, top } = await page.evaluate(() => {
      const { left, top } = document
        .querySelector('.gstc__scroll-bar-inner--horizontal')
        .getBoundingClientRect();
      return { left, top };
    });
    const time1 = await page.evaluate(() =>
      state.get('$data.chart.time.leftGlobal')
    );
    await page.mouse.move(left + 5, top + 5); // 5 because of rounded corners
    await page.mouse.down();
    await page.mouse.move(left + 5 + 100, top + 5);
    await page.mouse.up();
    const time2 = await page.evaluate(() =>
      state.get('$data.chart.time.leftGlobal')
    );
    expect(time2).not.toEqual(time1);
  });

  it('should scroll by api.scrollToTime', async () => {
    const time1 = await page.evaluate(() => {
      gstc.api.scrollToTime(gstc.api.time.date().valueOf(), false);
      return state.get('$data.chart.time.leftGlobal');
    });
    expect(dayjs(time1).format('YYYY-MM-DD')).toEqual(
      dayjs().format('YYYY-MM-DD')
    );
    const time2 = await page.evaluate(() => {
      gstc.api.scrollToTime(
        gstc.api.time.date().add(7, 'day').valueOf(),
        false
      );
      return state.get('$data.chart.time.leftGlobal');
    });
    expect(dayjs(time2).format('YYYY-MM-DD')).toEqual(
      dayjs().add(7, 'day').format('YYYY-MM-DD')
    );
  });

  it('should scroll to item (vertically & horizontally)', async () => {
    await page.evaluate(() => {
      const item = state.get('config.chart.items.1');
      gstc.api.setScrollTop(0);
      gstc.api.scrollToTime(
        gstc.api.time.date(item.time.start).valueOf(),
        false
      );
    });
    await expect(page).toMatchElement(
      '.gstc__chart-timeline-items-row-item-label--1-1',
      {
        text: 'item id 1',
      }
    );
  });

  it('should resize column', async () => {
    const { left, top } = await page.evaluate(() => {
      const { left, top } = document
        .querySelector('.gstc__list-column-header-resizer-dots--label')
        .getBoundingClientRect();
      return { left, top };
    });
    const width1 = await page.evaluate(() =>
      state.get('config.list.columns.data.label.width')
    );
    await page.mouse.move(left + 2, top + 5);
    await page.mouse.down();
    await page.mouse.move(left + 102, top + 5);
    await page.mouse.up();
    const width2 = await page.evaluate(() =>
      state.get('config.list.columns.data.label.width')
    );
    expect(width2).toEqual(width1 + 100);
  });
});
