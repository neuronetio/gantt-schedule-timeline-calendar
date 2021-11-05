/// <reference types="Cypress" />
describe('Basic', () => {
  it('Simple ESM', () => {
    cy.visit('/examples/simple/simple.esm.html')
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label')
      .should(($el) => {
        expect($el.text()).to.eq('Item 1');
      })
      .window()
      .then((win) => {
        expect(win.state.get('config.chart.items.gstcid-1.label')).to.eq('Item 1');
        win.state.update('config.chart.items.gstcid-1.label', 'New label 1');
        expect(win.state.get('config.chart.items.gstcid-1.label')).to.eq('New label 1');
      })
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label')
      .should(($el) => {
        expect($el.text()).to.eq('New label 1');
      });
  });

  it('Simple UMD', () => {
    cy.visit('/examples/simple/simple.umd.html')
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label')
      .should(($el) => {
        expect($el.text()).to.eq('Item 1');
      })
      .window()
      .then((win) => {
        expect(win.state.get('config.chart.items.gstcid-1.label')).to.eq('Item 1');
        win.state.update('config.chart.items.gstcid-1.label', 'New label 1');
        expect(win.state.get('config.chart.items.gstcid-1.label')).to.eq('New label 1');
      })
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label')
      .should(($el) => {
        expect($el.text()).to.eq('New label 1');
      });
  });
});
