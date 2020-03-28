describe('index', function () {
  it('check index page!', function () {
    cy.visit('http://localhost');
    cy.contains('Helfen mit 3D-Druck');
    cy.title().should('eq', 'print4health - Helfen mit 3D-Druck');
  });
});
