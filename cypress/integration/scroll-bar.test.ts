/// <reference types="Cypress" />

import DeepState from 'deep-state-observer';
import { GSTCState } from '../../dist/gstc';
import { fixed } from '../helpers';

describe('Scroll bar', () => {
  it('Movement (not precise)', () => {
    const horizontalScrollBarSelector = '.gstc__scroll-bar-inner--horizontal';
    const verticalScrollBarSelector = '.gstc__scroll-bar-inner--vertical';
    let state: DeepState<GSTCState>;
    let merge;

    cy.visit('/examples/simple/simple.esm.html')
      .wait(500)
      .get(horizontalScrollBarSelector)
      .should(($el) => {
        expect($el.css('left')).to.eq('0px');
      })
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        merge = win.gstc.api.mergeDeep;
        const $data = { ...state.get('$data') };
        cy.log('horizontal', $data.scroll.horizontal);
        expect($data.scroll.horizontal.absolutePosPx).to.eq(0);
        expect($data.scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-1"]')
      .scrollH(800)
      .window()
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('horizontal', scroll.horizontal);
        expect(scroll.horizontal.absolutePosPx).to.be.greaterThan(0);
        expect(scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get(verticalScrollBarSelector)
      .should(($el) => {
        expect($el.css('top')).to.eq('0px');
      })
      .window()
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.eq(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .scrollV(400)
      .window()
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.be.greaterThan(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-12"]')
      .window()
      .then(() => {
        cy.log('state', merge({}, state.get()));
      })
      .window()
      .then(() => {
        const $vertical = Cypress.$(verticalScrollBarSelector);
        const $horizontal = Cypress.$(horizontalScrollBarSelector);
        const v = merge({}, state.get('$data.scroll.vertical'));
        const h = merge({}, state.get('$data.scroll.horizontal'));
        cy.log('vertical', v);
        cy.log('horizontal', h);
        expect(fixed(v.handlePosPx)).to.eq(fixed($vertical.css('top')));
        expect(fixed(h.handlePosPx)).to.eq(fixed($horizontal.css('left')));
        expect(fixed(v.innerHandleSize)).to.eq(fixed($vertical.height()));
        expect(fixed(h.innerHandleSize)).to.eq(fixed($horizontal.width()));
        expect(fixed(state.get('$data.chart.dimensions.innerWidth'))).to.eq(fixed(h.scrollSize));
        expect(fixed(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(fixed(v.scrollSize));
        expect(h.preciseOffset).to.eq(0);
        expect(v.preciseOffset).to.eq(0);
      });
  });

  it('Movement (precise)', () => {
    const horizontalScrollBarSelector = '.gstc__scroll-bar-inner--horizontal';
    const verticalScrollBarSelector = '.gstc__scroll-bar-inner--vertical';
    let state: DeepState<GSTCState>;
    let merge;

    cy.visit('/examples/simple/simple.esm.html')
      .wait(500)
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        merge = win.gstc.api.mergeDeep;
        state.update('config.scroll.horizontal.precise', true);
        state.update('config.scroll.vertical.precise', true);
      })
      .get(horizontalScrollBarSelector)
      .should(($el) => {
        expect($el.css('left')).to.eq('0px');
      })
      .wait(1)
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('horizontal', scroll.horizontal);
        expect(scroll.horizontal.absolutePosPx).to.eq(0);
        expect(scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-1"]')
      .scrollH(800)
      .wait(1)
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('horizontal', scroll.horizontal);
        expect(scroll.horizontal.absolutePosPx).to.be.greaterThan(0);
        expect(scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get(verticalScrollBarSelector)
      .should(($el) => {
        expect($el.css('top')).to.eq('0px');
      })
      .wait(1)
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.eq(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .scrollV(400)
      .wait(1)
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.be.greaterThan(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-12"]')
      .then(() => {
        cy.log('state', merge({}, state.get()));
      })
      .then(() => {
        const $vertical = Cypress.$(verticalScrollBarSelector);
        const $horizontal = Cypress.$(horizontalScrollBarSelector);
        const scroll = state.get('$data.scroll');
        const v = scroll.vertical;
        const h = scroll.horizontal;
        cy.log('vertical', v);
        cy.log('horizontal', h);
        expect(fixed(v.handlePosPx)).to.eq(fixed($vertical.css('top')));
        expect(fixed(h.handlePosPx)).to.eq(fixed($horizontal.css('left')));
        expect(fixed(v.innerHandleSize)).to.eq(fixed($vertical.height()));
        expect(fixed(h.innerHandleSize)).to.eq(fixed($horizontal.width()));
        expect(fixed(state.get('$data.chart.dimensions.innerWidth'))).to.eq(fixed(h.scrollSize));
        expect(fixed(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(fixed(v.scrollSize));
        expect(h.preciseOffset).to.eq(0);
        expect(v.preciseOffset).to.eq(0);
      })
      //
      // preciseOffset
      //
      .scrollH(-20)
      .wait(1)
      .then(() => {
        const $scroll = Cypress.$(horizontalScrollBarSelector);
        const scrollData = state.get('$data.scroll.horizontal');
        expect(fixed(scrollData.handlePosPx)).to.eq(fixed($scroll.css('left')));
        expect(fixed(scrollData.innerHandleSize)).to.eq(fixed($scroll.width()));
        expect(fixed(state.get('$data.chart.dimensions.innerWidth'))).to.eq(fixed(scrollData.scrollSize));
        expect(scrollData.preciseOffset).to.be.lessThan(0);
      })
      .scrollV(-20)
      .wait(1)
      .then(() => {
        const $scroll = Cypress.$(verticalScrollBarSelector);
        const scrollData = state.get('$data.scroll.vertical');
        expect(fixed(scrollData.handlePosPx)).to.eq(fixed($scroll.css('top')));
        expect(fixed(scrollData.innerHandleSize)).to.eq(fixed($scroll.height()));
        expect(fixed(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(fixed(scrollData.scrollSize));
        expect(scrollData.preciseOffset).to.be.lessThan(0);
      });
  });
});
