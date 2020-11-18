//@ts-nocheck
/* eslint no-undef: off */
const port = process.env.PORT || 8080;

describe('add-rows-items', () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:${port}/examples/add-rows-items/index.html`
    );
  });

  it('should display first rows and items', async () => {
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--gstcid-4-gstcid-label',
      {
        text: 'Row 4',
      }
    );
    await page.evaluate(function () {
      const item = gstc.state.get(`config.chart.items.${gstc.api.GSTCID('4')}`);
      gstc.api.scrollToTime(item.time.start, false);
    });
    await expect(page).toMatchElement(
      '.gstc__chart-timeline-items-row-item-label--gstcid-4-gstcid-4',
      {
        text: 'item id 4',
      }
    );
  });

  it('should add next rows', async () => {
    await page.evaluate(function () {
      setNewRows();
      setNewItems();
    });
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--gstcid-104-gstcid-label',
      {
        text: 'Row 104',
      }
    );
    await page.evaluate(function () {
      const item = gstc.state.get(
        `config.chart.items.${gstc.api.GSTCID('104')}`
      );
      gstc.api.scrollToTime(item.time.start, false);
    });
    await expect(page).toMatchElement(
      '.gstc__chart-timeline-items-row-item-label--gstcid-104-gstcid-104',
      {
        text: 'item id 104',
      }
    );
  });

  it('should add one row and one item', async () => {
    await page.evaluate(function () {
      addNewRow();
      addNewItem();
    });
    await expect(page).toMatchElement(
      '.gstc__list-column-row-content--gstcid-101-gstcid-label',
      {
        text: 'Row 101',
      }
    );
    await page.evaluate(function () {
      const item = gstc.state.get(
        `config.chart.items.${gstc.api.GSTCID('101')}`
      );
      gstc.api.scrollToTime(item.time.start, false);
    });
    await expect(page).toMatchElement(
      '.gstc__chart-timeline-items-row-item-label--gstcid-101-gstcid-101',
      {
        text: 'item id 101',
      }
    );
  });
});
