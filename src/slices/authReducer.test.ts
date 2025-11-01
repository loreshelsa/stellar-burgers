import { getCookie } from '../utils/cookie';
import {
  authReducer,
  checkUserAuth,
  login,
  register,
  updateUser
} from '../slices/authReducer';
import {
  setRegisterFormValue,
  authChecked,
  setFormValue,
  reset
} from '../slices/authReducer';
import { getUserApi, loginUserApi, registerUserApi } from '@api';
import {
  sendingSelector,
  sendErrorSelector,
  authSelector
} from '../slices/authReducer';

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn()
}));

jest.mock('../utils/cookie', () => ({
  getCookie: jest.fn()
}));

const initialState = {
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

const loginData = {
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

describe('проверяем authSlice', () => {
  it('должен возвращать дефолтное состояние при инициализации', () => {
    const result = authReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });
  it('email должен быть заполнен в форме логин', () => {
    const mockData = {
      field: 'email',
      value: 'test@yandex.ru'
    };
    const action = { type: setFormValue.type, payload: mockData };
    const result = authReducer(initialState, action);
    expect(result.form).toEqual({
      email: mockData.value,
      password: initialState.form.password
    });
  });

  it('пароль должен быть заполнен в форме регистрации', () => {
    const mockData = {
      field: 'password',
      value: 'test'
    };
    const action = { type: setRegisterFormValue.type, payload: mockData };
    const result = authReducer(initialState, action);
    expect(result.registerForm).toEqual({
      password: mockData.value,
      email: initialState.registerForm.email,
      name: initialState.registerForm.name
    });
  });

  it('проверка пользователь существует authChecked', () => {
    const action = authChecked();
    const result = authReducer(initialState, action);
    expect(result.isAuthChecked).toBe(true);
  });

  it('сброс данных user и isAuthenticated в исходное значение', () => {
    const prevState = {
      ...initialState,
      user: { email: 'test@test.com', name: 'Test' },
      isAuthenticated: true
    };
    const action = reset();
    const result = authReducer(prevState, action);
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
    expect(result.form).toEqual(initialState.form);
  });
});

describe('проверяем thunk функцию запрос login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('запрос должен быть с отклоненным ответом', async () => {
    (loginUserApi as jest.Mock).mockRejectedValue(new Error('Ошибка запроса'));

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = login(loginData.form);
    await thunk(dispatch, getState, undefined);

    const [pending, rejected] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('auth/login/pending');
    expect(rejected.type).toBe('auth/login/rejected');
    expect(rejected.error.message).toBe('Ошибка запроса');
  });

  it('статус загрузки должен изменяться в начале выполнения запроса', async () => {
    const arg = { email: 'test@yandex.ru', password: '123456', name: 'elza' };
    const state = authReducer(
      initialState,
      login.pending('testRequestId', arg)
    );
    expect(state.sending).toBe(true);
    expect(state.error).toBeNull();
  });
  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса', async () => {
    const mockData = new Error('Ошибка запроса');
    const arg = { email: 'test@yandex.ru', password: '123456', name: 'elza' };

    const state = authReducer(
      initialState,
      login.rejected(mockData, 'testRequestId', arg)
    );
    expect(state.sending).toBe(false);
    expect(state.error).toBe(mockData.message);
  });
  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const mockData = {
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

    const state = authReducer(
      initialState,
      login.fulfilled(mockData, 'testRequestId', mockData.form)
    );
    expect(state.sending).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(mockData.user);
  });
});

