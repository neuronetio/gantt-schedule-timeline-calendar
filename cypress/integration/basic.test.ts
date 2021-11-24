import DeepState from 'deep-state-observer';
import { GSTCState } from '../../dist/gstc';

describe('Basic', () => {
  function basicTest(path) {
    return it(`Simple (${path})`, () => {
      let state: DeepState<GSTCState>, gstc;
      cy.load(path)
        .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label')
        .should(($el) => {
          expect($el.text()).to.eq('Item 1');
        })
        .window()
        .then((win) => {
          // @ts-ignore
          state = win.state as DeepState;
          // @ts-ignore
          gstc = win.gstc;
          expect(state.get('config.chart.items.gstcid-1.label')).to.eq('Item 1');
          state.update('config.chart.items.gstcid-1.label', 'New label 1');
          expect(state.get('config.chart.items.gstcid-1.label')).to.eq('New label 1');
        })
        .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label')
        .should(($el) => {
          expect($el.text()).to.eq('New label 1');
        })
        .then(() => {
          cy.log('rows', Object.keys(state.get('$data.list.rows')));
          cy.log('rowsIds', state.get('$data.list.rowsIds'));
          cy.log('visibleRows', state.get('$data.list.visibleRows').join(','));
          cy.log('itemRowMap keys', Object.keys(state.get('$data.itemRowMap')).join(','));
          cy.log('rowsIds', state.get('$data.list.rowsIds').join(','));
          cy.log('$data.chart.grid.rows', Object.keys(state.get('$data.chart.grid.rows')).join(','));
          cy.log('$data.chart.items', Object.keys(state.get('$data.chart.items')).join(','));
        })
        .then(() => {
          expect(Object.keys(state.get('$data.chart.grid.rows')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.grid.cells')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.items')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.list.rows')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.items')).join(',')).to.eq(
            Object.keys(state.get('$data.itemRowMap')).join(',')
          );
          expect(Object.keys(state.get('$data.list.rows')).join(',')).to.eq(state.get('$data.list.rowsIds').join(','));
          expect(state.get('$data.list.visibleRowsHeight')).to.be.greaterThan(0);
          expect(state.get('$data.list.rowsWithParentsExpanded').join(',')).to.eq(
            Object.keys(state.get('$data.list.rows')).join(',') // all rows should be visible
          );
          expect(state.get('$data.list.rowsWithParentsExpanded').length).to.be.greaterThan(0);
        })
        //
        // Update rows
        //
        .then(() => {
          cy.log('Update rows');
          state.update('config', (config) => {
            config.list.rows = {
              'gstcid-1': {
                id: 'gstcid-1',
                label: 'Row 1',
              },
              'gstcid-2': {
                id: 'gstcid-2',
                label: 'Row 2',
              },
            };
            config.chart.items = {
              'gstcid-1': {
                id: 'gstcid-1',
                label: 'Item 1',
                rowId: 'gstcid-1',
                time: {
                  start: gstc.api.time.date('2020-01-01').startOf('day').valueOf(),
                  end: gstc.api.time.date('2020-01-02').endOf('day').valueOf(),
                },
              },
              'gstcid-2': {
                id: 'gstcid-2',
                label: 'Item 2',
                rowId: 'gstcid-2',
                time: {
                  start: gstc.api.time.date('2020-01-15').startOf('day').valueOf(),
                  end: gstc.api.time.date('2020-01-20').endOf('day').valueOf(),
                },
              },
            };
            return config;
          });
        })
        .then(() => {
          cy.log('rows', Object.keys(state.get('$data.list.rows')));
          cy.log('rowsIds', state.get('$data.list.rowsIds'));
          cy.log('visibleRows', state.get('$data.list.visibleRows').join(','));
          cy.log('itemRowMap keys', Object.keys(state.get('$data.itemRowMap')).join(','));
          cy.log('$data.chart.grid.rows', Object.keys(state.get('$data.chart.grid.rows')).join(','));
          cy.log('$data.chart.items', Object.keys(state.get('$data.chart.items')).join(','));
          cy.log('config.version', state.get('config.version'));
        })
        .then(() => {
          expect(Object.keys(state.get('$data.chart.grid.rows')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.grid.cells')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.items')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.list.rows')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.items')).join(',')).to.eq(
            Object.keys(state.get('$data.itemRowMap')).join(',')
          );
          expect(Object.keys(state.get('$data.list.rows')).join(',')).to.eq(state.get('$data.list.rowsIds').join(','));
          expect(state.get('$data.list.rowsWithParentsExpanded').length).to.be.greaterThan(0);
          expect(state.get('$data.list.visibleRows').length).to.be.greaterThan(0);
          expect(state.get('$data.list.visibleRowsHeight')).to.be.greaterThan(0);
          expect(state.get('$data.list.rowsWithParentsExpanded').join(',')).to.eq(
            state.get('$data.list.visibleRows').join(',') // there is only one row so it will work
          );
          expect(state.get('$data.list.rowsWithParentsExpanded').length).to.be.greaterThan(0);
        })
        //
        // Update again
        //
        .then(() => {
          cy.log('Update again');
          state.update('config', (config) => {
            config.list.rows = {
              'gstcid-13': {
                id: 'gstcid-13',
                label: 'Row 2',
              },
            };
            config.chart.items = {
              'gstcid-400': {
                id: 'gstcid-400',
                label: 'Item 2',
                rowId: 'gstcid-13',
                time: {
                  start: gstc.api.time.date('2020-01-15').startOf('day').valueOf(),
                  end: gstc.api.time.date('2020-01-20').endOf('day').valueOf(),
                },
              },
            };
            return config;
          });
        })
        .wait(100)
        .then(() => {
          cy.log('rows', Object.keys(state.get('$data.list.rows')));
          cy.log('rowsIds', state.get('$data.list.rowsIds'));
          cy.log('visibleRows', state.get('$data.list.visibleRows').join(','));
          cy.log('itemRowMap keys', Object.keys(state.get('$data.itemRowMap')).join(','));
          cy.log('$data.chart.grid.rows', Object.keys(state.get('$data.chart.grid.rows')).join(','));
          cy.log('$data.chart.items', Object.keys(state.get('$data.chart.items')).join(','));
          cy.log('config.version', state.get('config.version'));
        })
        .then(() => {
          expect(Object.keys(state.get('$data.chart.grid.rows')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.grid.cells')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.items')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.list.rows')).length).to.be.greaterThan(0);
          expect(Object.keys(state.get('$data.chart.items')).join(',')).to.eq(
            Object.keys(state.get('$data.itemRowMap')).join(',')
          );
          expect(Object.keys(state.get('$data.list.rows')).join(',')).to.eq(state.get('$data.list.rowsIds').join(','));
          expect(state.get('$data.list.rowsWithParentsExpanded').length).to.be.greaterThan(0);
          expect(state.get('$data.list.visibleRows').length).to.be.greaterThan(0);
          expect(state.get('$data.list.visibleRowsHeight')).to.be.greaterThan(0);
          expect(state.get('$data.list.rowsWithParentsExpanded').join(',')).to.eq(
            state.get('$data.list.visibleRows').join(',') // there is only one row so it will work
          );
          expect(state.get('$data.list.rowsWithParentsExpanded').length).to.be.greaterThan(0);
        });
    });
  }

  basicTest('/examples/simple/simple.esm.html');
  basicTest('/examples/simple/simple.umd.html');
});
