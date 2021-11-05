/// <reference types="Cypress" />

import DeepState from 'deep-state-observer';
import { Api } from '../../dist/api/api';
import { DataChartTime, GSTCState, ItemData } from '../../dist/gstc';
import { fixed } from '../helpers';

describe('Items', () => {
  function test(url) {
    return it('Resizing ' + url, () => {
      const rightResizerSelector =
        '.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-3"] .gstc__chart-timeline-items-row-item-resizing-handle--right';
      let api: Api;
      let state: DeepState<GSTCState>;
      cy.visit(url)
        .window()
        .then((win) => {
          // @ts-ignore
          api = win.gstc.api;
          // @ts-ignore
          state = win.state;
          const item = api.getItem('gstcid-3');
          api.scrollToTime(item.time.start, false);
          expect(state.get('$data.chart.time.leftGlobal')).to.eq(item.time.start);
          const itemData = api.getItemData('gstcid-3');
          expect(itemData.position.left).to.eq(0);
          expect(itemData.width).to.be.greaterThan(0);
        })
        .wait(1)
        .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-3"]')
        .then(($el) => {
          const itemData: ItemData = api.getItemData('gstcid-3');
          const itemDataWidth = fixed(itemData.width);
          const elementWidth = fixed($el.css('width'));
          expect(itemDataWidth).to.eq(elementWidth);
          expect(itemDataWidth).to.be.greaterThan(0);
          expect(itemData.position.right);
          expect(fixed($el.css('left'))).to.eq(0);
          api.plugins.Selection.selectItems(['gstcid-3']);
          return $el;
        })
        .wait(1)
        .then(($el) => {
          expect($el).to.have.class('gstc__selected');
        })
        .get(rightResizerSelector)
        .should('be.visible')
        .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-3"]')
        .then(($el) => {
          return cy.move(rightResizerSelector, -$el.width(), 0);
        })
        .then(() => {
          const itemData: ItemData = state.get('$data.chart.items.gstcid-3');
          api.scrollToTime(itemData.time.startDate.valueOf(), false);
        })
        .wait(1)
        .then(() => {
          const itemData: ItemData = state.get('$data.chart.items.gstcid-3');
          const time: DataChartTime = state.get('$data.chart.time');
          const firstDate = time.levels[time.level][0];
          if (url === '/examples/complex-1/index.html') {
            const spacing: number = state.get('config.chart.spacing');
            expect(fixed(itemData.actualWidth + spacing)).to.eq(fixed(firstDate.currentView.width));
          }
          if (url === '/examples/item-types-plugin/index.html') {
            const minWidth: number = state.get('config.chart.item.minWidth');
            expect(fixed(itemData.actualWidth)).to.eq(fixed(minWidth));
          }
        })
        .get('.gstc__chart-timeline-items-row-item-resizing-handle--right-outside[data-gstcid="gstcid-3"]')
        .should('be.visible');
    });
  }

  test('/examples/complex-1/index.html');
  test('/examples/item-types-plugin/index.html');
});
