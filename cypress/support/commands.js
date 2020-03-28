const COMMAND_DELAY = 500;

for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal);
      }, COMMAND_DELAY);
    });
  });
}

Cypress.Commands.add('initApiRoutes', () => {
  cy.server().route('GET', '/things').as('thingsList');
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
  cy.get('.fa-plus-circle.text-primary').click();
});
