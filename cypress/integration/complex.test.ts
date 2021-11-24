import DeepState from 'deep-state-observer';
import { GSTCState } from '../../dist/gstc';

describe('Complex', () => {
  it('should change calculatedZoomMode', () => {
    let state: DeepState<GSTCState>, gstc, initialFrom, initialTo, from, to;
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
      })
      .get('#one-month')
      .click()
      .wait(Cypress.env('wait'))
      .then(() => {
        expect(state.get('config.chart.time.from')).to.eq(initialFrom);
        expect(state.get('$data.chart.time.fromDate').valueOf()).to.eq(initialFrom);
        expect(state.get('config.chart.time.to')).to.be.lessThan(initialTo);
        expect(state.get('$data.chart.time.toDate').valueOf()).to.be.lessThan(initialTo);
        expect(state.get('config.chart.time.calculatedZoomMode')).to.eq(true);
      })
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.from = from;
          time.to = to;
          time.calculatedZoomMode = false;
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        expect(state.get('config.chart.time.from')).to.eq(from);
        expect(state.get('$data.chart.time.fromDate').valueOf()).to.eq(from);
        expect(state.get('config.chart.time.to')).to.be.eq(to);
        expect(state.get('$data.chart.time.toDate').valueOf()).to.eq(to);
        expect(state.get('config.chart.time.calculatedZoomMode')).to.eq(false);
      });
  });
});
