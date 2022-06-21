import DeepState from 'deep-state-observer';
import { Api } from '../../dist/api/api';
import { DataChartTime, DataChartTimeLevelDate, Item, ItemData } from '../../dist/gstc';
import { fixed, examples } from '../helpers';

describe('Items', () => {
  function resizing(url) {
    return it('Resizing ' + url, () => {
      const rightResizerSelector =
        '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-3"] .gstc__chart-timeline-items-row-item-resizing-handle--right';
      let api: Api;
      let state: DeepState;
      let spacing: number = 4;

      cy.load(url)
        .window()
        .then((win) => {
          // @ts-ignore
          api = win.gstc.api;
          // @ts-ignore
          state = win.state;
          const item = api.getItem('gstcid-3');
          api.scrollToTime(item.time.start, false);
          spacing = state.get('config.chart.spacing');
        })
        .wait(Cypress.env('wait'))
        .then(() => {
          const item = api.getItem('gstcid-3');
          expect(state.get('$data.chart.time.leftGlobal')).to.eq(item.time.start);
          const itemData = api.getItemData('gstcid-3');
          expect(itemData.position.left).to.eq(0);
          expect(itemData.width).to.be.greaterThan(0);
        })
        .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-3"]')
        .then(($el) => {
          const itemData: ItemData = api.getItemData('gstcid-3');
          const itemDataWidth = Math.round(itemData.actualWidth - spacing);
          const elementWidth = Math.round(parseFloat($el.css('width')));
          expect(itemDataWidth).to.eq(elementWidth);
          expect(itemDataWidth).to.be.greaterThan(0);
          expect(itemData.position.right);
          expect(fixed($el.css('left'))).to.eq(0);
          api.plugins.Selection.selectItems(['gstcid-3']);
          return $el;
        })
        .wait(Cypress.env('wait'))
        .then(($el) => {
          expect($el).to.have.class('gstc__selected');
        })
        .get(rightResizerSelector)
        .should('be.visible')
        .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-3"]')
        .then(($el) => {
          return cy.move(rightResizerSelector, -$el.width(), 0);
        })
        .then(() => {
          const itemData: ItemData = state.get('$data.chart.items.gstcid-3');
          api.scrollToTime(itemData.time.startDate.valueOf(), false);
        })
        .wait(Cypress.env('wait'))
        .then(() => {
          const itemData: ItemData = state.get('$data.chart.items.gstcid-3');
          const time: DataChartTime = state.get('$data.chart.time');
          const firstDate = time.levels[time.level][0];
          if (url === '/examples/complex-1/index.html') {
            const spacing: number = state.get('config.chart.spacing');
            expect(fixed(itemData.actualWidth + spacing)).to.eq(fixed(firstDate.currentView.width));
          }
          if (url === '/examples/item-types-plugin/index.html') {
            const minWidth: number = state.get('config.chart.item.minWidth');
            expect(fixed(itemData.actualWidth)).to.eq(fixed(minWidth));
          }
        })
        .get('.gstc__chart-timeline-items-row-item-resizing-handle--right-outside[data-gstcid="gstcid-3"]')
        .should('be.visible');
    });
  }

  examples.forEach((example) => resizing(example));

  it('should change item position programmatically in normal mode by changing item', () => {
    let state, gstc;
    cy.load('/examples/complex-1')
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
        const item15 = state.get('$data.chart.items.gstcid-15');
        expect(item15.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
        expect(item15.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-24 23:59:59');
      });
  });

  it('should change item position programmatically in calculatedZoom mode by changing item', () => {
    let state, gstc;
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
        const item15 = state.get('$data.chart.items.gstcid-15');
        expect(item15.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
        expect(item15.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-24 23:59:59');
      });
  });

  it('should move dependant items to the right position when all dates are available', () => {
    let gstc, state;
    const itemId = 'gstcid-5',
      dep1Id = 'gstcid-7',
      dep2Id = 'gstcid-9';
    const itemClass = `.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        state.update(`config.chart.items.${itemId}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-18').valueOf();
          item.time.end = gstc.api.time.date('2020-02-20').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep1Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-25').valueOf();
          item.time.end = gstc.api.time.date('2020-02-26').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep2Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-26').valueOf();
          item.time.end = gstc.api.time.date('2020-02-28').endOf('day').valueOf();
          return item;
        });
        gstc.api.scrollToTime(gstc.api.time.date('2020-02-14').valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .move(itemClass, -90, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-17 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-19 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-24 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-25 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-25 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-27 23:59:59');
      })
      .move(itemClass, 90, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-18 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-20 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-25 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-26 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-26 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-28 23:59:59');
      })
      .move(itemClass, -180, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-16 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-18 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-23 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-24 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-24 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-26 23:59:59');
      });
  });

  it('should move dependant items to the right position when some dates are removed (hide weekends)', () => {
    let gstc, state;
    const itemId = 'gstcid-5',
      dep1Id = 'gstcid-7',
      dep2Id = 'gstcid-9';
    const itemClass = `.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        state.update(`config.chart.items.${itemId}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-18').valueOf();
          item.time.end = gstc.api.time.date('2020-02-20').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep1Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-25').valueOf();
          item.time.end = gstc.api.time.date('2020-02-26').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep2Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-02-26').valueOf();
          item.time.end = gstc.api.time.date('2020-02-28').endOf('day').valueOf();
          return item;
        });
        gstc.api.scrollToTime(gstc.api.time.date('2020-02-14').valueOf(), false);
      })
      .get('#hide-weekends')
      .click()
      .wait(Cypress.env('wait'))
      .move(itemClass, -90, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-17 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-19 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-24 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-25 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-25 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-27 23:59:59');
      })
      .move(itemClass, 90, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-18 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-20 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-25 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-26 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-26 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-28 23:59:59');
      })
      .move(itemClass, -180, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-14 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-18 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-21 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-24 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-24 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-26 23:59:59');
      });
  });

  it('should move dependant items to the right position when all dates are available in calculatedZoomMode', () => {
    let gstc, state;
    const itemId = 'gstcid-5',
      dep1Id = 'gstcid-7',
      dep2Id = 'gstcid-9';
    const itemClass = `.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`;
    const cellWidth = 36;
    cy.load('/examples/one-month')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        state.update(`config.chart.items.${itemId}`, (item) => {
          item.time.start = gstc.api.time.date('2020-01-14').valueOf();
          item.time.end = gstc.api.time.date('2020-01-16').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep1Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-01-21').valueOf();
          item.time.end = gstc.api.time.date('2020-01-22').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep2Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-01-22').valueOf();
          item.time.end = gstc.api.time.date('2020-01-24').endOf('day').valueOf();
          return item;
        });
      })
      .wait(Cypress.env('wait'))
      .move(itemClass, -cellWidth, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-13 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-15 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-21 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-21 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-23 23:59:59');
      })
      .move(itemClass, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-14 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-16 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-21 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-22 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-22 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-24 23:59:59');
      })
      .move(itemClass, -(2 * cellWidth), 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-12 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-14 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-19 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-22 23:59:59');
      });
  });

  it('should move dependant items to the right position when some dates are removed (hide weekends) in calculatedZoomMode', () => {
    let gstc, state;
    const itemId = 'gstcid-5',
      dep1Id = 'gstcid-7',
      dep2Id = 'gstcid-9';
    const itemClass = `.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`;
    const cellWidth = 50;
    cy.load('/examples/one-month')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        state.update(`config.chart.items.${itemId}`, (item) => {
          item.time.start = gstc.api.time.date('2020-01-14').valueOf();
          item.time.end = gstc.api.time.date('2020-01-16').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep1Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-01-21').valueOf();
          item.time.end = gstc.api.time.date('2020-01-22').endOf('day').valueOf();
          return item;
        });
        state.update(`config.chart.items.${dep2Id}`, (item) => {
          item.time.start = gstc.api.time.date('2020-01-22').valueOf();
          item.time.end = gstc.api.time.date('2020-01-24').endOf('day').valueOf();
          return item;
        });
      })
      .get('#hide-weekends')
      .click()
      .wait(Cypress.env('wait'))
      .move(itemClass, -cellWidth, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-13 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-15 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-21 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-21 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-23 23:59:59');
      })
      .move(itemClass, cellWidth, 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-14 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-16 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-21 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-22 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-22 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-24 23:59:59');
      })
      .move(itemClass, -(2 * cellWidth), 0)
      .then(() => {
        const itemData: ItemData = gstc.api.getItemData(itemId);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-10 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-14 23:59:59');
        const dep1Data: ItemData = gstc.api.getItemData(dep1Id);
        expect(dep1Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-17 00:00:00');
        expect(dep1Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 23:59:59');
        const dep2Data: ItemData = gstc.api.getItemData(dep2Id);
        expect(dep2Data.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
        expect(dep2Data.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-22 23:59:59');
      });
  });

  it('should not change item width when item ends in missing date', () => {
    let gstc, state;
    const itemId = 'gstcid-15';
    const itemClass = `.gstc__chart-timeline-items-row-item[data-gstcid="${itemId}"]`;
    let cellWidth;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
        state.update(`config.chart.items.${itemId}`, (item: Item) => {
          item.time.start = gstc.api.time.date('2020-02-07').valueOf();
          item.time.end = gstc.api.time.date('2020-02-08').endOf('day').valueOf();
          return item;
        });
      })
      .get('#hide-weekends')
      .click()
      .wait(Cypress.env('wait'))
      .then(() => {
        const cell: DataChartTimeLevelDate = state.get('$data.chart.time.allDates.1.0');
        cellWidth = cell.width;
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-07 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-08 23:59:59');
        expect(itemData.width).to.eq(itemData.actualWidth);
        expect(itemData.width).to.eq(cellWidth);
        expect(itemData.position.right).to.eq(cellWidth * 5);
      })
      .move(itemClass, 2, 0)
      .then(() => {
        const itemData: ItemData = state.get(`$data.chart.items.${itemId}`);
        expect(itemData.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-07 00:00:00');
        expect(itemData.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-07 23:59:59');
        expect(itemData.width).to.eq(itemData.actualWidth);
        expect(itemData.width).to.eq(cellWidth);
        expect(itemData.position.right).to.eq(cellWidth * 5);
      });
  });

  // it('should change item position programmatically in normal mode by changing item.time', () => {
  //   let state, gstc;
  //   cy.load('/examples/complex-1')
  //     .window()
  //     .then((win) => {
  //       // @ts-ignore
  //       state = win.state;
  //       // @ts-ignore
  //       gstc = win.gstc;
  //     })
  //     .then(() => {
  //       state.update('config.chart.items.gstcid-15.time', (itemTime) => {
  //         itemTime.start = gstc.api.time.date('2020-01-20').valueOf();
  //         itemTime.end = gstc.api.time.date('2020-01-24').endOf('day').valueOf();
  //         return itemTime;
  //       });
  //     })
  //     .wait(Cypress.env('wait'))
  //     .then(() => {
  //       const item15 = state.get('$data.chart.items.gstcid-15');
  //       expect(item15.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
  //       expect(item15.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-24 23:59:59');
  //     });
  // });

  // it('should change item position programmatically in calculatedZoom mode by changing item.time', () => {
  //   let state, gstc;
  //   cy.load('/examples/one-month')
  //     .window()
  //     .then((win) => {
  //       // @ts-ignore
  //       state = win.state;
  //       // @ts-ignore
  //       gstc = win.gstc;
  //     })
  //     .then(() => {
  //       state.update('config.chart.items.gstcid-15.time', (itemTime) => {
  //         itemTime.start = gstc.api.time.date('2020-01-20').valueOf();
  //         itemTime.end = gstc.api.time.date('2020-01-24').endOf('day').valueOf();
  //         return itemTime;
  //       });
  //     })
  //     .wait(Cypress.env('wait'))
  //     .then(() => {
  //       const item15 = state.get('$data.chart.items.gstcid-15');
  //       expect(item15.time.startDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-20 00:00:00');
  //       expect(item15.time.endDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-01-24 23:59:59');
  //     });
  // });
});
