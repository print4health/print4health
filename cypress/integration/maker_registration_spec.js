describe('maker registration workflow', function () {
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('register as maker', () => {
    cy.get('a.nav-link:contains("Registrieren")').click();
    cy.contains('Maker Registrierung');
    cy.get('input[name=name]').type('Maky McMaker');
    cy.get('input[name=email]').type('maky@example.org');
    cy.get('input[name=password]').type('my very secure pw');
    cy.get('input[name=passwordRepeat]').type('my very secure pw');
    cy.get('input[name=postalCode]').type('12345');
    cy.get('input[name=addressState]').type('Deutschland');
    cy.get('label[for=confirmedRuleForFree]').click();
    cy.get('label[for=confirmedRuleMaterialAndTransport]').click();
    cy.get('label[for=confirmedPlattformIsContactOnly]').click();
    cy.get('label[for=confirmedNoAccountability]').click();
    cy.get('label[for=confirmedPersonalDataTransferToRequester]').click();
    cy.get('button[type=submit]').click();
    cy.contains('Registrierung erfolgreich!');
  });
});
