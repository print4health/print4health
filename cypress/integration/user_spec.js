describe('default user workflow', function () {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });
  it('go to homepage', function () {
    cy.visit(Cypress.env().baseUrl);
  });
  it('login as default user', function () {
    cy.login('user@print4health.org', 'test');
  });
  it('check that commit-modal only displays infotext', function () {
    cy.openCommitModal();
    cy.get('input[value=Schließen]').click();
  });
  it('check that order-modal only displays infotext', function () {
    cy.openOrderModal();
    cy.get('input[value=Schließen]').click();
  });
  it('logout', function () {
    cy.logout();
  });
  it('reset password', () => {
    cy.resetPassword('user@print4health.org', 'my new password');
  });
});
