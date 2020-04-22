describe('contact form workflow', function () {
  it('go to homepage', function () {
    cy.visit('/');
  });
  it('clear email inbox', () => {
    cy.request('DELETE', 'http://localhost:1080/email/all');
  });
  it('send contact form', () => {
    cy.get('footer a[data-cypress="navlink-contact"]').click();
    cy.get('h1[data-cypress="contact-title"]').should('exist');
    cy.get('input[name=name]').type('Mein Name');
    cy.get('input[name=email]').type('email@example.org');
    cy.get('input[name=phone]').type('123 345 546');
    cy.get('input[name=subject]').type('Betreff XYZ');
    cy.get('textarea[name=message]').type('Some message\n some more message');
    cy.get('button[type=submit]').click();
    cy.get('[data-cypress="navlink-contact"]').should('exist');
  });
  it('check email', () => {
    cy.request('GET', 'http://localhost:1080/email').then(res => {
      const email = res.body[0];
      expect(email.subject).to.equal('Betreff XYZ');
      expect(email.html).to.contain('some more message');
    });
  });
});
