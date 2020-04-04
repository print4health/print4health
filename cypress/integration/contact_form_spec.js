describe('contact form workflow', function () {
  it('go to homepage', function () {
    cy.visit('http://192.168.222.12');
  });
  it('clear email inbox', () => {
    cy.request('DELETE', 'http://192.168.222.12:1080/email/all');
  });
  it('send contact form', () => {
    cy.get('footer a:contains("Kontakt")').click();
    cy.get('h1:contains("Kontakt")');
    cy.get('input[name=name]').type('Mein Name');
    cy.get('input[name=email]').type('email@example.org');
    cy.get('input[name=phone]').type('123 345 546');
    cy.get('input[name=subject]').type('Betreff XYZ');
    cy.get('textarea[name=message]').type('Some message\n some more message');
    cy.get('button[type=submit]').click();
    cy.contains('Danke für die Nachricht! Wir melden uns sobald wie möglich');
  });
  it('check email', () => {
    cy.request('GET', 'http://192.168.222.12:1080/email').then(res => {
      const email = res.body[0];
      expect(email.subject).to.equal('Betreff XYZ');
      expect(email.html).to.contain('some more message');
    });
  });
});