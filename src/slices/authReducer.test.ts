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
import {
  initialStateAuth,
  loginData,
  mockErrorData,
  mockLoginData,
  mockRegisterData,
  mockUpdateData,
  user
} from '../utils/mockData';

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn()
}));

jest.mock('../utils/cookie', () => ({
  getCookie: jest.fn()
}));

describe('проверяем authSlice', () => {
  it('должен возвращать дефолтное состояние при инициализации', () => {
    const result = authReducer(undefined, { type: '' });
    expect(result).toEqual(initialStateAuth);
  });
  it('email должен быть заполнен в форме логин', () => {
    const mockData = {
      field: 'email',
      value: 'test@yandex.ru'
    };
    const action = { type: setFormValue.type, payload: mockData };
    const result = authReducer(initialStateAuth, action);
    expect(result.form).toEqual({
      email: mockData.value,
      password: initialStateAuth.form.password
    });
  });

  it('пароль должен быть заполнен в форме регистрации', () => {
    const mockData = {
      field: 'password',
      value: 'test'
    };
    const action = { type: setRegisterFormValue.type, payload: mockData };
    const result = authReducer(initialStateAuth, action);
    expect(result.registerForm).toEqual({
      password: mockData.value,
      email: initialStateAuth.registerForm.email,
      name: initialStateAuth.registerForm.name
    });
  });

  it('проверка пользователь существует authChecked', () => {
    const action = authChecked();
    const result = authReducer(initialStateAuth, action);
    expect(result.isAuthChecked).toBe(true);
  });

  it('сброс данных user и isAuthenticated в исходное значение', () => {
    const prevState = {
      ...initialStateAuth,
      user: { email: 'test@test.com', name: 'Test' },
      isAuthenticated: true
    };
    const action = reset();
    const result = authReducer(prevState, action);
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
    expect(result.form).toEqual(initialStateAuth.form);
  });
});

describe('проверяем thunk функцию запрос login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('запрос должен быть с отклоненным ответом', async () => {
    (loginUserApi as jest.Mock).mockRejectedValue(mockErrorData);

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
    const state = authReducer(
      initialStateAuth,
      login.pending('testRequestId', user)
    );
    expect(state.sending).toBe(true);
    expect(state.error).toBeNull();
  });
  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса', async () => {
    const state = authReducer(
      initialStateAuth,
      login.rejected(mockErrorData, 'testRequestId', user)
    );
    expect(state.sending).toBe(false);
    expect(state.error).toBe(mockErrorData.message);
  });
  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const state = authReducer(
      initialStateAuth,
      login.fulfilled(mockLoginData, 'testRequestId', mockLoginData.form)
    );
    expect(state.sending).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(mockLoginData.user);
  });
});

describe('проверяем thunk функцию запрос register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('запрос должен быть с отклоненным ответом', async () => {
    (registerUserApi as jest.Mock).mockRejectedValue(mockErrorData);

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
    const state = authReducer(
      initialStateAuth,
      register.pending('testRequestId', user)
    );
    expect(state.registerSending).toBe(true);
    expect(state.registerError).toBeNull();
  });
  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса register', async () => {
    const state = authReducer(
      initialStateAuth,
      register.rejected(mockErrorData, 'testRequestId', user)
    );
    expect(state.registerSending).toBe(false);
    expect(state.registerError).toBe(mockErrorData.message);
  });
  it('данные должены быть записаны в стейт после выполнения запроса register', async () => {
    const state = authReducer(
      initialStateAuth,
      register.fulfilled(
        mockRegisterData,
        'testRequestId',
        mockRegisterData.registerForm
      )
    );
    expect(state.registerSending).toBe(false);
  });

  it('статус загрузки должен изменяться в начале выполнения запроса checkUserAuth', async () => {
    const state = authReducer(
      initialStateAuth,
      checkUserAuth.pending('testRequestId')
    );
    expect(state.checkUserAuthSending).toBe(true);
    expect(state.checkUserAuthError).toBeNull();
  });
  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса checkUserAuth', async () => {
    const state = authReducer(
      initialStateAuth,
      checkUserAuth.rejected(mockErrorData, 'testRequestId')
    );
    expect(state.checkUserAuthSending).toBe(false);
    expect(state.checkUserAuthError).toBe(mockErrorData.message);
  });
  it('данные должены быть записаны в стейт после выполнения запроса checkUserAuth', async () => {
    const state = authReducer(
      initialStateAuth,
      checkUserAuth.fulfilled(mockRegisterData, 'testRequestId')
    );
    expect(state.checkUserAuthSending).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toBe(mockRegisterData.user);
  });

  it('статус загрузки должен изменяться в начале выполнения запроса updateUser', async () => {
    const state = authReducer(
      initialStateAuth,
      updateUser.pending('testRequestId', user)
    );
    expect(state.updateUserSending).toBe(true);
    expect(state.updateUserError).toBeNull();
  });

  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса updateUser', async () => {
    const state = authReducer(
      initialStateAuth,
      updateUser.rejected(mockErrorData, 'testRequestId', user)
    );
    expect(state.updateUserSending).toBe(false);
    expect(state.updateUserError).toBe(mockErrorData.message);
  });

  it('данные должены быть записаны в стейт после выполнения запроса updateUser', async () => {
    const state = authReducer(
      initialStateAuth,
      updateUser.fulfilled(
        mockUpdateData,
        'testRequestId',
        mockUpdateData.updateForm
      )
    );
    expect(state.updateUserSending).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toBe(mockUpdateData.user);
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
    const result = sendingSelector({
      auth: { ...initialStateAuth, ...mockState }
    });
    expect(result).toBe(true);
  });

  it('sendErrorSelector возвращает значение error', () => {
    const result = sendErrorSelector({
      auth: { ...initialStateAuth, ...mockState }
    });
    expect(result).toBe('Ошибка отправки');
  });

  it('authSelector возвращает значение form', () => {
    const result = authSelector({
      auth: { ...initialStateAuth, ...mockState }
    });
    expect(result).toEqual({ email: 'test@example.com', password: '12345' });
  });
});
