import DeepState from 'deep-state-observer';
import { GSTCResult, Item, ItemData } from '../../dist/gstc';

describe('Calculated zoom mode', () => {
  it('should change calculatedZoomMode', () => {
    let state: DeepState, gstc, initialFrom, initialTo, from, to;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        initialFrom = state.get('config.chart.time.from');
        initialTo = state.get('config.chart.time.to');
        from = gstc.api.time.date().startOf('month').valueOf();
        to = gstc.api.time.date().endOf('month').valueOf();
        const startDate = gstc.api.time.date('2020-02-01');
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = true;
          time.from = startDate.startOf('month').valueOf();
          time.to = startDate.endOf('month').valueOf();
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        expect(state.get('config.chart.time.from')).to.eq(initialFrom);
        expect(state.get('$data.chart.time.fromDate').valueOf()).to.eq(initialFrom);
        expect(state.get('config.chart.time.to')).to.be.lessThan(initialTo);
        expect(state.get('$data.chart.time.toDate').valueOf()).to.be.lessThan(initialTo);
        expect(state.get('config.chart.time.calculatedZoomMode')).to.eq(true);
      })
      .get('.gstc__scroll-bar--horizontal')
      .should('not.exist')
      .log(`updating from to`)
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.from = initialFrom;
          time.to = initialTo;
          time.calculatedZoomMode = false;
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        expect(state.get('config.chart.time.from')).to.eq(initialFrom);
        expect(state.get('$data.chart.time.fromDate').valueOf()).to.eq(initialFrom);
        expect(state.get('config.chart.time.to')).to.be.eq(initialTo);
        expect(state.get('$data.chart.time.toDate').valueOf()).to.eq(initialTo);
        expect(state.get('config.chart.time.calculatedZoomMode')).to.eq(false);
      })
      .get('.gstc__scroll-bar--horizontal')
      .should('exist')
      .get('.gstc__chart-timeline-items-row-item')
      .should('exist')
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.from = from;
          time.to = to;
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__chart-timeline-items-row-item')
      .should('not.exist')
      .then(() => {
        expect(state.get('config.chart.time.from')).to.eq(from);
        expect(state.get('$data.chart.time.fromDate').valueOf()).to.eq(from);
        expect(state.get('config.chart.time.to')).to.be.eq(to);
        expect(state.get('$data.chart.time.toDate').valueOf()).to.eq(to);
        expect(state.get('config.chart.time.calculatedZoomMode')).to.eq(false);
      });
  });

  it('should move items one cell at time after calculatedZoomMode change', () => {
    const itemId = 'gstcid-15';
    const itemClass = `.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`;
    let state: DeepState, gstc: GSTCResult;
    cy.load('/examples/complex-1')
      .scrollH(10)
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        const startDate = gstc.api.time.date('2020-02-01');
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = true;
          time.from = startDate.startOf('month').valueOf();
          time.to = startDate.endOf('month').valueOf();
          return time;
        });
        state.update(`config.chart.items.${itemId}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-05').valueOf();
          item.time.end = gstc.api.time.date('2020-02-07').endOf('day').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .move(itemClass, 40, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        const item: Item = state.get(`config.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-06 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-08 23:59:59');
        expect(item.time.start).to.eq(itemData.time.startDate.valueOf());
        expect(item.time.end).to.eq(itemData.time.endDate.valueOf());
      });
  });

  it('should resize items one cell at time after calculatedZoomMode change', () => {
    const itemId = 'gstcid-15';
    const itemClass = `.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`;
    const itemLeftResizingHandleClass = `.gstc__chart-timeline-items-row-item-resizing-handle--left[data-gstcid="${itemId}"]`;
    const itemRightResizingHandleClass = `.gstc__chart-timeline-items-row-item-resizing-handle--right[data-gstcid="${itemId}"]`;
    let state: DeepState, gstc: GSTCResult;
    cy.load('/examples/complex-1')
      .scrollH(10)
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        const startDate = gstc.api.time.date('2020-02-01');
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = true;
          time.from = startDate.startOf('month').valueOf();
          time.to = startDate.endOf('month').valueOf();
          return time;
        });
        state.update(`config.chart.items.${itemId}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-05').valueOf();
          item.time.end = gstc.api.time.date('2020-02-07').endOf('day').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .get(itemClass)
      .click()
      .wait(Cypress.env('wait'))
      .move(itemRightResizingHandleClass, 40, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        const item: Item = state.get(`config.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-05 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-08 23:59:59');
        expect(item.time.start).to.eq(itemData.time.startDate.valueOf());
        expect(item.time.end).to.eq(itemData.time.endDate.valueOf());
      })
      .move(itemLeftResizingHandleClass, -40, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        const item: Item = state.get(`config.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-04 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-08 23:59:59');
        expect(item.time.start).to.eq(itemData.time.startDate.valueOf());
        expect(item.time.end).to.eq(itemData.time.endDate.valueOf());
      });
  });
});
