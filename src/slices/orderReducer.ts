import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TNewOrderResponse
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';

type TOrdersDataState = {
  newOrder: TNewOrderResponse | null;
  orders: TOrder[];
  bun: TIngredient | null;
  error?: string | null;
  loading: boolean;
  orderIngredients: TIngredient[];
  loadingNewOrder: boolean;
  errorNewOrder?: string | null;
  currentOrder: TOrder | null;
  loadingCurrentOrder: boolean;
  errorCurrentOrder?: string | null;
};

const initialState: TOrdersDataState = {
  newOrder: null,
  orders: [],
  bun: null,
  error: null,
  loading: false,
  orderIngredients: [],
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
  async (data: string[]) => orderBurgerApi(data)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredients: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.orderIngredients.push(action.payload);
      }
    },
    removeIngregients: (state, action: PayloadAction<string>) => {
      state.orderIngredients = state.orderIngredients.filter(
        (ingredient) => ingredient._id !== action.payload
      );
    },
    reset: (state) => {
      state.newOrder = null;
      state.loadingNewOrder = false;
      state.bun = null;
      state.orderIngredients = [];
    }
  },
  selectors: {
    getOrdersSelector: (state) => state.orders,
    getIngredientsSelector: (state) => state.orderIngredients,
    getBunsSelector: (state) => state.bun,
    // getOrderByIdSelector: (state, number) =>
    //   state.orders.find((item) => item.number.toString() === number),
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
  getIngredientsSelector,
  // getOrderByIdSelector,
  getLoadingNewOrderSelector,
  getNewOrderBurgerSelector,
  getBunsSelector,
  getCurrentOrderSelector
} = orderSlice.selectors;
export const { addIngredients, removeIngregients, reset } = orderSlice.actions;
