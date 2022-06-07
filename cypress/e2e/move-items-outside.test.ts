import { DataChartTime, DataScrollHorizontal } from '../../dist/gstc';

describe('Move items outside view', () => {
  it('should calculate right scroll position', () => {
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
      .move('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-2"]', 160, 0)
      .move('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-2"]', 160, 0)
      .then(() => {
        const horizontalScroll: DataScrollHorizontal = state.get('$data.scroll.horizontal');
        const time: DataChartTime = state.get('$data.chart.time');
        //expect(time.toDate.format('YYYY-MM-DD')).to.eq('2020-04-04');
        //expect(horizontalScroll.data.leftGlobalDate.format('YYYY-MM-DD')).to.eq('2020-03-21');
      });
  });
});
