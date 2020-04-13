describe('requester registration workflow', function () {
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('register as requester', () => {
    cy.get('a.nav-link[data-cypress="navlink-registration"]').click();
    cy.get('h1[data-cypress="registration-index-title"]').should('exist');
    // check both links to requester-registration
    cy.get('a.btn[data-cypress="registration-requester-link"]').click();
    cy.get('[data-cypress="registration-requester-title"]').should('exist');
    // click on navigation again
    cy.get('a.nav-link[data-cypress="navlink-registration"]').click();
    cy.get('a.btn[data-cypress="registration-hub-link"]').click();
    cy.get('[data-cypress="registration-requester-title"]').should('exist');
    // fill form
    cy.get('input[name=name]').type('Requesterr McRequester');
    cy.get('input[name=email]').type('requester@example.org');
    cy.get('input[name=password]').type('my very secure pw');
    cy.get('input[name=passwordRepeat]').type('my very secure pw');
    cy.get('input[name=addressStreet]').type('Teststreet 123');
    cy.get('input[name=postalCode]').type('12345');
    cy.get('input[name=addressCity]').type('Testcity');
    cy.get('[name=addressState]').select('DE');
    cy.get('textarea[name=contactInfo]').type('Lorem Ipsum dolor set amed');
    cy.get('[name=institutionType]').select('HOSPITAL');
    cy.get('textarea[name=description]').type('Lorem Ipsum dolor set amed');
    cy.get('label[for=confirmedPlattformIsContactOnly]').click();
    cy.get('label[for=confirmedNoAccountability]').click();
    cy.get('label[for=confirmedNoCertification]').click();
    cy.get('label[for=confirmedNoAccountabiltyForMediation]').click();
    cy.get('label[for=confirmedRuleMaterialAndTransport]').click();
    cy.get('button[type=submit]').click();
    cy.get('.alert').should('exist').should('have.class', 'alert-success')
  });
});
