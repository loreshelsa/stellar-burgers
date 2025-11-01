import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../services/store';
import { authReducer } from '../slices/authReducer';
import { ingredientReducer } from '../slices/ingredientReducer';
import { orderReducer } from '../slices/orderReducer';
import { feedReducer } from '../slices/feedReducer';
import { constructorReducer } from '../slices/constructorReducer';

describe('rootReducer', () => {
  it('должен корректно инициализировать state', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('ingredient');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('burgerConstructor');

    expect(state.auth).toEqual(authReducer(undefined, { type: '@@INIT' }));
    expect(state.ingredient).toEqual(
      ingredientReducer(undefined, { type: '@@INIT' })
    );
    expect(state.order).toEqual(orderReducer(undefined, { type: '@@INIT' }));
    expect(state.feed).toEqual(feedReducer(undefined, { type: '@@INIT' }));
    expect(state.burgerConstructor).toEqual(
      constructorReducer(undefined, { type: '@@INIT' })
    );
  });
});
