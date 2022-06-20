/// <reference types="Cypress" />

import DeepState from 'deep-state-observer';
import { DataChartTime } from '../../dist/gstc';
import { fixed } from '../helpers';

describe('Calendar dates', () => {
  it('should generate all dates (complex-1)', () => {
    let window, merge, state: DeepState;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        window = win;
        // @ts-ignore
        merge = win.gstc.api.mergeDeep;
        // @ts-ignore
        state = win.state;
        state.update('config.scroll.horizontal.precise', true);
        state.update('config.scroll.vertical.precise', true);
        const time: DataChartTime = state.get('$data.chart.time');
        expect(time.allDates.length).to.eq(2);
        expect(time.allDates[0].length).to.be.at.least(2);
        cy.log('All dates', time.allDates);
        const firstDateLevel0 = time.allDates[0][0].leftGlobalDate;
        const firstDateLevel1 = time.allDates[1][0].leftGlobalDate;
        const lastDateLevel0 = time.allDates[0][time.allDates[0].length - 1].rightGlobalDate;
        const lastDateLevel1 = time.allDates[1][time.allDates[1].length - 1].rightGlobalDate;
        cy.log('From date', time.fromDate.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('To date', time.toDate.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('firstDateLevel0', firstDateLevel0.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('firstDateLevel1', firstDateLevel1.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('lastDateLevel0', lastDateLevel0.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('lastDateLevel1', lastDateLevel1.format('YYYY-MM-DD HH:mm:ss'));
        expect(lastDateLevel0.valueOf()).to.be.at.least(time.toDate.valueOf());
        expect(lastDateLevel1.valueOf()).to.be.at.least(time.toDate.valueOf());
        expect(firstDateLevel0.valueOf()).to.be.at.most(time.fromDate.valueOf());
        expect(firstDateLevel1.valueOf()).to.be.at.most(time.fromDate.valueOf());
      })
      //
      // Check first date element
      //
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time: DataChartTime = state.get('$data.chart.time');
        const first = $el.get(0);
        const day = Cypress.$(first).find('.gstc__chart-calendar-date-content.gstc-date-top').get(0);
        const firstDate = time.levels[1][0];
        cy.log('day', day);
        expect(day.textContent).to.eq('01');
        expect(time.levels.length).to.eq(2);
        expect(time.levels[0].length).to.eq(1);
        cy.log('firstDate', firstDate);
        expect(firstDate.leftGlobalDate.valueOf()).to.eq(time.fromDate.valueOf());
        const elementWidth = fixed(first.style.width);
        const dataWidth = fixed(firstDate.currentView.width);
        expect(dataWidth).to.eq(elementWidth);
        expect(dataWidth).to.be.greaterThan(80);
      })
      //
      // move horizontal scroll bar a little bit
      //
      .scrollH(15)
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time: DataChartTime = state.get('$data.chart.time');
        const first = $el.get(0);
        const firstDate = time.levels[1][0];
        const elementWidth = fixed(first.style.width);
        const dataWidth = fixed(firstDate.currentView.width);
        expect(elementWidth).to.eq(dataWidth);
        expect(elementWidth).to.be.lessThan(fixed(firstDate.width));
        const day = Cypress.$(first).find('.gstc__chart-calendar-date-content.gstc-date-top').get(0);
        expect(day.textContent).to.eq('01');
      })
      //
      // Move horizontal scroll bar to the end
      //
      .scrollH(1000)
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time = merge({}, window.state.get('$data.chart.time'));
        const last = $el.get($el.length - 1);
        const lastDate = time.levels[1][time.levels[1].length - 1];
        const elementWidth = fixed(last.style.width);
        const dataWidth = fixed(lastDate.currentView.width);
        expect(elementWidth).to.eq(dataWidth);
        expect(elementWidth).to.eq(fixed(lastDate.width));
        const day = Cypress.$(last).find('.gstc__chart-calendar-date-content.gstc-date-top').get(0);
        expect(day.textContent).to.eq('31');
      })
      //
      // Move horizontal scroll bar a little bit from the end
      //
      .scrollH(-14)
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time = merge({}, window.state.get('$data.chart.time'));
        const last = $el.get($el.length - 1);
        const lastDate = time.levels[1][time.levels[1].length - 1];
        const elementWidth = fixed(last.style.width);
        const dataWidth = fixed(lastDate.currentView.width);
        expect(elementWidth).to.eq(dataWidth);
        expect(elementWidth).to.be.lessThan(fixed(lastDate.width));
        const day = Cypress.$(last).find('.gstc__chart-calendar-date-content.gstc-date-top').get(0);
        expect(day.textContent).to.eq('31');
      });
  });

  it('should calculate proper left/right global dates when changing the zoom', () => {
    let state;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        state.update('config.chart.time.zoom', 21);
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const time: DataChartTime = state.get('$data.chart.time');
        expect(time.leftGlobalDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-01 00:00:00');
        expect(time.rightGlobalDate.format('YYYY-MM-DD HH:mm:ss')).to.eq('2020-02-27 19:42:32');
      })
      .get('.gstc__chart-calendar-date--day .gstc-date-top')
      .then(($daysTop) => {
        expect($daysTop.length).to.eq(27);
        const first = $daysTop.get(0);
        expect(first.textContent).to.eq('01');
        expect(first.offsetWidth).to.eq(40);
        const last = $daysTop.get($daysTop.length - 1);
        expect(last.textContent).to.eq('27');
        expect(last.offsetWidth).to.eq(33);
      })
      .get('.gstc__chart-timeline-grid-row[data-gstcid="gstcid-0"] .gstc__chart-timeline-grid-row-cell')
      .then(($cells) => {
        expect($cells.length).to.eq(27);
        const first = $cells.get(0);
        expect(first.offsetWidth).to.eq(41);
        const last = $cells.get($cells.length - 1);
        expect(last.offsetWidth).to.eq(34);
      });
  });

  it('should align levels to main dates when there are missing main dates', () => {
    const februaryElSel = '.gstc__chart-calendar-date--month[data-gstcid="gstcid-1580511600000"]';
    let februaryInitialWidth = 0;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        win.state.update('config.chart.time.zoom', 21);
      })
      .wait(Cypress.env('wait'))
      .get(februaryElSel)
      .should('be.visible')
      .then(($feb) => {
        februaryInitialWidth = fixed($feb.get(0).style.width);
      })
      .log(`Initial february width ${februaryInitialWidth}`)
      .get('#hide-weekends')
      .click()
      .wait(Cypress.env('wait'))
      .get(februaryElSel)
      .should('be.visible')
      .then(($feb) => {
        expect(fixed($feb.get(0).style.width)).to.be.lessThan(februaryInitialWidth);
      });
  });

  it('should generate all dates (custom-period-advanced)', () => {
    let window, merge, state: DeepState;
    cy.load('/examples/custom-period-advanced')
      .window()
      .then((win) => {
        window = win;
        // @ts-ignore
        merge = win.gstc.api.mergeDeep;
        // @ts-ignore
        state = win.state;
        state.update('config.scroll.horizontal.precise', true);
        state.update('config.scroll.vertical.precise', true);
        const time: DataChartTime = state.get('$data.chart.time');
        expect(time.allDates.length).to.eq(2);
        expect(time.allDates[0].length).to.be.at.least(2);
        cy.log('All dates', time.allDates);
        const firstDateLevel0 = time.allDates[0][0].leftGlobalDate;
        const firstDateLevel1 = time.allDates[1][0].leftGlobalDate;
        const lastDateLevel0 = time.allDates[0][time.allDates[0].length - 1].rightGlobalDate;
        const lastDateLevel1 = time.allDates[1][time.allDates[1].length - 1].rightGlobalDate;
        cy.log('From date', time.fromDate.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('To date', time.toDate.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('firstDateLevel0', firstDateLevel0.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('firstDateLevel1', firstDateLevel1.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('lastDateLevel0', lastDateLevel0.format('YYYY-MM-DD HH:mm:ss'));
        cy.log('lastDateLevel1', lastDateLevel1.format('YYYY-MM-DD HH:mm:ss'));
        expect(lastDateLevel0.valueOf()).to.be.at.least(time.toDate.valueOf());
        expect(lastDateLevel1.valueOf()).to.be.at.least(time.toDate.valueOf());
        expect(firstDateLevel0.valueOf()).to.be.at.most(time.fromDate.valueOf());
        expect(firstDateLevel1.valueOf()).to.be.at.most(time.fromDate.valueOf());
      })
      .wait(Cypress.env('wait'))
      //
      // Check first date element
      //
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time: DataChartTime = state.get('$data.chart.time');
        const first = $el.get(0);
        const cell = Cypress.$(first).find('.gstc__chart-calendar-date-content--day').get(0);
        const firstDate = time.levels[1][0];
        expect(cell.textContent).to.eq('01 - 16');
        expect(time.levels.length).to.eq(2);
        expect(time.levels[0].length).to.eq(8); // only visible
        expect(time.allDates[0].length).to.eq(12); // all dates
        cy.log('firstDate', firstDate);
        expect(firstDate.leftGlobalDate.valueOf()).to.eq(time.fromDate.valueOf());
        const elementWidth = fixed(first.style.width);
        const dataWidth = fixed(firstDate.currentView.width);
        expect(dataWidth).to.eq(elementWidth);
        expect(dataWidth).to.be.greaterThan(80);
      })
      //
      // move horizontal scroll bar a little bit
      //
      .scrollH(2)
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time: DataChartTime = state.get('$data.chart.time');
        const first = $el.get(0);
        const second = $el.get(1);
        const firstDate = time.levels[1][0];
        const elementWidth = fixed(first.style.width);
        const dataWidth = fixed(firstDate.currentView.width);
        expect(elementWidth).to.eq(dataWidth);
        expect(elementWidth).to.be.lessThan(fixed(firstDate.width));
        const cell1 = Cypress.$(first).find('.gstc__chart-calendar-date-content--day').get(0);
        expect(cell1.textContent).to.eq('01 - 16');
        const cell2 = Cypress.$(second).find('.gstc__chart-calendar-date-content--day').get(0);
        expect(cell2.textContent).to.eq('17 - 31');
      })
      //
      // Move horizontal scroll bar to the end
      //
      .scrollH(1000)
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time = merge({}, window.state.get('$data.chart.time'));
        const last = $el.get($el.length - 1);
        const lastDate = time.levels[1][time.levels[1].length - 1];
        const elementWidth = fixed(last.style.width);
        const dataWidth = fixed(lastDate.currentView.width);
        expect(elementWidth).to.eq(dataWidth);
        expect(elementWidth).to.eq(fixed(lastDate.width));
        const cell1 = Cypress.$(last).find('.gstc__chart-calendar-date-content--day').get(0);
        expect(cell1.textContent).to.eq('17 - 31');
      })
      //
      // Move horizontal scroll bar a little bit from the end
      //
      .scrollH(-40)
      .get('.gstc__chart-calendar-date--level-1')
      .then(($el) => {
        const time = merge({}, window.state.get('$data.chart.time'));
        const last = $el.get($el.length - 1);
        const lastDate = time.levels[1][time.levels[1].length - 1];
        const elementWidth = fixed(last.style.width);
        const dataWidth = fixed(lastDate.currentView.width);
        expect(elementWidth).to.eq(dataWidth);
        expect(elementWidth).to.be.lessThan(fixed(lastDate.width));
        const cell1 = Cypress.$(last).find('.gstc__chart-calendar-date-content--day').get(0);
        expect(cell1.textContent).to.eq('17 - 31');
      });
  });

  //generateAllDates('/examples/custom-period-advanced');
});
