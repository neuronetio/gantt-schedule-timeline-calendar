import DeepState from 'deep-state-observer';
import { GSTCState } from '../../dist/gstc';
import { fixed } from '../helpers';

function getColumns(state) {
  const id = state.get('config.list.columns.data.gstcid-id');
  const name = state.get('config.list.columns.data.gstcid-name');
  const surname = state.get('config.list.columns.data.gstcid-surname');
  const progress = state.get('config.list.columns.data.gstcid-progress');
  return { id, name, surname, progress };
}

describe('List columns toggle', () => {
  it('should toggle columns', () => {
    let state: DeepState<GSTCState>;
    cy.visit('/examples/list-columns-toggle')
      .wait(500)
      .window()
      .then((win) => {
        // @ts-ignore
        state = win.state;
        const { id, name, surname, progress } = getColumns(state);
        expect(id.width).to.eq(80);
        expect(name.width).to.eq(230);
        expect(surname.width).to.eq(230);
        expect(progress.width).to.eq(50);
      })
      .get('.gstc__list-column-header[data-gstcid="gstcid-id"]')
      .should('be.visible')
      .get('.gstc__list-column-header[data-gstcid="gstcid-name"]')
      .should('be.visible')
      .get('.gstc__list-column-header[data-gstcid="gstcid-surname"]')
      .should('be.visible')
      .get('.gstc__list-column-header[data-gstcid="gstcid-progress"]')
      .should('be.visible')
      .get('.gstc__list')
      .then(($el) => {
        const { id, name, surname, progress } = getColumns(state);
        expect(id.hidden).to.eq(false);
        expect(name.hidden).to.eq(false);
        expect(surname.hidden).to.eq(false);
        expect(progress.hidden).to.eq(false);
        expect(fixed($el.width())).to.eq(fixed(id.width + name.width + surname.width + progress.width));
      })
      //
      .get('#id')
      .click()
      .get('.gstc__list-column-header[data-gstcid="gstcid-id"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-name"]')
      .should('be.visible')
      .get('.gstc__list-column-header[data-gstcid="gstcid-surname"]')
      .should('be.visible')
      .get('.gstc__list-column-header[data-gstcid="gstcid-progress"]')
      .should('be.visible')
      .get('.gstc__list')
      .then(($el) => {
        const { id, name, surname, progress } = getColumns(state);
        expect(id.hidden).to.eq(true);
        expect(name.hidden).to.eq(false);
        expect(surname.hidden).to.eq(false);
        expect(progress.hidden).to.eq(false);
        expect(fixed($el.width())).to.eq(fixed(name.width + surname.width + progress.width));
      })
      //
      .get('#name')
      .click()
      .get('.gstc__list-column-header[data-gstcid="gstcid-id"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-name"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-surname"]')
      .should('be.visible')
      .get('.gstc__list-column-header[data-gstcid="gstcid-progress"]')
      .should('be.visible')
      .get('.gstc__list')
      .then(($el) => {
        const { id, name, surname, progress } = getColumns(state);
        expect(id.hidden).to.eq(true);
        expect(name.hidden).to.eq(true);
        expect(surname.hidden).to.eq(false);
        expect(progress.hidden).to.eq(false);
        expect(fixed($el.width())).to.eq(fixed(surname.width + progress.width));
      })
      //
      .get('#surname')
      .click()
      .get('.gstc__list-column-header[data-gstcid="gstcid-id"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-name"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-surname"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-progress"]')
      .should('be.visible')
      .get('.gstc__list')
      .then(($el) => {
        const { id, name, surname, progress } = getColumns(state);
        expect(id.hidden).to.eq(true);
        expect(name.hidden).to.eq(true);
        expect(surname.hidden).to.eq(true);
        expect(progress.hidden).to.eq(false);
        expect(fixed($el.width())).to.eq(fixed(progress.width));
      })
      //
      .get('#progress')
      .click()
      .get('.gstc__list-column-header[data-gstcid="gstcid-id"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-name"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-surname"]')
      .should('not.exist')
      .get('.gstc__list-column-header[data-gstcid="gstcid-progress"]')
      .should('not.exist')
      .get('.gstc__list')
      .then(($el) => {
        const { id, name, surname, progress } = getColumns(state);
        expect(id.hidden).to.eq(true);
        expect(name.hidden).to.eq(true);
        expect(surname.hidden).to.eq(true);
        expect(progress.hidden).to.eq(true);
        expect(fixed($el.width())).to.eq(0);
      });
  });
});
