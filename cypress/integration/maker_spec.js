describe('maker workflow', function () {

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });

  it('open login modal', function () {
    cy.visit('http://localhost');
    cy.get('a.nav-link:contains("Anmelden")').click();
    cy.contains('Anmeldung bei print4health');
    cy.wait(500);
  });
  it('login as requester', function () {
    cy.get('input[name=email]').type('maker@print4health.org');
    cy.get('input[name=password]').type('test');
    cy.get('input[type=submit]').click();
    cy.contains('Herzlich Willkommen maker@print4health.org');
    cy.wait(500);
  });
  it('go to thing list', function () {
    cy.get('a.nav-link:contains("Bedarf")').click();
    cy.title().should('eq', 'print4health - Bedarf & Ersatzteile');
    cy.wait(500);
  });
  it('go to thing detail page', function () {
    cy.get('h5:contains("COVID-19 MASK")').click();
    cy.title().should('eq', 'print4health - Bedarf / COVID-19 MASK');
  });
  it('open order modal', function () {
    cy.get('.fa-plus-circle.text-primary').click();
    cy.wait(500);
    cy.contains('Bedarf für "COVID-19 MASK" eintragen');
  });
  it('check order modal displays only info text', function () {
    cy.get('input[value=OK]').click();
    cy.wait(500);
  });
  it('click map marker', function () {
    cy.get('.map-marker-order i').first().click();
    cy.get('.leaflet-popup-content').contains('Herstellung zusagen');
    cy.wait(500);
  });
  it('click commit button', function () {
    cy.get('a.btn:contains("Herstellung zusagen")').click();
    cy.wait(500);
  });
  it('close info modal', function () {
    cy.get('button:contains("+")').click();
    cy.get('button:contains("Herstellung zusagen")').click();
    cy.scrollTo('top');
    cy.get('.alert-success').contains('alertDanke für Deinen Beitrag - ist notiert.');
    cy.wait(500);
  });
  it('logout', function () {
    cy.get('a.nav-link:contains("Abmelden")').click();
    cy.contains('erfolgreich abgemeldet.');
    cy.wait(500);
  });
});
