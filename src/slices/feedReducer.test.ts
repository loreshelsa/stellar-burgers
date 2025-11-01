import { feedReducer, getFeeds } from '../slices/feedReducer';
import { addOrderNumber } from '../slices/feedReducer';
import { getFeedsApi, TFeedsResponse } from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const initialState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  error: undefined,
  loading: false,
  orderNumber: ''
};

describe('проверяем feedSlice', () => {
  it('должен добавлять номер заказа экшен addOrderNumber', () => {
    const action = { type: addOrderNumber.type, payload: '456111' };
    const result = feedReducer(initialState, action);
    expect(result.orderNumber).toBe('456111');
  });
});

describe('проверяем thunk функцию запрос', () => {
  it('статус загрузки должен изменяться в начале выполнения запроса', async () => {
    const state = feedReducer(
      initialState,
      getFeeds.pending('testRequestId', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const mockData: TFeedsResponse = {
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

    const state = feedReducer(
      initialState,
      getFeeds.fulfilled(mockData, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeUndefined();
    expect(state.feeds).toEqual(mockData);
  });

  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса', async () => {
    const mockData = new Error('Ошибка запроса');

    const state = feedReducer(
      initialState,
      getFeeds.rejected(mockData, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockData.message);
  });

  it('запрос должен быть с успешным ответом', async () => {
    const mockData = [
      {
        orders: [
          {
            _id: 1,
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
      }
    ];

    (getFeedsApi as jest.Mock).mockResolvedValue(mockData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getFeeds();
    await thunk(dispatch, getState, undefined);

    const [pending, fulfilled] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('feed/getAll/pending');
    expect(fulfilled.type).toBe('feed/getAll/fulfilled');
    expect(fulfilled.payload).toBe(mockData);
  });

  it('запрос должен быть с отклоненным ответом', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(new Error('Ошибка запроса'));

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getFeeds();
    await thunk(dispatch, getState, undefined);

    const [pending, rejected] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('feed/getAll/pending');
    expect(rejected.type).toBe('feed/getAll/rejected');
    expect(rejected.error.message).toBe('Ошибка запроса');
  });
});
