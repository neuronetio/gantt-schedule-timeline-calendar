// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const horizontalScrollBarSelector = '.gstc__scroll-bar-inner--horizontal';
const verticalScrollBarSelector = '.gstc__scroll-bar-inner--vertical';

Cypress.Commands.add('scrollH', (movementX) => {
  return cy
    .get(horizontalScrollBarSelector)
    .then(($el) => {
      const offset = $el.offset();
      cy.get(horizontalScrollBarSelector)
        .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
        .trigger('pointermove', {
          screenX: offset.left + 10 + movementX,
          screenY: offset.top + 10,
        })
        .trigger('pointerup');
    })
    .wait(10);
});

Cypress.Commands.add('scrollV', (movementY) => {
  return cy
    .get(verticalScrollBarSelector)
    .then(($el) => {
      const offset = $el.offset();
      cy.get(verticalScrollBarSelector)
        .trigger('pointerdown', { screenX: offset.left + 10, screenY: offset.top + 10 })
        .trigger('pointermove', {
          screenX: offset.left + 10,
          screenY: offset.top + 10 + movementY,
        })
        .trigger('pointerup');
    })
    .wait(10);
});

Cypress.Commands.add('move', (selector, movementX, movementY) => {
  return cy
    .get(selector)
    .then(($el) => {
      const offset = $el.offset();
      const width = $el.width();
      const height = $el.height();
      cy.get(selector)
        .get('body')
        .trigger('pointerdown', {
          //screenX: Math.floor(offset.left + width / 2),
          //clientX: Math.floor(offset.left + width / 2),
          //offsetX: Math.floor(offset.left + width / 2),
          x: Math.floor(offset.left + width / 2),
          //screenY: Math.floor(offset.top + height / 2),
          //clientY: Math.floor(offset.top + height / 2),
          //offsetY: Math.floor(offset.top + height / 2),
          y: Math.floor(offset.top + height / 2),
        })
        .trigger('pointermove', {
          // screenX: Math.floor(offset.left + width / 2) + movementX,
          // offsetX: Math.floor(offset.left + width / 2) + movementX,
          // pageX: Math.floor(offset.left + width / 2) + movementX,
          x: Math.floor(offset.left + width / 2),
          // screenY: Math.floor(offset.top + height / 2) + movementY,
          // offsetY: Math.floor(offset.top + height / 2) + movementY,
          // pageY: Math.floor(offset.top + height / 2) + movementY,
          y: Math.floor(offset.top + height / 2),
        })
        .trigger('pointermove', {
          // screenX: Math.floor(offset.left + width / 2) + movementX,
          // offsetX: Math.floor(offset.left + width / 2) + movementX,
          // pageX: Math.floor(offset.left + width / 2) + movementX,
          x: Math.floor(offset.left + width / 2) + movementX,
          // screenY: Math.floor(offset.top + height / 2) + movementY,
          // offsetY: Math.floor(offset.top + height / 2) + movementY,
          // pageY: Math.floor(offset.top + height / 2) + movementY,
          y: Math.floor(offset.top + height / 2) + movementY,
        })
        .trigger('pointerup', {
          //screenX: Math.floor(offset.left + width / 2) + movementX,
          //offsetX: Math.floor(offset.left + width / 2) + movementX,
          x: Math.floor(offset.left + width / 2) + movementX,
          //screenY: Math.floor(offset.top + height / 2) + movementY,
          //offsetY: Math.floor(offset.top + height / 2) + movementY,
          y: Math.floor(offset.top + height / 2) + movementY,
        });
    })
    .wait(10);
});
