import { GridRows } from '../../dist/gstc';

describe('Add rows & items', () => {
  it('should add rows and display grid properly', () => {
    let state;
    cy.load('/examples/add-rows-items')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
      })
      .then(() => {
        const gridRows: GridRows = state.get('$data.chart.grid.rows');
        const keys = Object.keys(gridRows);
        expect(keys.length).to.eq(11);
        expect(Object.keys(gridRows[keys[0]].cells).length).to.be.greaterThan(0);
      }).get('.gstc__chart-timeline-grid-row-cell').should('be.visible')
      .get('#add-rows').click().wait(Cypress.env('wait'))
      .then(() => {
        const gridRows: GridRows = state.get('$data.chart.grid.rows');
        const keys = Object.keys(gridRows);
        expect(keys.length).to.eq(11);
        expect(Object.keys(gridRows[keys[0]].cells).length).to.be.greaterThan(0);
      }).get('.gstc__chart-timeline-grid-row-cell').should('be.visible');
  });
});
