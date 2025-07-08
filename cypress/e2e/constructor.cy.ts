/// <reference types="cypress" />

const BASE_URL = 'http://localhost:4000';
const BUN = `[data-cy='643d69a5c3f7b9001cfa093c']`; // Краторная булка N-200i
const INGREDIENT = `[data-cy='643d69a5c3f7b9001cfa0946']`; // Хрустящие минеральные кольца

describe('Проверка конструктора', () => {
  beforeEach(() => {
    // Мокаем запрос ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit(BASE_URL);
    cy.wait('@getIngredients');
  });

  it('Ингредиенты отображаются', () => {
    cy.get(BUN).should('exist');
    cy.get(INGREDIENT).should('exist');
  });

  it('Открывается модалка при клике', () => {
    cy.get(BUN).click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Можно добавить булку и начинку', () => {
    cy.get(BUN).find('button').click();
    cy.get(INGREDIENT).find('button').click().click();
    cy.get('[data-testid="burger-constructor"]').should(
      'contain.text',
      'Краторная булка N-200i'
    );
    cy.get('[data-testid="burger-constructor"]').should(
      'contain.text',
      'Хрустящие минеральные кольца'
    );
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    // Добавляем фейковые токены
    cy.setCookie('accessToken', 'test-accessToken');
    localStorage.setItem('refreshToken', 'test-refreshToken');

    // Мокаем API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });

    cy.visit(BASE_URL);
    cy.wait('@getIngredients');
  });

  it('Заказ оформляется и очищается', () => {
    cy.get(BUN).find('button').click();
    cy.get(INGREDIENT).find('button').click().click();

    // Нажимаем кнопку "Оформить заказ"
    cy.contains('button', 'Оформить заказ').click();

    // Проверяем номер заказа
    cy.get('[data-cy="orderNumber"]', { timeout: 5000 }).should(
      'contain.text',
      '1991'
    );

    // Закрываем модалку
    cy.get('[data-cy="modal-close"]').click();

    // Проверяем, что всё очищено
    cy.get('[data-testid="burger-constructor"]').should(
      'not.contain.text',
      'Краторная булка N-200i'
    );
    cy.get('[data-testid="burger-constructor"]').should(
      'not.contain.text',
      'Хрустящие минеральные кольца'
    );
  });
});
