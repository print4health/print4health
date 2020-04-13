describe('anonymous workflow', function () {
  beforeEach(function () {
    Cypress.Cookies.preserveOnce('PHPSESSID');
  });
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('check that commit-modal only displays infotext', function () {
    cy.openCommitModal();
    cy.get('[data-cypress="modal-commitment-title-form"]').should('not.exist');
    cy.get('[data-cypress="modal-commitment-submit"]').should('not.exist');
    cy.get('[data-cypress="modal-commitment-close"]').click();
  });
  it('check that order-modal only displays infotext', function () {
    cy.openOrderModal();
    cy.get('[data-cypress="modal-order-info"]').should('exist');
    cy.get('[data-cypress="modal-order-submit"]').should('not.exist');
    cy.get('[data-cypress="modal-order-close"]').click();
  });
});
