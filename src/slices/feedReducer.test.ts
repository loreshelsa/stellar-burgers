import {
  initialFeedState,
  mockErrorData,
  mockGetFeedsData
} from '../utils/mockData';
import { feedReducer, getFeeds } from '../slices/feedReducer';
import { addOrderNumber } from '../slices/feedReducer';
import { getFeedsApi, TFeedsResponse } from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('проверяем feedSlice', () => {
  it('должен добавлять номер заказа экшен addOrderNumber', () => {
    const action = { type: addOrderNumber.type, payload: '456111' };
    const result = feedReducer(initialFeedState, action);
    expect(result.orderNumber).toBe('456111');
  });
});

describe('проверяем thunk функцию запрос', () => {
  it('статус загрузки должен изменяться в начале выполнения запроса', async () => {
    const state = feedReducer(
      initialFeedState,
      getFeeds.pending('testRequestId', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const state = feedReducer(
      initialFeedState,
      getFeeds.fulfilled(mockGetFeedsData, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeUndefined();
    expect(state.feeds).toEqual(mockGetFeedsData);
  });

  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса', async () => {
    const state = feedReducer(
      initialFeedState,
      getFeeds.rejected(mockErrorData, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockErrorData.message);
  });

  it('запрос должен быть с успешным ответом', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(mockGetFeedsData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getFeeds();
    await thunk(dispatch, getState, undefined);

    const [pending, fulfilled] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('feed/getAll/pending');
    expect(fulfilled.type).toBe('feed/getAll/fulfilled');
    expect(fulfilled.payload).toBe(mockGetFeedsData);
  });

  it('запрос должен быть с отклоненным ответом', async () => {
    (getFeedsApi as jest.Mock).mockRejectedValue(mockErrorData);

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
