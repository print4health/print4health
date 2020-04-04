describe('anonymous workflow', function () {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });
  it('go to homepage', function () {
    cy.visit(Cypress.env().baseUrl);
  });
  it('check that commit-modal only displays infotext', function () {
    cy.openCommitModal();
    cy.get('input[value=Schließen]').click();
  });
  it('check that order-modal only displays infotext', function () {
    cy.openOrderModal();
    cy.get('input[value=Schließen]').click();
  });
});
