import { ItemData, Items, RowData, Rows } from '../../dist/gstc';

describe('Items vertical', () => {
  it('should calculate item vertical position', () => {
    let state;
    cy.load('/examples/dependency-lines')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
      })
      .then(() => {
        const itemData: ItemData = state.get('$data.chart.items.gstcid-T12');
        expect(itemData.position.viewTop).to.eq(364);
      });
  });

  it('should calculate item vertical position #2', () => {
    let state, gstc;
    cy.load('/examples/dependency-lines')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
        const rows: Rows = {
          'gstcid-0': {
            id: 'gstcid-0',
            label: 'gstcid-0',
          },
          'gstcid-1': {
            id: 'gstcid-1',
            label: 'gstcid-1',
          },
        };
        const startDate = gstc.api.time.date('2020-01-01');
        const endDate = gstc.api.time.date('2020-01-05').endOf('day');
        const items: Items = {
          // row 0
          'gstcid-0': {
            id: 'gstcid-0',
            label: 'Item 0',
            rowId: 'gstcid-0',
            time: {
              start: startDate.valueOf(),
              end: startDate.endOf('day').valueOf(),
            },
          },
          'gstcid-1': {
            id: 'gstcid-1',
            label: 'Item 1',
            rowId: 'gstcid-0',
            time: {
              start: startDate.add(1, 'day').valueOf(),
              end: startDate.add(1, 'day').endOf('day').valueOf(),
            },
          },
          'gstcid-2': {
            id: 'gstcid-2',
            label: 'Item 2',
            rowId: 'gstcid-0',
            time: {
              start: startDate.add(12, 'hour').valueOf(),
              end: startDate.add(1, 'day').add(12, 'hour').valueOf(),
            },
          },
          // row 2
          'gstcid-3': {
            id: 'gstcid-3',
            label: 'Item 3',
            rowId: 'gstcid-1',
            time: {
              start: startDate.valueOf(),
              end: startDate.endOf('day').valueOf(),
            },
          },
          'gstcid-4': {
            id: 'gstcid-4',
            label: 'Item 4',
            rowId: 'gstcid-1',
            time: {
              start: startDate.add(1, 'day').valueOf(),
              end: startDate.add(1, 'day').endOf('day').valueOf(),
            },
          },
          'gstcid-5': {
            id: 'gstcid-5',
            label: 'Item 5',
            rowId: 'gstcid-1',
            time: {
              start: startDate.add(12, 'hour').valueOf(),
              end: startDate.add(1, 'day').add(12, 'hour').valueOf(),
            },
          },
        };
        state.update('config', (config) => {
          config.list.rows = rows;
          config.chart.items = items;
          config.chart.time.from = startDate.valueOf();
          config.chart.time.to = endDate.valueOf();
          return config;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const row0: RowData = state.get('$data.list.rows.gstcid-0');
        expect(row0.outerHeight).to.eq(80);
        const row1: RowData = state.get('$data.list.rows.gstcid-1');
        expect(row1.outerHeight).to.eq(80);
      });
  });

  it('should calculate item vertical position #3', () => {
    let state, gstc;
    cy.load('/examples/dependency-lines')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
        const rows: Rows = {
          'gstcid-0': {
            id: 'gstcid-0',
            label: 'gstcid-0',
          },
          'gstcid-1': {
            id: 'gstcid-1',
            label: 'gstcid-1',
          },
        };
        const startDate = gstc.api.time.date('2020-01-01');
        const endDate = gstc.api.time.date('2020-01-05').endOf('day');
        const items: Items = {
          // row 0
          'gstcid-0': {
            id: 'gstcid-0',
            label: 'Item 0',
            rowId: 'gstcid-0',
            time: {
              start: startDate.valueOf(),
              end: startDate.endOf('day').valueOf(),
            },
          },
          'gstcid-1': {
            id: 'gstcid-1',
            label: 'Item 1',
            rowId: 'gstcid-0',
            time: {
              start: startDate.add(12, 'hour').valueOf(),
              end: startDate.add(1, 'day').add(12, 'hour').valueOf(),
            },
          },
          'gstcid-2': {
            id: 'gstcid-2',
            label: 'Item 2',
            rowId: 'gstcid-0',
            time: {
              start: startDate.add(1, 'day').valueOf(),
              end: startDate.add(1, 'day').endOf('day').valueOf(),
            },
          },
          // row 2
          'gstcid-3': {
            id: 'gstcid-3',
            label: 'Item 3',
            rowId: 'gstcid-1',
            time: {
              start: startDate.valueOf(),
              end: startDate.endOf('day').valueOf(),
            },
          },
          'gstcid-4': {
            id: 'gstcid-4',
            label: 'Item 4',
            rowId: 'gstcid-1',
            time: {
              start: startDate.add(12, 'hour').valueOf(),
              end: startDate.add(1, 'day').add(12, 'hour').valueOf(),
            },
          },
          'gstcid-5': {
            id: 'gstcid-5',
            label: 'Item 5',
            rowId: 'gstcid-1',
            time: {
              start: startDate.add(1, 'day').valueOf(),
              end: startDate.add(1, 'day').endOf('day').valueOf(),
            },
          },
        };
        state.update('config', (config) => {
          config.list.rows = rows;
          config.chart.items = items;
          config.chart.time.from = startDate.valueOf();
          config.chart.time.to = endDate.valueOf();
          return config;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const row0: RowData = state.get('$data.list.rows.gstcid-0');
        expect(row0.outerHeight).to.eq(80);
        const row1: RowData = state.get('$data.list.rows.gstcid-1');
        expect(row1.outerHeight).to.eq(80);
      });
  });

  it('should calculate item vertical position #4', () => {
    let state, gstc;
    cy.load('/examples/dependency-lines')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
        const rows: Rows = {
          'gstcid-0': {
            id: 'gstcid-0',
            label: 'gstcid-0',
          },
          'gstcid-1': {
            id: 'gstcid-1',
            label: 'gstcid-1',
          },
        };
        const startDate = gstc.api.time.date('2020-01-01');
        const endDate = gstc.api.time.date('2020-01-05').endOf('day');
        const items: Items = {
          // row 0
          'gstcid-0': {
            id: 'gstcid-0',
            label: 'Item 0',
            rowId: 'gstcid-0',
            time: {
              start: startDate.add(12, 'hour').valueOf(),
              end: startDate.add(1, 'day').add(12, 'hour').valueOf(),
            },
          },
          'gstcid-1': {
            id: 'gstcid-1',
            label: 'Item 1',
            rowId: 'gstcid-0',
            time: {
              start: startDate.add(1, 'day').valueOf(),
              end: startDate.add(1, 'day').endOf('day').valueOf(),
            },
          },
          'gstcid-2': {
            id: 'gstcid-2',
            label: 'Item 2',
            rowId: 'gstcid-0',
            time: {
              start: startDate.valueOf(),
              end: startDate.endOf('day').valueOf(),
            },
          },
          // row 2
          'gstcid-3': {
            id: 'gstcid-3',
            label: 'Item 3',
            rowId: 'gstcid-1',
            time: {
              start: startDate.add(12, 'hour').valueOf(),
              end: startDate.add(1, 'day').add(12, 'hour').valueOf(),
            },
          },
          'gstcid-4': {
            id: 'gstcid-4',
            label: 'Item 4',
            rowId: 'gstcid-1',
            time: {
              start: startDate.add(1, 'day').valueOf(),
              end: startDate.add(1, 'day').endOf('day').valueOf(),
            },
          },
          'gstcid-5': {
            id: 'gstcid-5',
            label: 'Item 5',
            rowId: 'gstcid-1',
            time: {
              start: startDate.valueOf(),
              end: startDate.endOf('day').valueOf(),
            },
          },
        };
        state.update('config', (config) => {
          config.list.rows = rows;
          config.chart.items = items;
          config.chart.time.from = startDate.valueOf();
          config.chart.time.to = endDate.valueOf();
          return config;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const row0: RowData = state.get('$data.list.rows.gstcid-0');
        expect(row0.outerHeight).to.eq(80);
        const row1: RowData = state.get('$data.list.rows.gstcid-1');
        expect(row1.outerHeight).to.eq(80);
      });
  });
});
