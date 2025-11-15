import { TFeedsResponse } from '@api';

// данные для auth
export const initialStateAuth = {
  form: {
    email: '',
    password: ''
  },
  registerForm: {
    email: '',
    password: '',
    name: ''
  },
  updateForm: {
    email: '',
    password: '',
    name: ''
  },
  error: null,
  sending: false,
  registerError: null,
  registerSending: false,
  isAuthenticated: false,
  isAuthChecked: false,
  user: null,
  checkUserAuthSending: false,
  checkUserAuthError: null,
  updateUserError: null,
  updateUserSending: false
};

export const loginData = {
  form: {
    email: 'test@yandex.ru',
    password: '123456'
  },
  registerForm: {
    email: 'test@yandex.ru',
    password: '123456',
    name: 'elza'
  },
  updateForm: {
    email: 'test2@yandex.ru',
    password: '123456789',
    name: 'elzaTest'
  }
};

export const mockLoginData = {
  success: true,
  form: {
    email: 'test@yandex.ru',
    password: '123456'
  },
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  user: {
    email: 'test@yandex.ru',
    password: '123456',
    name: 'elza'
  }
};

export const mockRegisterData = {
  success: true,
  registerForm: {
    email: 'test@yandex.ru',
    password: '123456',
    name: 'elza'
  },
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  user: {
    email: 'test@yandex.ru',
    password: '123456',
    name: 'elza'
  }
};

export const mockUpdateData = {
  success: true,
  updateForm: {
    email: 'test@yandex.ru',
    password: '123456',
    name: 'elza'
  },
  refreshToken: 'refreshToken',
  accessToken: 'accessToken',
  user: {
    email: 'test@yandex.ru',
    password: '123456',
    name: 'elza'
  }
};

export const user = {
  email: 'test@yandex.ru',
  password: '123456',
  name: 'elza'
};

// данные для order
export const initialOrderState = {
  newOrder: null,
  orders: [],
  error: null,
  loading: false,
  loadingNewOrder: false,
  errorNewOrder: null,
  currentOrder: null,
  loadingCurrentOrder: false,
  errorCurrentOrder: null
};

export const mockGetOrdersData: TFeedsResponse = {
  success: true,
  orders: [
    {
      _id: '1',
      status: 'ok',
      name: 'test',
      createdAt: 'test',
      updatedAt: 'test',
      number: 1,
      ingredients: ['bun', 'sause']
    }
  ],
  total: 1,
  totalToday: 1
};

// данные для Feed
export const initialFeedState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  error: undefined,
  loading: false,
  orderNumber: ''
};

export const mockGetFeedsData: TFeedsResponse = {
  success: true,
  orders: [
    {
      _id: '1',
      status: 'ok',
      name: 'test',
      createdAt: 'test',
      updatedAt: 'test',
      number: 1,
      ingredients: ['bun', 'sause']
    }
  ],
  total: 1,
  totalToday: 1
};

//данные для Ingredient
export const initialIngredientState = {
  ingredients: [],
  loading: false,
  error: undefined
};

export const mockIngredientData = {
  success: true,
  data: [
    {
      _id: 'test',
      name: 'Соус',
      type: 'sauce',
      proteins: 2,
      fat: 2,
      carbohydrates: 2,
      calories: 2,
      price: 2,
      image: 'test',
      image_large: 'test',
      image_mobile: 'test'
    }
  ]
};

//данные для constructor
export const initialConstructorState = { bun: null, orderIngredients: [] };
export const ingredient = {
  _id: 'test12',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 1,
  image: 'test',
  image_large: 'test',
  image_mobile: 'test'
};
export const ingredientFilling = {
  _id: 'test34',
  name: 'Соус',
  type: 'sauce',
  proteins: 2,
  fat: 2,
  carbohydrates: 2,
  calories: 2,
  price: 2,
  image: 'test',
  image_large: 'test',
  image_mobile: 'test'
};

// общее
export const mockErrorData = new Error('Ошибка запроса');
