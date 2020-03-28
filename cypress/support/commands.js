Cypress.Commands.add('initApiRoutes', () => {
  cy.server().route('GET', '/things').as('thingsList');
  cy.server().route('GET', '/things/**').as('thingsDetail');
});

Cypress.Commands.add('checkQuantityInput', (quantity) => {
  cy.get('input[name="quantity"]').clear().type(quantity);
  cy.get('button:contains("+")').click();
  cy.get('input[name="quantity"]').should('have.value', (quantity + 1).toString());
  cy.get('button:contains("-")').click();
  cy.get('input[name="quantity"]').should('have.value', quantity.toString());
});

Cypress.Commands.add('login', (email, pw) => {
  cy.get('a.nav-link:contains("Anmelden")').click();
  cy.contains('Anmeldung bei print4health');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(pw);
  cy.get('input[type=submit]').click();
  cy.contains('Herzlich Willkommen ' + email);
});

Cypress.Commands.add('logout', (email, pw) => {
  cy.get('a.nav-link:contains("Abmelden")').click();
  cy.contains('erfolgreich abgemeldet.');
});

Cypress.Commands.add('openCommitModal', (email, pw) => {
  cy.initApiRoutes();
  cy.get('a.nav-link:contains("Bedarf")').click();
  cy.wait('@thingsList').its('status').should('be', 200);
  cy.title().should('eq', 'print4health - Bedarf & Ersatzteile');
  cy.get('h5.card-title').first().click();
  cy.wait('@thingsDetail').its('status').should('be', 200);
  cy.get('.map-marker-order i').first().click();
  cy.get('.leaflet-popup-content').contains('Herstellung zusagen');
  cy.get('a.btn:contains("Herstellung zusagen")').click();
});

Cypress.Commands.add('openOrderModal', (email, pw) => {
  cy.initApiRoutes();
  cy.get('a.nav-link:contains("Bedarf")').click();
  cy.wait('@thingsList').its('status').should('be', 200);
  cy.title().should('eq', 'print4health - Bedarf & Ersatzteile');
  cy.get('h5.card-title').first().click();
  cy.wait('@thingsDetail').its('status').should('be', 200);
  cy.get('.fa-plus-circle.text-primary').click();
});
