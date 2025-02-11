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

Cypress.Commands.add('load', (url: string) => {
  let loaded = false;
  function next(_cy) {
    return loaded
      ? _cy.wait(1)
      : _cy.wait(100).then(() => {
          return next(_cy);
        });
  }
  function waitForElement(win) {
    let parent = win.document.getElementById('gstc');
    if (!parent) parent = win.document.getElementById('app');
    if (!parent) {
      return setTimeout(() => {
        waitForElement(win);
      }, 10);
    }
    parent.addEventListener('gstc-loaded', (ev) => {
      loaded = true;
    });
    setTimeout(() => {
      if (!loaded) {
        loaded = true;
      }
    }, 2000);
  }
  return cy
    .visit(url, {
      onBeforeLoad: (win) => {
        waitForElement(win);
      },
    })
    .wait(10)
    .then(() => {
      return loaded ? cy : next(cy);
    });
});

Cypress.Commands.add('scrollH', (movementX) => {
  const coordinates = { pageX: 0, pageY: 0 };
  return cy
    .get(horizontalScrollBarSelector)
    .then(($el) => {
      const offset = $el.offset();
      const width = $el.width();
      const height = $el.height();
      coordinates.pageX += Math.floor(offset.left + width / 2);
      coordinates.pageY += Math.floor(offset.top + height / 2);
    })
    .get(horizontalScrollBarSelector)
    .trigger('pointerdown', coordinates)
    .then(() => {
      coordinates.pageX += +movementX;
    })
    .trigger('pointermove', coordinates)
    .trigger('pointerup', coordinates)
    .wait(Cypress.env('wait'))
    .then(() => {
      cy.log('scrollH finished');
    });
});

Cypress.Commands.add('scrollV', (movementY) => {
  const coordinates = {
    pageX: 10,
    pageY: 10,
  };
  return cy
    .get(verticalScrollBarSelector)
    .then(($el) => {
      const offset = $el.offset();
      const width = $el.width();
      const height = $el.height();
      coordinates.pageX += Math.floor(offset.left + width / 2);
      coordinates.pageY += Math.floor(offset.top + height / 2);
    })
    .get(verticalScrollBarSelector)
    .trigger('pointerdown', coordinates)
    .then(() => {
      coordinates.pageY += movementY;
    })
    .trigger('pointermove', coordinates)
    .trigger('pointerup', coordinates)
    .wait(Cypress.env('wait'))
    .then(() => {
      cy.log('scrollH finished');
    });
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
    .wait(Cypress.env('wait'))
    .then(() => {
      cy.log('move finished');
    });
});

Cypress.Commands.add('moveDirect', (selector, movementX, movementY) => {
  const coordinates = {
    x: 0,
    y: 0,
  };
  return cy
    .get(selector)
    .then(($el) => {
      const width = $el.width();
      const height = $el.height();
      coordinates.x += Math.floor(width / 2);
      coordinates.y += Math.floor(height / 2);
    })
    .get(selector)
    .trigger('pointerdown', coordinates)
    .trigger('pointermove', coordinates)
    .then(() => {
      coordinates.x += movementX;
      coordinates.y += movementY;
    })
    .trigger('pointermove', coordinates)
    .trigger('pointerup', coordinates)
    .wait(Cypress.env('wait'))
    .then(() => {
      cy.log('move finished');
    });
});
