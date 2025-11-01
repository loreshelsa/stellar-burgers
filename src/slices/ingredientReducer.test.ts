import { getIngredientsApi } from '@api';
import { ingredientReducer, getIngredients } from '../slices/ingredientReducer';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const initialState = {
  ingredients: [],
  loading: false,
  error: undefined
};

const mockData = {
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

describe('проверяем thunk функцию запрос', () => {
  it('статус загрузки должен изменяться при начале выполнения запроса', async () => {
    const state = ingredientReducer(
      initialState,
      getIngredients.pending('testRequestId', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('данные должены быть записаны в стейт после выполнения запроса', async () => {
    const state = ingredientReducer(
      initialState,
      getIngredients.fulfilled(mockData.data, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeUndefined();
    expect(state.ingredients).toEqual(mockData.data);
  });

  it('сообщение об ошибке должены быть записаны в стейт после выполнения запроса', async () => {
    const mockData = new Error('Ошибка запроса');

    const state = ingredientReducer(
      initialState,
      getIngredients.rejected(mockData, 'testRequestId')
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockData.message);
  });

  it('запрос должен быть с успешным ответом', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockData);

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getIngredients();
    await thunk(dispatch, getState, undefined);

    const [pending, fulfilled] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('ingredients/getAll/pending');
    expect(fulfilled.type).toBe('ingredients/getAll/fulfilled');

    expect(fulfilled.payload).toBe(mockData);
  });

  it('запрос должен быть с отклоненным ответом', async () => {
    (getIngredientsApi as jest.Mock).mockRejectedValue(new Error('Ошибка запроса'));

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = getIngredients();
    await thunk(dispatch, getState, undefined);

    const [pending, rejected] = dispatch.mock.calls.map((call) => call[0]);

    expect(pending.type).toBe('ingredients/getAll/pending');
    expect(rejected.type).toBe('ingredients/getAll/rejected');
    expect(rejected.error.message).toBe('Ошибка запроса');
  });
});
