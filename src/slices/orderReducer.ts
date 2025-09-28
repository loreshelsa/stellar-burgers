import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TNewOrderResponse
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { resetConstructor } from './constructorReducer';

type TOrdersDataState = {
  newOrder: TNewOrderResponse | null;
  orders: TOrder[];
  error?: string | null;
  loading: boolean;
  loadingNewOrder: boolean;
  errorNewOrder?: string | null;
  currentOrder: TOrder | null;
  loadingCurrentOrder: boolean;
  errorCurrentOrder?: string | null;
};

const initialState: TOrdersDataState = {
  newOrder: null,
  orders: [],
  error: null,
  loading: false,
  loadingNewOrder: false,
  errorNewOrder: null,
  currentOrder: null,
  loadingCurrentOrder: false,
  errorCurrentOrder: null
};

export const getOrders = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
);

export const getCurrentOrder = createAsyncThunk(
  'orders/getCurrent',
  async (current: number) => getOrderByNumberApi(current)
);

export const orderBurger = createAsyncThunk(
  'order/submit',
  (data: string[], { dispatch }) =>
    orderBurgerApi(data).finally(() => {
      dispatch(resetConstructor());
    })
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => {
      state.newOrder = null;
      state.loadingNewOrder = false;
    }
  },
  selectors: {
    getOrdersSelector: (state) => state.orders,
    getNewOrderBurgerSelector: (state) => state.newOrder?.order,
    getLoadingNewOrderSelector: (state) => state.loadingNewOrder,
    getCurrentOrderSelector: (state) => state.currentOrder
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(orderBurger.pending, (state) => {
        state.loadingNewOrder = true;
        state.errorNewOrder = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.loadingNewOrder = false;
        state.errorNewOrder = action.error.message;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.loadingNewOrder = false;
        state.newOrder = action.payload;
      })
      .addCase(getCurrentOrder.pending, (state) => {
        state.loadingCurrentOrder = true;
        state.errorCurrentOrder = null;
      })
      .addCase(getCurrentOrder.rejected, (state, action) => {
        state.loadingCurrentOrder = false;
        state.errorCurrentOrder = action.error.message;
      })
      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        state.loadingCurrentOrder = false;
        state.currentOrder = action.payload.orders[0];
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const {
  getOrdersSelector,
  getLoadingNewOrderSelector,
  getNewOrderBurgerSelector,
  getCurrentOrderSelector
} = orderSlice.selectors;
export const { reset } = orderSlice.actions;
