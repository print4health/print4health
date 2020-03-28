describe('requester workflow', function () {

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });

  it('login as requester', function () {
    cy.visit('http://localhost');
    cy.login('requester@print4health.org', 'test');
  });
  it('go to thing list', function () {
    cy.get('a.nav-link:contains("Bedarf")').click();
    cy.title().should('eq', 'print4health - Bedarf & Ersatzteile');
  });
  it('go to thing detail page', function () {
    cy.get('h5:contains("COVID-19 MASK")').click();
    cy.title().should('eq', 'print4health - Bedarf / COVID-19 MASK');
  });
  it('open order modal', function () {
    cy.get('.fa-plus-circle.text-primary').click();
    cy.contains('Bedarf für "COVID-19 MASK" eintragen');
  });
  it('place order', function () {
    cy.get('button:contains("+")').click();
    cy.get('button:contains("Bedarf eintragen")').click();
    cy.scrollTo('top');
    cy.get('.alert-success').contains('Danke, der Bedarf wurde eingetragen');
  });
  it('click map marker', function () {
    cy.get('.map-marker-order i').first().click();
    cy.get('.leaflet-popup-content').contains('Herstellung zusagen');
  });
  it('click commit button', function () {
    cy.get('a.btn:contains("Herstellung zusagen")').click();
  });
  it('close info modal', function () {
    cy.get('input[value=OK]').click();
  });
  it('logout', function () {
    cy.logout();
  });
});
