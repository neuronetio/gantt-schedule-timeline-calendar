describe('Rows', () => {
  it('should hide items from collapsed rows', () => {
    let state, gstc;
    const toggleClass = '.gstc__list-column-row-expander-toggle[data-gstcid="gstcid-1"]';
    cy.load('/examples/one-month')
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        // @ts-ignore
        gstc = win.gstc;
        function getRandomFaceImage() {
          return `./faces/face-${Math.ceil(Math.random() * 50)}.jpg`;
        }
        const iterations = 100;
        const GSTCID = gstc.api.GSTCID;
        const rows = {};
        for (let i = 0; i < iterations; i++) {
          const id = GSTCID(String(i));
          rows[id] = {
            id,
            label: `John Doe ${i}`,
            parentId: i === 1 ? undefined : GSTCID(String(1)), //withParent ? GSTCID(String(i - 1)) : undefined,
            expanded: false,
            img: getRandomFaceImage(),
            progress: Math.floor(Math.random() * 100),
          };
        }
        state.update('config.list.rows', rows);
      })
      .wait(Cypress.env('wait'))
      .get(toggleClass)
      .click()
      .wait(Cypress.env('wait'))
      .click()
      .wait(Cypress.env('wait'))
      .move('.gstc__list-column-header-resizer-dots--gstcid-progress', 20, 0)
      .wait(Cypress.env('wait'))
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-2"]')
      .should('not.exist')
      .get('#btn-next-month')
      .click()
      .wait(300)
      .get('#btn-prev-month')
      .click()
      .wait(300)
      .get('.gstc__chart-timeline-items-row-item[data-gstcid="gstcid-2"]')
      .should('not.exist');
  });
});
