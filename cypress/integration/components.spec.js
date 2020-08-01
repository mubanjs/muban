context('Components', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  describe('test toggle expand', () => {

    it('.should() - expand and collapse when clicking button', () => {
      cy.get('.component-list li a:contains("toggle-expand")').click();

      cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: none;')

      cy.get('[data-ref=expand-button]').click();
      cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: block;')
      cy.get('[data-ref=expand-button]').click();
      cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: none;')

      cy.get('[data-ref=expand-button]').click();
      cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: block;')
      cy.get('[data-ref=expand-button]').click();
      cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: none;')
    });
  });
});
