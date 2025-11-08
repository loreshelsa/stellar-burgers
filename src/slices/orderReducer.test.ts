import {
  initialOrderState,
  mockErrorData,
  mockGetOrdersData
} from '../utils/mockData';
import {
  orderReducer,
  getOrders,
  getCurrentOrder,
  orderBurger
} from '../slices/orderReducer';
import { reset } from '../slices/orderReducer';
import { resetConstructor } from './constructorReducer';
import {
  getOrdersApi,
  TFeedsResponse,
  getOrderByNumberApi,
  orderBurgerApi
} from '@api';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

jest.mock('@slices/constructorReducer', () => ({
  resetConstructor: jest.fn(() => ({ type: 'constructor/reset' }))
}));

describe('проверяем orderSlice', () => {
  it('должен сбрасываться до начального состояния экшен reset', () => {
    const action = { type: reset.type };
    const result = orderReducer(initialOrderState, action);
    expect(result.newOrder).toBeNull();
    expect(result.loadingNewOrder).toBe(false);
  });
});

describe('проверяем thunk функцию получения заказов getOrders', () => {
  it('статус загрузки должен изменяться в начале выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      getOrders.pending('testRequestId', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      getOrders.fulfilled(mockGetOrdersData.orders, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockGetOrdersData.orders);
  });

  it('сообщение об ошибке должно быть записано в стейт после выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      getOrders.rejected(mockErrorData, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockErrorData.message);
  });

  it('запрос должен быть с успешным ответом', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue(mockGetOrdersData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getOrders();
    await thunk(dispatch, getState, undefined);

    const [pending, fulfilled] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('orders/getAll/pending');
    expect(fulfilled.type).toBe('orders/getAll/fulfilled');
    expect(fulfilled.payload).toBe(mockGetOrdersData);
  });
  it('запрос должен быть с отклоненным ответом', async () => {
    (getOrdersApi as jest.Mock).mockRejectedValue(mockErrorData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getOrders();
    await thunk(dispatch, getState, undefined);

    const [pending, rejected] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('orders/getAll/pending');
    expect(rejected.type).toBe('orders/getAll/rejected');
    expect(rejected.error.message).toBe('Ошибка запроса');
  });
});

describe('проверяем thunk функцию получения текущего заказа getCurrentOrder', () => {
  const mockOrderNumber = 123;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вызывать getOrderByNumberApi с правильным аргументом', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue(mockGetOrdersData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    await getCurrentOrder(mockOrderNumber)(dispatch, getState, undefined);

    expect(getOrderByNumberApi).toHaveBeenCalledWith(mockOrderNumber);
  });

  it('статус загрузки должен изменяться в начале выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      getCurrentOrder.pending('testRequestId', 1)
    );
    expect(state.loadingCurrentOrder).toBe(true);
    expect(state.errorCurrentOrder).toBeNull();
  });

  it('сообщение об ошибке должно быть записано в стейт после выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      getCurrentOrder.rejected(mockErrorData, 'testRequestId', mockOrderNumber)
    );
    expect(state.loadingCurrentOrder).toBe(false);
    expect(state.errorCurrentOrder).toBe(mockErrorData.message);
  });

  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      getCurrentOrder.fulfilled(
        mockGetOrdersData,
        'testRequestId',
        mockOrderNumber
      )
    );
    expect(state.loadingCurrentOrder).toBe(false);
    expect(state.errorCurrentOrder).toBeNull();
    expect(state.currentOrder).toEqual(mockGetOrdersData.orders[0]);
  });
});

describe('проверяем thunk функцию получения заказа бургера orderBurger', () => {
  const mockData = ['bun', 'sause', 'main'];

  const mockResponse = {
    success: true,
    name: 'Тест',
    order: { number: 123 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вызывать orderBurgerApi с правильными данными', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue(mockResponse);

    const dispatch = jest.fn();
    const getState = jest.fn();

    await orderBurger(mockData)(dispatch, getState, undefined);

    expect(orderBurgerApi).toHaveBeenCalledWith(mockData);
  });
  it('должен вызывать resetConstructor после завершения запроса', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue(mockResponse);

    const dispatch = jest.fn();
    const getState = jest.fn();

    await orderBurger(mockData)(dispatch, getState, undefined);

    expect(resetConstructor).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: 'constructor/reset' });
  });

  it('статус загрузки должен изменяться в начале выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      orderBurger.pending('testRequestId', ['test', 'test2'])
    );
    expect(state.loadingNewOrder).toBe(true);
    expect(state.errorNewOrder).toBeNull();
  });
  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const mockOrderBurgerData = {
      success: true,
      order: {
        _id: '12345',
        status: 'test',
        name: 'test',
        createdAt: 'test',
        updatedAt: 'test',
        number: 1,
        ingredients: ['test', 'test2']
      },
      name: 'test'
    };

    const state = orderReducer(
      initialOrderState,
      orderBurger.fulfilled(mockOrderBurgerData, 'testRequestId', [
        'test',
        'test2'
      ])
    );
    expect(state.loadingNewOrder).toBe(false);
    expect(state.errorNewOrder).toBeNull();
    expect(state.newOrder).toBe(mockOrderBurgerData);
  });
  it('сообщение об ошибке должно быть записано в стейт после выполнения запроса', async () => {
    const state = orderReducer(
      initialOrderState,
      orderBurger.rejected(mockErrorData, 'testRequestId', ['test', 'test2'])
    );
    expect(state.loadingNewOrder).toBe(false);
    expect(state.errorNewOrder).toBe(mockErrorData.message);
  });
});
