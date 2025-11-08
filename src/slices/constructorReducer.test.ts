import {
  ingredient,
  ingredientFilling,
  initialConstructorState
} from '../utils/mockData';
import { constructorReducer } from '../slices/constructorReducer';
import {
  addIngredients,
  removeIngregients,
  resetConstructor,
  moveUpIngregients,
  moveDownIngregients
} from '../slices/constructorReducer';

describe('проверяем constructorSlice', () => {
  it('должен возвращать дефолтное состояние при инициализации', () => {
    const result = constructorReducer(undefined, { type: '' });
    expect(result).toEqual(initialConstructorState);
  });

  it('должен добавлять ингридиент-булочку экшен addIngredients', () => {
    const action = { type: addIngredients.type, payload: ingredient };
    const result = constructorReducer(
      {
        orderIngredients: [],
        bun: null
      },
      action
    );
    expect(result.bun).toBe(ingredient);
  });

  it('должен добавлять ингридиент-начинку экшен addIngredients', () => {
    const action = { type: addIngredients.type, payload: ingredientFilling };
    const result = constructorReducer(
      {
        orderIngredients: [],
        bun: null
      },
      action
    );
    expect(result.orderIngredients).toEqual([ingredientFilling]);
  });

  it('должен удалять ингридиент по id экшен removeIngregients', () => {
    const state = {
      bun: null,
      orderIngredients: [ingredient, ingredientFilling]
    };
    const action = { type: removeIngregients.type, payload: 'test12' };
    const result = constructorReducer(state, action);
    expect(result).toEqual({
      bun: null,
      orderIngredients: [ingredientFilling]
    });
  });

  it('должен очищать состояние экшен resetConstructor', () => {
    const action = { type: resetConstructor.type };
    const result = constructorReducer(
      {
        orderIngredients: [],
        bun: ingredient
      },
      action
    );
    expect(result).toEqual(initialConstructorState);
  });

  it('должен перемещать ингридиент вверх экшен moveUpIngregients', () => {
    const state = {
      bun: null,
      orderIngredients: [ingredient, ingredientFilling]
    };
    const action = { type: moveUpIngregients.type, payload: 1 };
    const result = constructorReducer(state, action);
    expect(result.orderIngredients).toEqual([ingredientFilling, ingredient]);
  });

  it('должен перемещать ингридиент вниз экшен moveDownIngregients', () => {
    const state = {
      bun: null,
      orderIngredients: [ingredient, ingredientFilling]
    };
    const action = { type: moveDownIngregients.type, payload: 0 };
    const result = constructorReducer(state, action);
    expect(result.orderIngredients).toEqual([ingredientFilling, ingredient]);
  });
});
