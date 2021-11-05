/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    scrollH: (movementX: number) => Chainable<any>;
    scrollV: (movementY: number) => Chainable<any>;
    move: (selector: string, movementX: number, movementY: number) => Chainable<any>;
  }
}
