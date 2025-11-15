import { getIngredientsApi } from '@api';
import { ingredientReducer, getIngredients } from '../slices/ingredientReducer';
import {
  initialIngredientState,
  mockErrorData,
  mockIngredientData
} from '../utils/mockData';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('проверяем thunk функцию запрос', () => {
  it('статус загрузки должен изменяться при начале выполнения запроса', async () => {
    const state = ingredientReducer(
      initialIngredientState,
      getIngredients.pending('testRequestId', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const state = ingredientReducer(
      initialIngredientState,
      getIngredients.fulfilled(mockIngredientData.data, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeUndefined();
    expect(state.ingredients).toEqual(mockIngredientData.data);
  });

  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса', async () => {
    const state = ingredientReducer(
      initialIngredientState,
      getIngredients.rejected(mockErrorData, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockErrorData.message);
  });

  it('запрос должен быть с успешным ответом', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredientData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getIngredients();
    await thunk(dispatch, getState, undefined);

    const [pending, fulfilled] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('ingredients/getAll/pending');
    expect(fulfilled.type).toBe('ingredients/getAll/fulfilled');

    expect(fulfilled.payload).toBe(mockIngredientData);
  });

  it('запрос должен быть с отклоненным ответом', async () => {
    (getIngredientsApi as jest.Mock).mockRejectedValue(mockErrorData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getIngredients();
    await thunk(dispatch, getState, undefined);

    const [pending, rejected] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('ingredients/getAll/pending');
    expect(rejected.type).toBe('ingredients/getAll/rejected');
    expect(rejected.error.message).toBe(mockErrorData.message);
  });
});
