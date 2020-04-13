describe('maker registration workflow', function () {
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('register as maker', () => {
    cy.get('a.nav-link[data-cypress="navlink-registration"]').click();
    cy.get('h1[data-cypress="registration-index-title"]').should('exist');
    cy.get('a.btn[data-cypress="registration-requester-link"]').should('exist');
    cy.get('a.btn[data-cypress="registration-hub-link"]').should('exist');
    cy.get('a.btn[data-cypress="registration-maker-link"]').click();
    cy.get('h1[data-cypress="registration-maker-title"]').should('exist');
    cy.get('input[name=name]').type('Maky McMaker');
    cy.get('input[name=email]').type('maky@example.org');
    cy.get('input[name=password]').type('my very secure pw');
    cy.get('input[name=passwordRepeat]').type('my very secure pw');
    cy.get('input[name=postalCode]').type('12345');
    cy.get('[name=addressState]').select('DE');
    cy.get('label[for=confirmedRuleForFree]').click();
    cy.get('label[for=confirmedRuleMaterialAndTransport]').click();
    cy.get('label[for=confirmedPlattformIsContactOnly]').click();
    cy.get('label[for=confirmedNoAccountability]').click();
    cy.get('label[for=confirmedPersonalDataTransferToRequester]').click();
    cy.get('button[type=submit]').click();
    cy.get('[data-cypress="registration-maker-success"]').should('exist');
  });
});
