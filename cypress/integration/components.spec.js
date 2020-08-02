function getVariations(module) {
  return Object.keys(module.default);
}

context('Components', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  const componentName = 'toggle-expand';
  describe(`Test - ${componentName}`, () => {
    const variations = getVariations(require(`../../examples/src/components/toggle-expand/meta`));

    beforeEach(() => {
      cy.get(`.component-list li a:contains("${componentName}")`).click();
    });

    Cypress._.times(variations.length, (i) => {
      const variationValue = variations[i];
      describe(variationValue, () => {
        it(`[${variationValue}] .should() - expand and collapse when clicking button for variation`, () => {
          cy.get('#componentVariation').select(variations[i]);

          cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: none;');

          cy.get('[data-ref=expand-button]').click();
          cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: block;');
          cy.get('[data-ref=expand-button]').click();
          cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: none;');

          cy.get('[data-ref=expand-button]').click();
          cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: block;');
          cy.get('[data-ref=expand-button]').click();
          cy.get('[data-ref=expand-content]').should('have.attr', 'style', 'display: none;');
        })
      })
    });
  });
});
