describe('search thing list', function () {
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('filter things', () => {
    cy.server().route('GET', '/things').as('thingsList');
    cy.server().route('GET', '/things/search/**').as('thingsSearch');

    cy.get('a.nav-link[data-cypress="thing-list"]').click();
    cy.wait('@thingsList').its('status').should('be', 200);
    cy.get('.ThingListCard').should('have.length', 16);

    cy.get('.Search input').type('cane');
    cy.wait('@thingsSearch').its('status').should('be', 200);
    cy.get('.ThingListCard').should('have.length', 1);

    cy.get('.Search input').clear();
    cy.wait('@thingsList').its('status').should('be', 200);
    cy.get('.ThingListCard').should('have.length', 16);
  });
});
