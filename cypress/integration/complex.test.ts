import DeepState from 'deep-state-observer';
import { GSTCState } from '../../dist/gstc';

describe('Complex', () => {
  it('should change calculatedZoomMode', () => {
    let state: DeepState<GSTCState>, gstc, initialFrom, initialTo, from, to;
    cy.visit('/examples/complex-1')
      .wait(500)
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
      .wait(50)
      .then(() => {
        expect(state.get('config.chart.time.from')).to.eq(initialFrom);
        expect(state.get('config.chart.time.to')).to.be.lessThan(initialTo);
        expect(state.get('config.chart.time.calculatedZoomMode')).to.eq(true);
      });
  });
});
