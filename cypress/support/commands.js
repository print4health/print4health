const COMMAND_DELAY = 500;
// import { MailDev } from 'maildev';

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
  cy.server().route('GET', '/things/search/cane').as('thingsSearchCane');
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
  cy.get('button:contains("Bedarf anmelden")').click();
});

Cypress.Commands.add('resetPassword', (email, newPassword) => {
  cy.visit('http://192.168.222.12');

  //clear maildev inbox
  cy.request('DELETE', 'http://192.168.222.12:1080/email/all');

  cy.get('a.nav-link:contains("Anmelden")').click();
  cy.contains('Anmeldung bei print4health');
  cy.get('a:contains("Passwort vergessen?")').click();
  cy.contains('Passwort zurücksetzen');
  cy.get('input[name=email]').type(email);
  cy.get('input[type=submit]').click();
  cy.contains('Ein Link zum Zurücksetzen des Passworts wurde per email verschickt');
  cy.request('GET', 'http://192.168.222.12:1080/email').then(res => {
    const email = res.body[0];
    expect(email.subject).to.equal('print4health - Passwort zurücksetzen');
    expect(email.html).to.contain('Bitte nutzen Sie folgende URL um ein neues Passwort zu vergeben');
    const url = email.html.match(/(https?:\/\/[^\s]+)/g)[0];
    cy.visit(url);
    cy.get('input[name=password]').type(newPassword);
    cy.get('input[name=repeatPassword]').type(newPassword);
    cy.get('input[type=submit]').click();
    cy.contains('Das Passwort wurde erfolgreich geändert');
  });
});
