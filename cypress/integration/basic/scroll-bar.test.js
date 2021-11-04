/// <reference types="Cypress" />
describe('Scroll bar', () => {
  it('Movement (not precise)', () => {
    const horizontalScrollBarSelector = '.gstc__scroll-bar-inner--horizontal';
    const verticalScrollBarSelector = '.gstc__scroll-bar-inner--vertical';

    cy.visit('http://localhost:8080/examples/simple/simple.esm.html')
      .wait(500)
      .get(horizontalScrollBarSelector)
      .should(($el) => {
        expect($el.css('left')).to.eq('0px');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('horizontal', state.$data.scroll.horizontal);
        expect(state.$data.scroll.horizontal.absolutePosPx).to.eq(0);
        expect(state.$data.scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-1"]')
      .get(horizontalScrollBarSelector)
      .then(($el) => {
        const offset = $el.offset();

        cy.get(horizontalScrollBarSelector)
          .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 10,
          })
          .trigger('pointermove', {
            screenX: offset.left + 800,
            screenY: offset.top + 10,
          })
          .trigger('pointerup');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('horizontal', state.$data.scroll.horizontal);
        expect(state.$data.scroll.horizontal.absolutePosPx).to.be.greaterThan(0);
        expect(state.$data.scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get(verticalScrollBarSelector)
      .should(($el) => {
        expect($el.css('top')).to.eq('0px');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('vertical', state.$data.scroll.vertical);
        expect(state.$data.scroll.vertical.absolutePosPx).to.eq(0);
        expect(state.$data.scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get(verticalScrollBarSelector)
      .then(($el) => {
        const offset = $el.offset();

        cy.get(verticalScrollBarSelector)
          .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 10,
          })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 400,
          })
          .trigger('pointerup');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('vertical', state.$data.scroll.vertical);
        expect(state.$data.scroll.vertical.absolutePosPx).to.be.greaterThan(0);
        expect(state.$data.scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-12"]')
      .window()
      .then((win) => {
        const merge = win.gstc.api.mergeDeep;
        const state = merge({}, win.state.get());
        cy.log('state', state);
      })
      .window()
      .then((win) => {
        const merge = win.gstc.api.mergeDeep;
        const state = merge({}, win.state.get());
        const $vertical = Cypress.$(verticalScrollBarSelector);
        const $horizontal = Cypress.$(horizontalScrollBarSelector);
        const v = state.$data.scroll.vertical;
        const h = state.$data.scroll.horizontal;
        cy.log('vertical', v);
        cy.log('horizontal', h);
        expect(Math.floor(v.handlePosPx)).to.eq(Math.floor(parseInt($vertical.css('top'))));
        expect(Math.floor(h.handlePosPx)).to.eq(Math.floor(parseInt($horizontal.css('left'))));
        expect(Math.floor(v.innerHandleSize)).to.eq(Math.floor(parseInt($vertical.height())));
        expect(Math.floor(h.innerHandleSize)).to.eq(Math.floor(parseInt($horizontal.width())));
        expect(Math.floor(state.$data.chart.dimensions.innerWidth)).to.eq(Math.floor(h.scrollSize));
        expect(Math.floor(state.$data.chart.dimensions.heightWithoutScrollBar)).to.eq(Math.floor(v.scrollSize));
        expect(h.preciseOffset).to.eq(0);
        expect(v.preciseOffset).to.eq(0);
      });
  });

  it('Movement (precise)', () => {
    const horizontalScrollBarSelector = '.gstc__scroll-bar-inner--horizontal';
    const verticalScrollBarSelector = '.gstc__scroll-bar-inner--vertical';

    cy.visit('http://localhost:8080/examples/simple/simple.esm.html')
      .wait(500)
      .window()
      .then((win) => {
        win.state.update('config.scroll.horizontal.precise', true);
        win.state.update('config.scroll.vertical.precise', true);
      })
      .get(horizontalScrollBarSelector)
      .should(($el) => {
        expect($el.css('left')).to.eq('0px');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('horizontal', state.$data.scroll.horizontal);
        expect(state.$data.scroll.horizontal.absolutePosPx).to.eq(0);
        expect(state.$data.scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-1"]')
      .get(horizontalScrollBarSelector)
      .then(($el) => {
        const offset = $el.offset();
        cy.get(horizontalScrollBarSelector)
          .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 10,
          })
          .trigger('pointermove', {
            screenX: offset.left + 800,
            screenY: offset.top + 10,
          })
          .trigger('pointerup');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('horizontal', state.$data.scroll.horizontal);
        expect(state.$data.scroll.horizontal.absolutePosPx).to.be.greaterThan(0);
        expect(state.$data.scroll.horizontal.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get(verticalScrollBarSelector)
      .should(($el) => {
        expect($el.css('top')).to.eq('0px');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('vertical', state.$data.scroll.vertical);
        expect(state.$data.scroll.vertical.absolutePosPx).to.eq(0);
        expect(state.$data.scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get(verticalScrollBarSelector)
      .then(($el) => {
        const offset = $el.offset();
        cy.get(verticalScrollBarSelector)
          .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 10,
          })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 400,
          })
          .trigger('pointerup');
      })
      .window()
      .then((win) => {
        const state = { ...win.state.get() };
        cy.log('vertical', state.$data.scroll.vertical);
        expect(state.$data.scroll.vertical.absolutePosPx).to.be.greaterThan(0);
        expect(state.$data.scroll.vertical.maxHandlePosPx).to.be.greaterThan(0);
      })
      .get('.gstc__list-column-row[data-gstcid="gstcid-12"]')
      .window()
      .then((win) => {
        const merge = win.gstc.api.mergeDeep;
        const state = merge({}, win.state.get());
        cy.log('state', state);
      })
      .window()
      .then((win) => {
        const merge = win.gstc.api.mergeDeep;
        const state = merge({}, win.state.get());
        const $vertical = Cypress.$(verticalScrollBarSelector);
        const $horizontal = Cypress.$(horizontalScrollBarSelector);
        const v = state.$data.scroll.vertical;
        const h = state.$data.scroll.horizontal;
        cy.log('vertical', v);
        cy.log('horizontal', h);
        expect(Math.floor(v.handlePosPx)).to.eq(Math.floor(parseInt($vertical.css('top'))));
        expect(Math.floor(h.handlePosPx)).to.eq(Math.floor(parseInt($horizontal.css('left'))));
        expect(Math.floor(v.innerHandleSize)).to.eq(Math.floor(parseInt($vertical.height())));
        expect(Math.floor(h.innerHandleSize)).to.eq(Math.floor(parseInt($horizontal.width())));
        expect(Math.floor(state.$data.chart.dimensions.innerWidth)).to.eq(Math.floor(h.scrollSize));
        expect(Math.floor(state.$data.chart.dimensions.heightWithoutScrollBar)).to.eq(Math.floor(v.scrollSize));
        expect(h.preciseOffset).to.eq(0);
        expect(v.preciseOffset).to.eq(0);
      })
      //
      // preciseOffset
      //
      .get(horizontalScrollBarSelector)
      .then(($el) => {
        const offset = $el.offset();
        cy.get(horizontalScrollBarSelector)
          .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 10,
          })
          .trigger('pointermove', {
            screenX: offset.left - 10,
            screenY: offset.top + 10,
          })
          .trigger('pointerup');
      })
      .window()
      .then((win) => {
        const merge = win.gstc.api.mergeDeep;
        const state = merge({}, win.state.get());
        const $scroll = Cypress.$(horizontalScrollBarSelector);
        const scrollData = state.$data.scroll.horizontal;
        expect(Math.floor(scrollData.handlePosPx)).to.eq(Math.floor(parseInt($scroll.css('left'))));
        expect(Math.floor(scrollData.innerHandleSize)).to.eq(Math.floor(parseInt($scroll.width())));
        expect(Math.floor(state.$data.chart.dimensions.innerWidth)).to.eq(Math.floor(scrollData.scrollSize));
        expect(scrollData.preciseOffset).to.be.lessThan(0);
      })
      .get(verticalScrollBarSelector)
      .then(($el) => {
        const offset = $el.offset();
        cy.get(verticalScrollBarSelector)
          .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top + 10,
          })
          .trigger('pointermove', {
            screenX: offset.left + 10,
            screenY: offset.top - 10,
          })
          .trigger('pointerup');
      })
      .window()
      .then((win) => {
        const merge = win.gstc.api.mergeDeep;
        const state = merge({}, win.state.get());
        const $scroll = Cypress.$(verticalScrollBarSelector);
        const scrollData = state.$data.scroll.vertical;
        expect(Math.floor(scrollData.handlePosPx)).to.eq(Math.floor(parseInt($scroll.css('top'))));
        expect(Math.floor(scrollData.innerHandleSize)).to.eq(Math.floor(parseInt($scroll.height())));
        expect(Math.floor(state.$data.chart.dimensions.heightWithoutScrollBar)).to.eq(
          Math.floor(scrollData.scrollSize)
        );
        expect(scrollData.preciseOffset).to.be.lessThan(0);
      });
  });
});
