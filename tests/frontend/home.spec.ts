/// <reference types="cypress" />

describe('Home Page', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it("test-1", () => {
        cy.contains('Hello ji')
    })

})