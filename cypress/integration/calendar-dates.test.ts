/// <reference types="Cypress" />

import DeepState from 'deep-state-observer';
import { DataChartTime, GSTCState } from '../../dist/gstc';
import { fixed } from '../helpers';

describe('Calendar dates', () => {
  it('should generate all dates', () => {
    let window, merge, state: DeepState<GSTCState>;
    cy.visit('/examples/complex-1/index.html')
      .window()
      .then((win) => {
        window = win;
        // @ts-ignore
        merge = win.gstc.api.mergeDeep;
        // @ts-ignore
        state = win.state;
        const time: DataChartTime = state.get('$data.chart.time');
        expect(time.allDates.length).to.eq(2);
        expect(time.allDates[0].length).to.eq(2);
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
      .scrollH(10)
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
      .get('.gstc__scroll-bar-inner--horizontal')
      .then(($scrollBar) => {
        return cy
          .get('.gstc__scroll-bar-inner--horizontal')
          .trigger('pointerdown', { screenX: $scrollBar.offset().left + 10, screenY: $scrollBar.offset().top + 10 })
          .trigger('pointermove', {
            screenX: $scrollBar.offset().left + 10 + 1000,
            screenY: $scrollBar.offset().top + 10,
          })
          .trigger('pointerup');
      })
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
      .get('.gstc__scroll-bar-inner--horizontal')
      .then(($scrollBar) => {
        return cy
          .get('.gstc__scroll-bar-inner--horizontal')
          .trigger('pointerdown', { screenX: $scrollBar.offset().left + 10, screenY: $scrollBar.offset().top + 10 })
          .trigger('pointermove', {
            screenX: $scrollBar.offset().left - 10,
            screenY: $scrollBar.offset().top + 10,
          })
          .trigger('pointerup');
      })
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
});
