import { DataChartTime, DataScrollHorizontal } from '../../dist/gstc';

describe('Move items', () => {
  function moveRandomItem() {
    const randomNumber = Math.floor(Math.random() * 10) + 10;
    const randomId = 'gstcid-' + randomNumber;
    const randomItemEl = `.gstc__chart-timeline-items-row-item[data-gstcid="${randomId}"]`;

    return it('should move item from cell to cell', () => {
      let state, gstc, itemInitialDate;
      cy.load('/examples/item-slot-html-content')
        .window()
        .then((win) => {
          // @ts-ignore
          state = win.state;
          // @ts-ignore
          gstc = win.gstc;
        })
        .get(randomItemEl)
        .click()
        .wait(Cypress.env('wait'))
        .should('be.visible')
        .then(() => {
          const startDate = state.get(`$data.chart.items.${randomId}.time.startDate`);
          itemInitialDate = startDate.format('YYYY-MM-DD');
        })
        .log(`Initial date: ${itemInitialDate}`)
        .move(randomItemEl, -100, 0)
        .then(() => {});
    });
  }
  moveRandomItem();
});
