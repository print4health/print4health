describe('maker workflow', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });
  it('go to homepage', () => {
    cy.visit('/');
  });
  it('login as maker', () => {
    cy.login('maker@print4health.org', 'test');
  });
  it('commit to order', () => {
    cy.openCommitModal();
    cy.checkQuantityInput(50);
    cy.get('[data-cypress="modal-commitment-submit"]').click();
    cy.scrollTo('top');
    cy.get('.alert').should('exist').should('have.class', 'alert-success')
  });
  it('check that order-modal only displays infotext', () => {
    cy.openOrderModal();
    cy.get('[data-cypress="modal-order-info"]').should('exist');
    cy.get('[data-cypress="modal-order-submit"]').should('not.exist');
    cy.get('[data-cypress="modal-order-close"]').click();
  });
  it('check dashboard', () => {
    cy.openDashboard();
    cy.wait(1000).get('[data-cypress="dashboard-order-row"]').should('have.length.greaterThan', 1);
  });
  it('logout', () => {
    cy.logout();
  });
  it('reset password', () => {
    cy.resetPassword('maker@print4health.org', 'my new password');
  });
});
