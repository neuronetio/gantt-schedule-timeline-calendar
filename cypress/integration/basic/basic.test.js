/// <reference types="Cypress" />
describe('Basic', () => {
  it('Simple ESM', () => {
    cy.visit('http://localhost:8080/examples/simple/simple.esm.html');
    cy.get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label');
  });

  it('Simple UMD', () => {
    cy.visit('http://localhost:8080/examples/simple/simple.umd.html');
    cy.get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-1"] .gstc__chart-timeline-items-row-item-label');
  });
});
