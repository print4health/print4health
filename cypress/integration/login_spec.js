describe('login as requester', function () {
  it('open login modal', function () {
    cy.visit('http://localhost');
    cy.get('a.nav-link:contains("Anmelden")').click();
    cy.contains('Anmeldung bei print4health');
  });
  it('login as requester', function () {
    cy.get('input[name=email]').type('requester@print4health.org');
    cy.get('input[name=password]').type('test');
    cy.get('input[type=submit]').click();
    cy.contains('Herzlich Willkommen requester@print4health.org');
  });
  it('logout', function () {
    cy.get('a.nav-link:contains("Abmelden")').click();
    cy.contains('erfolgreich abgemeldet.');
  });
});
