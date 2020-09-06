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

Cypress.Commands.add('checkQuantityInput', (quantity) => {
  cy.get('input[name="quantity"]').clear().type(quantity);
  cy.get('button:contains("+")').click();
  cy.get('input[name="quantity"]').should('have.value', (quantity + 1).toString());
  cy.get('button:contains("-")').click();
  cy.get('input[name="quantity"]').should('have.value', quantity.toString());
});

Cypress.Commands.add('login', (email, pw) => {
  cy.server().route('POST', '/login').as('userLogin');

  cy.get('a.nav-link[data-cypress="navlink-login"]').click();
  cy.get('[data-cypress="modal-login-title"]').should('exist');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(pw);
  cy.get('input[type=submit]').click();
  cy.wait('@userLogin').its('status').should('equal', 200);
  cy.get('[data-cypress="navlink-logout"]').should('exist');
  cy.get('[data-cypress="navlink-login"]').should('not.exist');
  cy.get('[data-cypress="navlink-registration"]').should('not.exist');
});

Cypress.Commands.add('logout', (email, pw) => {
  cy.get('a.nav-link[data-cypress="navlink-logout"]').click();
  cy.get('.alert').should('exist').should('have.class', 'alert-success');
  cy.get('a.nav-link[data-cypress="navlink-logout"]').should('not.exist');
  cy.get('a.nav-link[data-cypress="navlink-login"]').should('exist');
});

Cypress.Commands.add('openThingList', (email, pw) => {
  cy.server().route({method: 'GET', url: '/things'}).as('thingsList');
  cy.server().route({method:'GET', url: '/things/**'}).as('thingsDetail');

  cy.get('a.nav-link[data-cypress="thing-list"]').click();
  cy.wait('@thingsList').its('status').should('equal', 200);
  cy.get('[data-cypress="thing-item"]').should('have.length.greaterThan', 10);
});

Cypress.Commands.add('openCommitModal', (email, pw) => {
  cy.openThingList();
  cy.get('h5.card-title').first().click();
  cy.wait('@thingsDetail').its('status').should('equal', 200);
  cy.get('.map-marker-order').first().click({force: true});
  cy.get('.leaflet-popup-content').get('[data-cypress="thing-confirmed"]').should('exist');
  cy.get('.leaflet-popup-content').get('[data-cypress="thing-needed"]').should('exist');
  cy.get('.btn[data-cypress="confirm-commitment"]').click();
});

Cypress.Commands.add('openOrderModal', (email, pw) => {
  cy.openThingList();
  cy.get('h5.card-title').first().click();
  cy.wait('@thingsDetail').its('status').should('equal', 200);
  cy.get('button[data-cypress="place-order"]').click();
});

Cypress.Commands.add('resetPassword', (email, newPassword) => {
  cy.visit('/');

  //clear maildev inbox
  cy.request('DELETE', 'http://localhost:1080/email/all');

  cy.get('a.nav-link[data-cypress="navlink-login"]').click();
  cy.get('[data-cypress="modal-login-title"]').should('exist');
  cy.get('[data-cypress="modal-login-reset-password"]').click();
  cy.get('[data-cypress="modal-request-password-reset-title"]').should('exist');
  cy.get('input[name=email]').type(email);
  cy.get('input[type=submit]').click();
  cy.get('.alert').should('exist').should('have.class', 'alert-success');
  cy.request('GET', 'http://localhost:1080/email').then(res => {
    const email = res.body[0];
    expect(email.subject).to.equal('print4health - Passwort zurücksetzen');
    expect(email.html).to.contain('Bitte nutze folgenden Link um ein neues Passwort zu vergeben:');
    const url = email.html.match(/(https?:\/\/[^\s]+\/reset-password\/[0-9a-f\-]+)/g)[0];
    cy.visit(url);
    cy.get('input[name=password]').type(newPassword);
    cy.get('input[name=repeatPassword]').type(newPassword);
    cy.get('input[type=submit]').click();
    cy.get('.alert').should('exist').should('have.class', 'alert-success');
  });
});

Cypress.Commands.add('openDashboard', (email, pw) => {
  // cypress does not allow fetch/await at the moment :/
  // cy.server().route({method: 'GET', url: '/user/orders'}).as('orderList');

  cy.get('a.nav-link[data-cypress="navlink-dashboard"]').click();
  cy.get('h1[data-cypress="dashboard-title"]').should('exist');
  //cy.wait('@orderList').its('status').should('be', 200);
});
