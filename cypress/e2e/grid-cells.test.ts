import { DataChartTime } from '../../dist/gstc';
import { fixed } from '../helpers';

describe('Grid cells', () => {
  it('should display grid cell properly', () => {
    let gstc, state;
    cy.load('/examples/one-month')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
      })
      .log('start')
      .then(() => {
        const chartTime: DataChartTime = state.get('$data.chart.time');
        let cell = Cypress.$('.gstc__chart-timeline-grid-row-cell').get(0);
        let date = Cypress.$('.gstc__chart-calendar-date--day').get(0);
        let data = chartTime.levels[chartTime.level][0];
        expect(fixed(date.style.width)).to.eq(fixed(cell.style.width));
        expect(fixed(date.offsetLeft)).to.eq(fixed(cell.offsetLeft));
        expect(fixed(data.currentView.width)).to.eq(fixed(date.style.width));
        cell = Cypress.$('.gstc__chart-timeline-grid-row-cell').get(20);
        date = Cypress.$('.gstc__chart-calendar-date--day').get(20);
        data = chartTime.levels[chartTime.level][20];
        expect(fixed(date.style.width)).to.eq(fixed(cell.style.width));
        expect(fixed(date.offsetLeft)).to.eq(fixed(cell.offsetLeft));
        expect(fixed(data.currentView.width)).to.eq(fixed(date.style.width));
      })
      .log('#btn-next-month click')
      .get('#btn-next-month')
      .click()
      .wait(300)
      .then(() => {
        const chartTime: DataChartTime = state.get('$data.chart.time');
        let cell = Cypress.$('.gstc__chart-timeline-grid-row-cell').get(0);
        let date = Cypress.$('.gstc__chart-calendar-date--day').get(0);
        let data = chartTime.levels[chartTime.level][0];
        expect(fixed(date.style.width)).to.eq(fixed(cell.style.width));
        expect(fixed(date.offsetLeft)).to.eq(fixed(cell.offsetLeft));
        expect(fixed(data.currentView.width)).to.eq(fixed(date.style.width));
        cell = Cypress.$('.gstc__chart-timeline-grid-row-cell').get(20);
        date = Cypress.$('.gstc__chart-calendar-date--day').get(20);
        data = chartTime.levels[chartTime.level][20];
        expect(fixed(date.style.width)).to.eq(fixed(cell.style.width));
        expect(fixed(date.offsetLeft)).to.eq(fixed(cell.offsetLeft));
        expect(fixed(data.currentView.width)).to.eq(fixed(date.style.width));
      })
      .log('#btn-prev-month click')
      .get('#btn-prev-month')
      .click()
      .wait(300)
      .click()
      .wait(300)
      .then(() => {
        const chartTime: DataChartTime = state.get('$data.chart.time');
        let cell = Cypress.$('.gstc__chart-timeline-grid-row-cell').get(0);
        let date = Cypress.$('.gstc__chart-calendar-date--day').get(0);
        let data = chartTime.levels[chartTime.level][0];
        expect(fixed(date.style.width)).to.eq(fixed(cell.style.width));
        expect(fixed(date.offsetLeft)).to.eq(fixed(cell.offsetLeft));
        expect(fixed(data.currentView.width)).to.eq(fixed(date.style.width));
        cell = Cypress.$('.gstc__chart-timeline-grid-row-cell').get(20);
        date = Cypress.$('.gstc__chart-calendar-date--day').get(20);
        data = chartTime.levels[chartTime.level][20];
        expect(fixed(date.style.width)).to.eq(fixed(cell.style.width));
        expect(fixed(date.offsetLeft)).to.eq(fixed(cell.offsetLeft));
        expect(fixed(data.currentView.width)).to.eq(fixed(date.style.width));
      });
  });
});
