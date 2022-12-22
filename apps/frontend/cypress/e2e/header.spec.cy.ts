describe("Header Testing", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("Should go to register page",()=>{
    cy.get("[data-testingId='header__register_button'").click();
    cy.url().should("include","/auth/register");
  })
});
