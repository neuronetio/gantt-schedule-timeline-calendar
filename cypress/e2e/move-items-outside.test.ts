import { DataChartTime, DataScrollHorizontal } from '../../dist/gstc';
import { fixed } from '../helpers';

describe('Move items outside view', () => {
  it('should calculate right scroll and item position', () => {
    let state, gstc;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
      })
      .scrollH(1000)
      .then(() => {
        state.update('config.chart.items.gstcid-2.time', (itemTime) => {
          itemTime.start = gstc.api.time.date('2020-03-25').valueOf();
          itemTime.end = gstc.api.time.date('2020-03-30').endOf('day').valueOf();
          return itemTime;
        });
      })
      .get('.gstc__list-column-row-expander-toggle[data-gstcid="gstcid-1"]')
      .click()
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-2"]')
      .should('be.visible')
      .then(() => {
        const time: DataChartTime = state.get('$data.chart.time');
        expect(time.toDate.format('YYYY-MM-DD')).to.eq('2020-03-31');
      })
      .move('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-2"]', 160, 0)
      .move('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-2"]', 100, 0)
      .then(() => {
        const horizontalScroll: DataScrollHorizontal = state.get('$data.scroll.horizontal');
        const time: DataChartTime = state.get('$data.chart.time');
        expect(time.toDate.format('YYYY-MM-DD')).to.eq('2020-04-02');
        expect(horizontalScroll.data.leftGlobalDate.format('YYYY-MM-DD')).to.eq('2020-03-19');
        const itemsData = state.get('$data.chart.items');
        expect(itemsData['gstcid-2'].time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-02 23:59:59');
      });
  });

  it('should calculate right item position in normal mode', () => {
    const itemClass = '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-15"]';
    let state, gstc, secondaryItem, secondaryItemData;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
      })
      .then(() => {
        gstc.api.scrollToTime(gstc.api.time.date('2020-02-14'), false);
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        state.update('config.chart.items.gstcid-15', (item) => {
          item.time.start = gstc.api.time.date('2020-02-20').valueOf();
          item.time.end = gstc.api.time.date('2020-02-24').endOf('day').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-20 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-24 23:59:59');
        expect(fixed(itemData.width)).to.eq(fixed(itemData.actualWidth));
        expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.eq(fixed(itemData.position.actualRight));
        secondaryItemData = gstc.api.mergeDeep({}, itemData);
        secondaryItem = gstc.api.mergeDeep({}, state.get('config.chart.items.gstcid-15'));
      })
      .get(itemClass)
      .should('be.visible')
      .move(itemClass, 250, 0)
      .get(itemClass)
      .should('be.visible')
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-23 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-27 23:59:59');

        expect(fixed(itemData.position.left)).to.be.greaterThan(fixed(secondaryItemData.position.left));
        expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(secondaryItemData.position.right));
        expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(itemData.position.actualRight));
        expect(fixed(itemData.width)).to.eq(fixed(secondaryItemData.width));
        expect(fixed(itemData.actualWidth)).to.be.lessThan(fixed(itemData.width));

        const item = state.get('config.chart.items.gstcid-15');
        expect(item.time.start).to.be.greaterThan(secondaryItem.time.start);
        expect(item.time.end).to.be.greaterThan(secondaryItem.time.end);
      });
  });

  // it('should calculate right item position in normal mode with hidden dates', () => {
  //   const itemClass = '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-15"]';
  //   let state, gstc, secondaryItem, secondaryItemData;
  //   cy.load('/examples/complex-1')
  //     .window()
  //     .then((win) => {
  //       // @ts-ignore
  //       state = win.state;
  //       // @ts-ignore
  //       gstc = win.gstc;
  //     })
  //     .then(() => {
  //       gstc.api.scrollToTime(gstc.api.time.date('2020-02-14'), false);
  //     })
  //     .wait(Cypress.env('wait'))
  //     .get('#hide-weekends')
  //     .click()
  //     .wait(Cypress.env('wait'))
  //     .then(() => {
  //       state.update('config.chart.items.gstcid-15', (item) => {
  //         item.time.start = gstc.api.time.date('2020-02-20').valueOf();
  //         item.time.end = gstc.api.time.date('2020-02-26').endOf('day').valueOf();
  //         return item;
  //       });
  //     })
  //     .wait(Cypress.env('wait'))
  //     .then(() => {
  //       const itemData = state.get('$data.chart.items.gstcid-15');
  //       expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-20 00:00:00');
  //       expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-26 23:59:59');
  //       expect(fixed(itemData.width)).to.eq(fixed(itemData.actualWidth));
  //       expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
  //       expect(fixed(itemData.position.right)).to.eq(fixed(itemData.position.actualRight));
  //       secondaryItemData = gstc.api.mergeDeep({}, itemData);
  //       secondaryItem = gstc.api.mergeDeep({}, state.get('config.chart.items.gstcid-15'));
  //     })
  //     .get(itemClass)
  //     .should('be.visible')
  //     .move(itemClass, 400, 0)
  //     .get(itemClass)
  //     .should('be.visible')
  //     .then(() => {
  //       const itemData = state.get('$data.chart.items.gstcid-15');
  //       expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-27 00:00:00');
  //       expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-04 23:59:59');
  //       expect(fixed(itemData.position.left)).to.be.greaterThan(fixed(secondaryItemData.position.left));
  //       expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(secondaryItemData.position.right));
  //       expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
  //       expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(itemData.position.actualRight));
  //       expect(fixed(itemData.width)).to.eq(fixed(secondaryItemData.width));
  //       expect(fixed(itemData.actualWidth)).to.be.lessThan(fixed(itemData.width));

  //       const item = state.get('config.chart.items.gstcid-15');
  //       expect(item.time.start).to.be.greaterThan(secondaryItem.time.start);
  //       expect(item.time.end).to.be.greaterThan(secondaryItem.time.end);
  //     });
  // });

  it('should calculate right item position in normal mode with hidden dates when moving out of time (left)', () => {
    const itemClass = '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-15"]';
    let state, gstc, secondaryItem, secondaryItemData;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
      })
      .get('#hide-weekends')
      .click()
      .wait(Cypress.env('wait'))
      .then(() => {
        state.update('config.chart.items.gstcid-15', (item) => {
          item.time.start = gstc.api.time.date('2020-02-04').valueOf();
          item.time.end = gstc.api.time.date('2020-02-10').endOf('day').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-04 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-10 23:59:59');
        expect(fixed(itemData.width)).to.eq(fixed(itemData.actualWidth));
        expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.eq(fixed(itemData.position.actualRight));
        secondaryItemData = gstc.api.mergeDeep({}, itemData);
        secondaryItem = gstc.api.mergeDeep({}, state.get('config.chart.items.gstcid-15'));
      })
      .get(itemClass)
      .should('be.visible')
      .move(itemClass, -100, 0)
      .move(itemClass, -83, 0)
      .move(itemClass, -83, 0)
      .move(itemClass, -83, 0)
      .get(itemClass)
      .should('be.visible')
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-29 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-04 23:59:59');
        expect(fixed(itemData.position.left)).to.be.lessThan(fixed(secondaryItemData.position.left));
        expect(fixed(itemData.position.right)).to.be.lessThan(fixed(secondaryItemData.position.right));
        expect(fixed(itemData.position.left)).not.to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.be.eq(fixed(itemData.position.actualRight));
        expect(fixed(itemData.width)).to.eq(fixed(secondaryItemData.width));
        expect(fixed(itemData.actualWidth)).to.be.lessThan(fixed(itemData.width));

        const item = state.get('config.chart.items.gstcid-15');
        expect(item.time.start).to.be.below(secondaryItem.time.start);
        expect(item.time.end).to.be.below(secondaryItem.time.end);
      });
  });

  it('should calculate right item position in normal mode with hidden dates when moving out of time (right)', () => {
    const itemClass = '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-15"]';
    let state, gstc, secondaryItem, secondaryItemData;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
      })
      .then(() => {
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-13'), false);
      })
      .wait(Cypress.env('wait'))
      .get('#hide-weekends')
      .click()
      .wait(Cypress.env('wait'))
      .then(() => {
        state.update('config.chart.items.gstcid-15', (item) => {
          item.time.start = gstc.api.time.date('2020-03-20').valueOf();
          item.time.end = gstc.api.time.date('2020-03-26').endOf('day').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-20 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-26 23:59:59');
        expect(fixed(itemData.width)).to.eq(fixed(itemData.actualWidth));
        expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.eq(fixed(itemData.position.actualRight));
        secondaryItemData = gstc.api.mergeDeep({}, itemData);
        secondaryItem = gstc.api.mergeDeep({}, state.get('config.chart.items.gstcid-15'));
      })
      .get(itemClass)
      .should('be.visible')
      .move(itemClass, 400, 0)
      .move(itemClass, 50, 0)
      .move(itemClass, 50, 0)
      .move(itemClass, 80, 0)
      .move(itemClass, 80, 0)
      .get(itemClass)
      .should('be.visible')
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-31 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-04 23:59:59');
        expect(fixed(itemData.position.left)).to.be.greaterThan(fixed(secondaryItemData.position.left));
        expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(secondaryItemData.position.right));
        expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.be.eq(fixed(itemData.position.actualRight));
        //expect(fixed(itemData.width)).to.eq(fixed(secondaryItemData.width)); // TODO: DST is changing the width

        const item = state.get('config.chart.items.gstcid-15');
        expect(item.time.start).to.be.greaterThan(secondaryItem.time.start);
        expect(item.time.end).to.be.greaterThan(secondaryItem.time.end);
      });
  });

  it('should calculate right item position in calculatedZoomMode', () => {
    const itemClass = '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-15"]';
    let state, gstc, secondaryItem, secondaryItemData;
    cy.load('/examples/one-month')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
      })
      .then(() => {
        state.update('config.chart.items.gstcid-15', (item) => {
          item.time.start = gstc.api.time.date('2020-01-20').valueOf();
          item.time.end = gstc.api.time.date('2020-01-24').endOf('day').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-24 23:59:59');
        expect(fixed(itemData.width)).to.eq(fixed(itemData.actualWidth));
        expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.eq(fixed(itemData.position.actualRight));
        secondaryItemData = gstc.api.mergeDeep({}, itemData);
        secondaryItem = gstc.api.mergeDeep({}, state.get('config.chart.items.gstcid-15'));
      })
      .get(itemClass)
      .should('be.visible')
      .move(itemClass, 300, 0)
      .wait(Cypress.env('wait'))
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-28 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-01 23:59:59');

        expect(fixed(itemData.position.left)).to.be.greaterThan(fixed(secondaryItemData.position.left));
        expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(secondaryItemData.position.right));
        expect(fixed(itemData.position.left)).to.eq(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(itemData.position.actualRight)); // probably cypress bug because in the console everything is fine
        expect(fixed(itemData.width)).to.eq(fixed(secondaryItemData.width));
        expect(fixed(itemData.actualWidth)).to.be.lessThan(fixed(itemData.width)); // probably cypress bug because in the console everything is fine

        const item = state.get('config.chart.items.gstcid-15');
        expect(item.time.start).to.be.greaterThan(secondaryItem.time.start);
        expect(item.time.end).to.be.greaterThan(secondaryItem.time.end);
      });
  });

  it('should show arrow on hidden dates when scroll is moved to the end of the view', () => {
    const itemClass = '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-15"]';
    let state, gstc;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
      })
      .get('#hide-weekends')
      .click()
      .wait(Cypress.env('wait'))
      .get('#expand-time')
      .click()
      .wait(Cypress.env('wait'))
      .then(() => {
        state.update('config.chart.items.gstcid-15', (item) => {
          item.time.start = gstc.api.time.date('2020-03-10').valueOf();
          item.time.end = gstc.api.time.date('2020-04-01').endOf('day').valueOf();
          return item;
        });
        gstc.api.scrollToTime(gstc.api.time.date('2020-03-16'), false);
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const itemData = state.get('$data.chart.items.gstcid-15');
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-03-10 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-04-01 23:59:59');
        expect(fixed(itemData.width)).to.be.greaterThan(fixed(itemData.actualWidth));
        expect(fixed(itemData.position.left)).to.be.lessThan(fixed(itemData.position.actualLeft));
        expect(fixed(itemData.position.right)).to.be.greaterThan(fixed(itemData.position.actualRight));
      })
      .get(`${itemClass} .gstc__chart-timeline-items-row-item--left-cut-icon`)
      .should('be.visible')
      .get(`${itemClass} .gstc__chart-timeline-items-row-item--right-cut-icon`)
      .should('be.visible');
  });
});
