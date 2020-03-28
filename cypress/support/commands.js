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
