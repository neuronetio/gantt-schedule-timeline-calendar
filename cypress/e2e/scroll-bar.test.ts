import DeepState from 'deep-state-observer';
import { Data, DataChartDimensions, DataChartTime, DataScrollHorizontal } from '../../dist/gstc';
import { round } from '../helpers';

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
        expect(round(v.handlePosPx)).to.eq(round($vertical.css('top')));
        expect(round(h.handlePosPx)).to.eq(round($horizontal.css('left')));
        expect(round(v.innerHandleSize)).to.eq(round($vertical.height()));
        expect(round(h.innerHandleSize)).to.eq(round($horizontal.width()));
        expect(round(state.get('$data.chart.dimensions.widthWithoutScrollBar'))).to.eq(round(h.scrollSize));
        expect(round(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(round(v.scrollSize));
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
        expect(round(v.handlePosPx)).to.eq(round($vertical.css('top')));
        expect(round(h.handlePosPx)).to.eq(round($horizontal.css('left')));
        expect(round(v.innerHandleSize)).to.eq(round($vertical.height()));
        expect(round(h.innerHandleSize)).to.eq(round($horizontal.width()));
        expect(round(state.get('$data.chart.dimensions.widthWithoutScrollBar'))).to.eq(round(h.scrollSize));
        expect(round(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(round(v.scrollSize));
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
        expect(round(scrollData.handlePosPx)).to.eq(round($scroll.css('left')));
        expect(round(scrollData.innerHandleSize)).to.eq(round($scroll.width()));
        expect(round(state.get('$data.chart.dimensions.widthWithoutScrollBar'))).to.eq(round(scrollData.scrollSize));
        expect(scrollData.preciseOffset).to.be.lessThan(0);
      })
      .scrollV(-20)
      .then(() => {
        const $scroll = Cypress.$(verticalScrollBarSelector);
        const scrollData = state.get('$data.scroll.vertical');
        expect(round(scrollData.handlePosPx)).to.eq(round($scroll.css('top')));
        expect(round(scrollData.innerHandleSize)).to.eq(round($scroll.height()));
        expect(round(state.get('$data.chart.dimensions.heightWithoutScrollBar'))).to.eq(round(scrollData.scrollSize));
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
        expect(round($el.position().left)).to.eq(round(date.currentView.leftPx));
      })
      .then(() => {
        gstc.api.scrollToTime(scrollTo.valueOf(), false);
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-5"]')
      .should('be.visible')
      .then(($el) => {
        const date = gstc.api.time.findDateAtTime(scrollTo.valueOf());
        expect(round($el.position().left)).to.eq(round(date.currentView.leftPx));
      });
  });

  it('should update scroll bar position and size when changing zoom', () => {
    let gstc, state, innerSize, handlePosPx;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        const horizontal = state.get('$data.scroll.horizontal') as DataScrollHorizontal;
        innerSize = horizontal.innerHandleSize;
        expect(innerSize).to.be.greaterThan(0);
        gstc.api.scrollToTime(gstc.api.time.date('2020-02-20'), false);
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        handlePosPx = state.get('$data.scroll.horizontal.handlePosPx');
        state.update('config.chart.time.zoom', 18);
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__scroll-bar-inner--horizontal')
      .then(($scrollBarInner) => {
        const horizontal = state.get('$data.scroll.horizontal') as DataScrollHorizontal;
        const actualSize = horizontal.innerHandleSize;
        expect(round(actualSize)).not.to.eq(round(innerSize));
        expect(round(horizontal.handlePosPx)).not.to.eq(round(handlePosPx));
        expect($scrollBarInner.get(0).offsetLeft).to.eq(Math.round(horizontal.handlePosPx));
      });
  });

  it('should hide scroll bar when calculatedZooMode is enabled', () => {
    let gstc, state;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
      })
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = true;
          time.from = gstc.api.time.date('2020-01-01').valueOf();
          time.to = gstc.api.time.date('2020-01-31').valueOf();
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__scroll-bar--horizontal')
      .should('not.exist');
  });

  it('should hide scroll bar when calculatedZooMode is enabled and switching back and forth', () => {
    let gstc, state;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
      })
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = true;
          time.from = gstc.api.time.date('2020-01-01').valueOf();
          time.to = gstc.api.time.date('2020-01-31').valueOf();
          time.zoom = 20;
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__scroll-bar--horizontal')
      .should('not.exist')
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = false;
          time.from = gstc.api.time.date('2020-01-01').valueOf();
          time.to = gstc.api.time.date('2020-01-31').valueOf();
          time.zoom = 20;
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__scroll-bar--horizontal')
      .should('exist')
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = false;
          time.from = gstc.api.time.date('2020-01-01').valueOf();
          time.to = gstc.api.time.date('2020-03-31').valueOf();
          time.zoom = 20;
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__scroll-bar--horizontal')
      .should('exist')
      .then(() => {
        state.update('config.chart.time', (time) => {
          time.calculatedZoomMode = true;
          time.from = gstc.api.time.date('2020-01-01').valueOf();
          time.to = gstc.api.time.date('2020-01-31').valueOf();
          time.zoom = 20;
          return time;
        });
      })
      .wait(Cypress.env('wait'))
      .get('.gstc__scroll-bar--horizontal')
      .should('not.exist');
  });

  it('should update right global date when scroll to time centered happened', () => {
    let gstc, state;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
        gstc.api.scrollToTime(gstc.api.time.date('2020-02-05').valueOf());
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const dataTime: DataChartTime = state.get('$data.chart.time');
        expect(round(dataTime.rightPx)).to.eq(round(dataTime.width));
      });
  });

  it('should scroll to center', () => {
    let gstc, state;
    cy.load('/examples/complex-1')
      .window()
      .then((win) => {
        // @ts-ignore
        gstc = win.gstc;
        // @ts-ignore
        state = win.state;
        gstc.api.scrollToTime(gstc.api.time.date('2020-02-18 12:00:00').valueOf());
      })
      .wait(Cypress.env('wait'))
      .then(() => {
        const dataTime: DataChartTime = state.get('$data.chart.time');
        expect(dataTime.centerGlobalDate.format('YYYY-MM-DD')).to.eq('2020-02-18');
      });
  });
});
