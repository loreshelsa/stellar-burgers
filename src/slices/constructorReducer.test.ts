import { constructorReducer } from '../slices/constructorReducer';
import {
  addIngredients,
  removeIngregients,
  resetConstructor,
  moveUpIngregients,
  moveDownIngregients
} from '../slices/constructorReducer';

const initialState = { bun: null, orderIngredients: [] };
const ingredient = {
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

const ingredientFilling = {
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

describe('проверяем constructorSlice', () => {
  it('должен возвращать дефолтное состояние при инициализации', () => {
    const result = constructorReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
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
      orderIngredients: [
        {
          _id: 'test12',
          name: 'Булка',
          type: 'main',
          proteins: 1,
          fat: 1,
          carbohydrates: 1,
          calories: 1,
          price: 1,
          image: 'test',
          image_large: 'test',
          image_mobile: 'test'
        },
        {
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
        }
      ]
    };
    const action = { type: removeIngregients.type, payload: 'test12' };
    const result = constructorReducer(state, action);
    expect(result).toEqual({
      bun: null,
      orderIngredients: [
        {
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
        }
      ]
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
    expect(result).toEqual(initialState);
  });

  it('должен перемещать ингридиент вверх экшен moveUpIngregients', () => {
    const state = {
      bun: null,
      orderIngredients: [
        {
          _id: 'test12',
          name: 'Булка',
          type: 'main',
          proteins: 1,
          fat: 1,
          carbohydrates: 1,
          calories: 1,
          price: 1,
          image: 'test',
          image_large: 'test',
          image_mobile: 'test'
        },
        {
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
        }
      ]
    };
    const action = { type: moveUpIngregients.type, payload: 1 };
    const result = constructorReducer(state, action);
    expect(result.orderIngredients).toEqual([
      {
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
      },
      {
        _id: 'test12',
        name: 'Булка',
        type: 'main',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 1,
        image: 'test',
        image_large: 'test',
        image_mobile: 'test'
      }
    ]);
  });

  it('должен перемещать ингридиент вниз экшен moveDownIngregients', () => {
    const state = {
      bun: null,
      orderIngredients: [
        {
          _id: 'test12',
          name: 'Булка',
          type: 'main',
          proteins: 1,
          fat: 1,
          carbohydrates: 1,
          calories: 1,
          price: 1,
          image: 'test',
          image_large: 'test',
          image_mobile: 'test'
        },
        {
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
        }
      ]
    };
    const action = { type: moveDownIngregients.type, payload: 0 };
    const result = constructorReducer(state, action);
    expect(result.orderIngredients).toEqual([
      {
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
      },
      {
        _id: 'test12',
        name: 'Булка',
        type: 'main',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 1,
        image: 'test',
        image_large: 'test',
        image_mobile: 'test'
      }
    ]);
  });
});
