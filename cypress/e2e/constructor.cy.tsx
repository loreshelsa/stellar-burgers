const accessToken = 'mocked-access-token';
const refreshToken = '12345678';

describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('http://localhost:4000');
  });
});

describe('Проверка загрузки ингредиентов', () => {
  it('должен использовать моковые данные вместо API', () => {
    cy.fixture('ingredients.json').then((mockData: any) => {
      cy.intercept('GET', '**/api/ingredients', {
        statusCode: 200,
        body: { success: true, data: mockData }
      }).as('getIngredients');
    });

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Соусы').click();
    cy.contains('Соус Spicy-X').should('exist');
  });
});

describe('Проверка добавления ингредиентов', () => {
  it('должен добавлять игридиенты из списка в конструктор', () => {
    cy.intercept('GET', '**/api/ingredients').as('getIngredients');
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.get('[data-testid="ingredient-list"]').should('be.visible');
    cy.contains('Краторная булка N-200i')
      .parent('li')
      .children('[type=button]')
      .click();
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent('li')
      .children('[type=button]')
      .click();
    cy.contains('Соусы').click();
    cy.contains('Соус Spicy-X').parent('li').children('[type=button]').click();
  });
});

describe('Проверка открытия модального окна', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').then((mockData: any) => {
      cy.intercept('GET', '**/api/ingredients', {
        statusCode: 200,
        body: { success: true, data: mockData }
      }).as('getIngredients');
    });

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });
  it('должно открываться и закрываться по кнопке', () => {
    cy.get('[data-testid="ingredient-list"]').should('be.visible');
    cy.contains('Флюоресцентная булка R2-D3').click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get(
      'svg path[d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L12 10.5858L19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289C21.0976 3.68342 21.0976 4.31658 20.7071 4.70711L13.4142 12L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L12 13.4142L4.70711 20.7071C4.31658 21.0976 3.68342 21.0976 3.29289 20.7071C2.90237 20.3166 2.90237 19.6834 3.29289 19.2929L10.5858 12L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289Z"]'
    )
      .parent('svg')
      .click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });
  it('закрываться по overlay', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal-overlay"]').click('bottomRight', {
      force: true
    });
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});

describe('Проверка создания заказа', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'mocked-access-token');
    cy.fixture('userData.json').then((user: any) => {
      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: { success: true, user }
      }).as('userData');
    });

    cy.fixture('orderCreate.json').then((order: any) => {
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: order
      }).as('orderCreate');
    });

    cy.visit('http://localhost:4000', {
      onBeforeLoad(win: Window) {
        win.localStorage.setItem('accessToken', accessToken);
        win.localStorage.setItem('refreshToken', refreshToken);
      }
    });
    cy.wait('@userData');
  });

  it('должен корректно отобразить имя пользователя', () => {
    cy.contains('Mint leaf 2').should('be.visible');
  });

  it('должен собираться бургер по ингридиентам', () => {
    cy.intercept('GET', '**/api/ingredients').as('getIngredients');
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.get('[data-testid="ingredient-list"]').should('be.visible');
    cy.contains('Краторная булка N-200i')
      .parent('li')
      .children('[type=button]')
      .click();
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent('li')
      .children('[type=button]')
      .click();
    cy.contains('Соусы').click();
    cy.contains('Соус Spicy-X').parent('li').children('[type=button]').click();
  });

  it('должен оформиться заказ', () => {
    cy.contains('Оформить заказ').click();
    cy.wait('@orderCreate').its('response.statusCode').should('eq', 200);
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.contains('91397').should('be.visible');
    cy.get(
      'svg path[d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L12 10.5858L19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289C21.0976 3.68342 21.0976 4.31658 20.7071 4.70711L13.4142 12L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L12 13.4142L4.70711 20.7071C4.31658 21.0976 3.68342 21.0976 3.29289 20.7071C2.90237 20.3166 2.90237 19.6834 3.29289 19.2929L10.5858 12L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289Z"]'
    )
      .parent('svg')
      .click();
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.contains('Выберите булки').and('be.visible');
    cy.contains('Выберите начинку').and('be.visible');
  });
});
