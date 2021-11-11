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
  const coordinates = { screenX: 0, screenY: 0 };
  return cy
    .get(horizontalScrollBarSelector)
    .then(($el) => {
      const offset = $el.offset();
      const width = $el.width();
      const height = $el.height();
      coordinates.screenX += Math.floor(offset.left + width / 2);
      coordinates.screenY += Math.floor(offset.top + height / 2);
    })
    .get(horizontalScrollBarSelector)
    .trigger('pointerdown', coordinates)
    .then(() => {
      coordinates.screenX += +movementX;
    })
    .trigger('pointermove', coordinates)
    .trigger('pointerup', coordinates)
    .wait(50);
});

Cypress.Commands.add('scrollV', (movementY) => {
  const coordinates = {
    screenX: 10,
    screenY: 10,
  };
  return cy
    .get(verticalScrollBarSelector)
    .then(($el) => {
      const offset = $el.offset();
      const width = $el.width();
      const height = $el.height();
      coordinates.screenX += Math.floor(offset.left + width / 2);
      coordinates.screenY += Math.floor(offset.top + height / 2);
    })
    .get(verticalScrollBarSelector)
    .trigger('pointerdown', coordinates)
    .then(() => {
      coordinates.screenY += movementY;
    })
    .trigger('pointermove', coordinates)
    .trigger('pointerup', coordinates)
    .wait(50);
});

Cypress.Commands.add('move', (selector, movementX, movementY) => {
  const coordinates = {
    x: 0,
    y: 0,
  };
  return cy
    .get(selector)
    .then(($el) => {
      const offset = $el.offset();
      const width = $el.width();
      const height = $el.height();
      coordinates.x += Math.floor(offset.left + width / 2);
      coordinates.y += Math.floor(offset.top + height / 2);
    })
    .get(selector)
    .get('body')
    .trigger('pointerdown', coordinates)
    .trigger('pointermove', coordinates)
    .then(() => {
      coordinates.x += movementX;
      coordinates.y += movementY;
    })
    .trigger('pointermove', coordinates)
    .trigger('pointerup', coordinates)
    .wait(50);
});
