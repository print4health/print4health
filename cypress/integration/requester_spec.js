describe('requester workflow', function () {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('login as requester', function () {
    cy.login('requester@print4health.org', 'test');
  });
  it('place order', function () {
    cy.openOrderModal();
    cy.checkQuantityInput(50);
    cy.get('[data-cypress="modal-order-submit"]').click();
    cy.scrollTo('top');
    cy.get('.alert').should('exist').should('have.class', 'alert-success')
  });
  it('check that commit modal only displays info text', function () {
    cy.openCommitModal();
    cy.get('[data-cypress="modal-commitment-title-form"]').should('not.exist');
    cy.get('[data-cypress="modal-commitment-submit"]').should('not.exist');
    cy.get('[data-cypress="modal-commitment-close"]').click();
  });
  it('logout', function () {
    cy.logout();
  });
  it('reset password', () => {
    cy.resetPassword('requester@print4health.org', 'my new password');
  });
});
