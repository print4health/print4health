describe('default user workflow', function () {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });
  it('go to homepage', function () {
    cy.visit('http://192.168.222.12');
  });
  it('login as default user', function () {
    cy.login('user@print4health.org', 'test');
  });
  it('check that commit-modal only displays infotext', function () {
    cy.openCommitModal();
    cy.get('input[value=OK]').click();
  });
  it('check that order-modal only displays infotext', function () {
    cy.openOrderModal();
    cy.get('input[value=OK]').click();
  });
  it('logout', function () {
    cy.logout();
  });
});
