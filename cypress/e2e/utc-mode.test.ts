import { DataChartTime } from '../../dist/gstc';
const date = '2020-01-01';
describe('UTC mode', () => {
  it('should display dates according to utc mode', () => {
    let GSTC, state;
    cy.load('/examples/one-month')
      .window()
      .then((win) => {
        // @ts-ignore
        GSTC = win.GSTC;
        // @ts-ignore
        state = win.state;
      })
      .then(() => {
        const chartTime: DataChartTime = state.get('$data.chart.time');
        expect(chartTime.fromDate.format('YYYY-MM-DD')).to.eq(
          chartTime.levels[1][0].leftGlobalDate.format('YYYY-MM-DD')
        );
        expect(GSTC.api.date(date, true).valueOf()).not.to.eq(GSTC.api.date(date).valueOf());
      })
      // Invalid time
      .then(() => {
        state.update('config.utcMode', true);
        state.update('config.chart.time', (time) => {
          time.from = GSTC.api.date(date).startOf('month').valueOf();
          time.to = GSTC.api.date(date).endOf('month').valueOf();
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const chartTime: DataChartTime = state.get('$data.chart.time');
        expect(chartTime.fromDate.format('YYYY-MM-DD')).not.to.eq(date);
      })
      // Valid time
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.from = GSTC.api.date(date, true).startOf('month').valueOf();
          time.to = GSTC.api.date(date, true).endOf('month').valueOf();
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const chartTime: DataChartTime = state.get('$data.chart.time');
        expect(chartTime.fromDate.format('YYYY-MM-DD')).to.eq(
          chartTime.levels[1][0].leftGlobalDate.format('YYYY-MM-DD')
        );
      });
  });
});
