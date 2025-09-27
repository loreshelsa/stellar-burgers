import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../slices/authReducer';
import { ingredientReducer } from '../slices/ingredientReducer';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { orderReducer } from '../slices/orderReducer';
import { feedReducer } from '../slices/feedReducer';
import { constructorReducer } from '../slices/constructorReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredient: ingredientReducer,
  order: orderReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
