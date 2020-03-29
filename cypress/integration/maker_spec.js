describe('maker workflow', function () {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });
  it('go to homepage', function () {
    cy.visit('http://192.168.222.12');
  });
  it('login as maker', function () {
    cy.login('maker@print4health.org', 'test');
  });
  it('commit to order', function () {
    cy.openCommitModal();
    cy.checkQuantityInput(50);
    cy.get('button:contains("Herstellung zusagen")').click();
    cy.scrollTo('top');
    cy.get('.alert-success').contains('alertDanke für Deinen Beitrag - ist notiert.');
  });
  it('check that order-modal only displays infotext', function () {
    cy.openOrderModal();
    cy.get('input[value=OK]').click();
  });
  it('logout', function () {
    cy.logout();
  });
});
