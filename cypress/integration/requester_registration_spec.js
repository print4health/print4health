describe('requester registration workflow', function () {
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('register as requester', () => {
    cy.get('a.nav-link:contains("Registrieren")').click();
    cy.contains('Bei print4health registrieren');
    // check both links to requester-registration
    cy.get('a.btn:contains("Ich bin ein Maker-Hub")').click();
    cy.contains('Registrierung für Einrichtungen');
    cy.get('a.nav-link:contains("Registrieren")').click();
    cy.contains('Bei print4health registrieren');
    cy.get('a.btn:contains("Ich habe Bedarf")').click();
    cy.contains('Registrierung für Einrichtungen');

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
    cy.contains('Registrierung erfolgreich!');
  });
});
