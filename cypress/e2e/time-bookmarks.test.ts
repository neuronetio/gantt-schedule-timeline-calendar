import { Time } from '../../dist/api/time';
import { DataChartTime } from '../../dist/gstc';
import { round } from '../helpers';

describe('Time bookmarks', () => {
  it('should display the bookmarks at the right positions', () => {
    let gstc, state;
    cy.load('/examples/one-month')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
      })
      .then(() => {
        const chartTime: DataChartTime = state.get('$data.chart.time');
        const thirdDateLeft = round(chartTime.levels[1][2].currentView.leftPx);
        let thirdDateFromAll;
        for (const currentDate of chartTime.allDates[1]) {
          if (currentDate.leftGlobalDate.format('YYYY-MM-DD') === '2020-01-03') {
            thirdDateFromAll = currentDate;
            continue;
          }
        }
        const fromAllDates = round(thirdDateFromAll.currentView.leftPx);
        cy.log('thirdDateFromAll', fromAllDates);
        cy.log('thirdDateLeft width', thirdDateLeft);
        expect(fromAllDates).to.eq(thirdDateLeft);
      })
      .get('.gstc__chart-time-bookmark-label-content--1-st')
      .then(($el) => {
        const left = round($el.parent().css('left'));
        const time: Time = gstc.api.time;
        const chartTime: DataChartTime = state.get('$data.chart.time');
        const thirdDateLeft = round(chartTime.levels[1][2].currentView.leftPx);
        const added2Days = chartTime.leftGlobalDate.startOf('day').add(2, 'day').startOf('day');
        expect(added2Days.format('YYYY-MM-DD')).to.eq('2020-01-03');
        const shouldLeft = round(time.getViewOffsetPxFromDates(added2Days, false, chartTime));
        expect(added2Days.format('YYYY-MM-DD')).to.eq('2020-01-03');
        expect(thirdDateLeft).to.eq(shouldLeft);
        expect(chartTime.leftGlobalDate.format('YYYY-MM-DD')).to.eq('2020-01-01');
        expect(left).to.eq(shouldLeft);
        expect($el.text().trim()).to.eq('1-st');
      })
      .get('.gstc__chart-time-bookmark-label-content--bookmark-1')
      .then(($el) => {
        const left = round($el.parent().css('left'));
        const time: Time = gstc.api.time;
        const chartTime: DataChartTime = state.get('$data.chart.time');
        const added4Days = chartTime.leftGlobalDate.startOf('day').add(4, 'day').startOf('day');
        expect(added4Days.format('YYYY-MM-DD')).to.eq('2020-01-05');
        const shouldLeft = round(time.getViewOffsetPxFromDates(added4Days, false, chartTime));
        expect(added4Days.format('YYYY-MM-DD')).to.eq('2020-01-05');
        expect(chartTime.leftGlobalDate.format('YYYY-MM-DD')).to.eq('2020-01-01');
        expect(left).to.eq(shouldLeft);
        expect($el.text().trim()).to.eq('Bookmark 2020-01-05');
      })
      .get('.gstc__chart-time-bookmark-label-content--bookmark-1')
      .should('be.visible')
      .get('.gstc__chart-time-bookmark-label')
      .then(($labels) => {
        expect($labels.length).to.eq(8);
      })
      .get('#btn-next-month')
      .click()
      .wait(300) // because on site there is setTimeout 250 to show the results
      .get('.gstc__chart-time-bookmark-label')
      .then(($labels) => {
        expect($labels.length).to.eq(2);
      })
      .get('.gstc__chart-time-bookmark-label-content--bookmark-8')
      .then(($el) => {
        const left = round($el.parent().css('left'));
        const time: Time = gstc.api.time;
        const chartTime: DataChartTime = state.get('$data.chart.time');
        const added1Day = chartTime.leftGlobalDate.startOf('day').add(1, 'day').startOf('day');
        expect(added1Day.format('YYYY-MM-DD')).to.eq('2020-02-02');
        const shouldLeft = round(time.getViewOffsetPxFromDates(added1Day, false, chartTime));
        expect(added1Day.format('YYYY-MM-DD')).to.eq('2020-02-02');
        expect(chartTime.leftGlobalDate.format('YYYY-MM-DD')).to.eq('2020-02-01');
        expect(left).to.eq(shouldLeft);
        expect($el.text().trim()).to.eq('Bookmark 2020-02-02');
      })
      .get('.gstc__chart-time-bookmark-line-content--bookmark-8')
      .should('be.visible')
      .get('.gstc__chart-time-bookmark-label-content--1-st')
      .should('not.exist')
      .get('.gstc__chart-time-bookmark-label-content--bookmark-1')
      .should('not.exist');
  });
});
