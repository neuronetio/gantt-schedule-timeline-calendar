import DeepState from 'deep-state-observer';
import { Data, DataChartDimensions } from '../../dist/gstc';
import { fixed } from '../helpers';

describe('Scroll bar', () => {
  it('Movement (not precise)', () => {
    const horizontalScrollBarSelector = '.gstc__scroll-bar-inner--horizontal';
    const verticalScrollBarSelector = '.gstc__scroll-bar-inner--vertical';
    let state: DeepState;
    let merge;

    cy.load('/examples/simple/simple.esm.html')
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
        const dimensions: DataChartDimensions = state.get('$data.chart.dimensions');
        cy.log('$data.scroll.horizontal', state.get('$data.scroll.horizontal'));
        cy.log('$data.chart.dimensions', dimensions);
        cy.log('widthWithoutScrollBar', dimensions.widthWithoutScrollBar);
      })
      .then(() => {
        const $data: Data = { ...state.get('$data') };
        expect($data.scroll.horizontal.absolutePosPx).to.eq(0);
        expect($data.scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
        expect($data.scroll.vertical.handlePosPx).to.eq(0);
        expect(isNaN($data.scroll.vertical.handlePosPx)).to.eq(false);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-1"]')
      .scrollH(800)
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
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.eq(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
        expect(isNaN(scroll.vertical.handlePosPx)).to.eq(false);
      })
      .scrollV(400)
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.be.greaterThan(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
        expect(isNaN(scroll.vertical.handlePosPx)).to.eq(false);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-12"]')
      .then(() => {
        cy.log('state', merge({}, state.get()));
      })
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
        expect(fixed(state.get('$data.chart.dimensions.widthWithoutScrollBar'))).to.eq(fixed(h.scrollSize));
        expect(fixed(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(fixed(v.scrollSize));
        expect(h.preciseOffset).to.eq(0);
        expect(v.preciseOffset).to.eq(0);
      });
  });

  it('Movement (precise)', () => {
    const horizontalScrollBarSelector = '.gstc__scroll-bar-inner--horizontal';
    const verticalScrollBarSelector = '.gstc__scroll-bar-inner--vertical';
    let state: DeepState;
    let merge;

    cy.load('/examples/simple/simple.esm.html')
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
      .wait(Cypress.env('wait'))
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('horizontal', scroll.horizontal);
        expect(scroll.horizontal.absolutePosPx).to.eq(0);
        expect(scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-1"]')
      .should('be.visible')
      .scrollH(800)
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
      .wait(Cypress.env('wait'))
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.eq(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
        expect(isNaN(scroll.vertical.handlePosPx)).to.eq(false);
      })
      .scrollV(400)
      .then(() => {
        const scroll = state.get('$data.scroll');
        cy.log('vertical', scroll.vertical);
        expect(scroll.vertical.absolutePosPx).to.be.greaterThan(0);
        expect(scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
        expect(isNaN(scroll.vertical.handlePosPx)).to.eq(false);
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
        expect(fixed(state.get('$data.chart.dimensions.widthWithoutScrollBar'))).to.eq(fixed(h.scrollSize));
        expect(fixed(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(fixed(v.scrollSize));
        expect(h.preciseOffset).to.eq(0);
        expect(v.preciseOffset).to.eq(0);
      })
      //
      // preciseOffset
      //
      .scrollH(-20)
      .then(() => {
        const $scroll = Cypress.$(horizontalScrollBarSelector);
        const scrollData = state.get('$data.scroll.horizontal');
        expect(fixed(scrollData.handlePosPx)).to.eq(fixed($scroll.css('left')));
        expect(fixed(scrollData.innerHandleSize)).to.eq(fixed($scroll.width()));
        expect(fixed(state.get('$data.chart.dimensions.widthWithoutScrollBar'))).to.eq(fixed(scrollData.scrollSize));
        expect(scrollData.preciseOffset).to.be.lessThan(0);
      })
      .scrollV(-20)
      .then(() => {
        const $scroll = Cypress.$(verticalScrollBarSelector);
        const scrollData = state.get('$data.scroll.vertical');
        expect(fixed(scrollData.handlePosPx)).to.eq(fixed($scroll.css('top')));
        expect(fixed(scrollData.innerHandleSize)).to.eq(fixed($scroll.height()));
        expect(fixed(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(fixed(scrollData.scrollSize));
        expect(scrollData.preciseOffset).to.be.lessThan(0);
      });
  });

  it('should scroll with api', () => {
    let gstc, scrollTo;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        scrollTo = gstc.api.time.date('2020-02-20');
        gstc.api.scrollToTime(scrollTo.valueOf());
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-5"]')
      .should('be.visible')
      .then(($el) => {
        const date = gstc.api.time.findDateAtTime(scrollTo.valueOf());
        expect(fixed($el.position().left)).to.eq(fixed(date.currentView.leftPx));
      })
      .then(() => {
        gstc.api.scrollToTime(scrollTo.valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-5"]')
      .should('be.visible')
      .then(($el) => {
        const date = gstc.api.time.findDateAtTime(scrollTo.valueOf());
        expect(fixed($el.position().left)).to.eq(fixed(date.currentView.leftPx));
      });
  });
});