describe('проверяем thunk функцию запрос register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('запрос должен быть с отклоненным ответом', async () => {
    (registerUserApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка запроса')
    );

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = register(loginData.registerForm);
    await thunk(dispatch, getState, undefined);

    const [pending, rejected] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('auth/register/pending');
    expect(rejected.type).toBe('auth/register/rejected');
    expect(rejected.error.message).toBe('Ошибка запроса');
  });

  it('статус загрузки должен изменяться в начале выполнения запроса register', async () => {
    const arg = { email: 'test@yandex.ru', password: '123456', name: 'elza' };
    const state = authReducer(
      initialState,
      register.pending('testRequestId', arg)
    );
    expect(state.registerSending).toBe(true);
    expect(state.registerError).toBeNull();
  });
  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса register', async () => {
    const mockData = new Error('Ошибка запроса');
    const arg = { email: 'test@yandex.ru', password: '123456', name: 'elza' };

    const state = authReducer(
      initialState,
      register.rejected(mockData, 'testRequestId', arg)
    );
    expect(state.registerSending).toBe(false);
    expect(state.registerError).toBe(mockData.message);
  });
  it('данные должены быть записаны в стейт после выполнения запроса register', async () => {
    const mockData = {
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

    const state = authReducer(
      initialState,
      register.fulfilled(mockData, 'testRequestId', mockData.registerForm)
    );
    expect(state.registerSending).toBe(false);
  });

  it('статус загрузки должен изменяться в начале выполнения запроса checkUserAuth', async () => {
    const state = authReducer(
      initialState,
      checkUserAuth.pending('testRequestId')
    );
    expect(state.checkUserAuthSending).toBe(true);
    expect(state.checkUserAuthError).toBeNull();
  });
  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса checkUserAuth', async () => {
    const mockData = new Error('Ошибка запроса');

    const state = authReducer(
      initialState,
      checkUserAuth.rejected(mockData, 'testRequestId')
    );
    expect(state.checkUserAuthSending).toBe(false);
    expect(state.checkUserAuthError).toBe(mockData.message);
  });
  it('данные должены быть записаны в стейт после выполнения запроса checkUserAuth', async () => {
    const mockData = {
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

    const state = authReducer(
      initialState,
      checkUserAuth.fulfilled(mockData, 'testRequestId')
    );
    expect(state.checkUserAuthSending).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toBe(mockData.user);
  });

  it('статус загрузки должен изменяться в начале выполнения запроса updateUser', async () => {
    const arg = { email: 'test@yandex.ru', password: '123456', name: 'elza' };
    const state = authReducer(
      initialState,
      updateUser.pending('testRequestId', arg)
    );
    expect(state.updateUserSending).toBe(true);
    expect(state.updateUserError).toBeNull();
  });

  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса updateUser', async () => {
    const mockData = new Error('Ошибка запроса');
    const arg = { email: 'test@yandex.ru', password: '123456', name: 'elza' };

    const state = authReducer(
      initialState,
      updateUser.rejected(mockData, 'testRequestId', arg)
    );
    expect(state.updateUserSending).toBe(false);
    expect(state.updateUserError).toBe(mockData.message);
  });

  it('данные должены быть записаны в стейт после выполнения запроса updateUser', async () => {
    const mockData = {
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

    const state = authReducer(
      initialState,
      updateUser.fulfilled(mockData, 'testRequestId', mockData.updateForm)
    );
    expect(state.updateUserSending).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toBe(mockData.user);
  });
});

describe('проверяем thunk функцию запрос checkUserAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const dispatch = jest.fn();
  it('запрос должен быть вызван если есть токен', async () => {
    (getCookie as jest.Mock).mockReturnValue('mockAccessToken');
    (getUserApi as jest.Mock).mockResolvedValue({
      user: { email: 'test@yandex.ru' }
    });
    const getState = jest.fn();

    const thunk = checkUserAuth();
    await thunk(dispatch, getState, undefined);

    expect(getUserApi).toHaveBeenCalledTimes(1);
  });
  it('запрос не должен быть вызван если нет токена', async () => {
    (getCookie as jest.Mock).mockReturnValue('');
    (getUserApi as jest.Mock).mockResolvedValue({
      user: { email: 'test@yandex.ru' }
    });
    const getState = jest.fn();

    const thunk = checkUserAuth();
    await thunk(dispatch, getState, undefined);

    expect(getUserApi).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(authChecked());
  });
});

describe('проверяем селекторы', () => {
  const mockState = {
    sending: true,
    error: 'Ошибка отправки',
    form: { email: 'test@example.com', password: '12345' }
  };

  it('селектор отправки возвращает значение sending', () => {
    const result = sendingSelector({ auth: { ...initialState, ...mockState } });
    expect(result).toBe(true);
  });

  it('sendErrorSelector возвращает значение error', () => {
    const result = sendErrorSelector({ auth: { ...initialState, ...mockState } });
    expect(result).toBe('Ошибка отправки');
  });

  it('authSelector возвращает значение form', () => {
    const result = authSelector({ auth: { ...initialState, ...mockState } });
    expect(result).toEqual({ email: 'test@example.com', password: '12345' });
  });
});
