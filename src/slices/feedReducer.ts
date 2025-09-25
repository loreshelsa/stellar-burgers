import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

type TFeedsState = {
  feeds: TOrdersData;
  error?: string | null;
  loading: boolean;
  orderNumber?: string;
};

const initialState: TFeedsState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  error: undefined,
  loading: false,
  orderNumber: ''
};

export const getFeeds = createAsyncThunk('feed/getAll', async () =>
  getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    addOrderNumber: (state, action: PayloadAction<string | undefined>) => {
      state.orderNumber = action.payload;
    }
  },
  selectors: {
    getFeedsSelector: (state) => state.feeds.orders,
    getFeedOrderByIdSelector: (state, number) =>
      state.feeds.orders.find((item) => item.number.toString() === number),
    getFeedsWithTotalSelector: (state) => state.feeds,
    getFeedsOrderNumber: (state) => state.orderNumber
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload;
      });
  }
});

export const feedReducer = feedSlice.reducer;
export const { addOrderNumber } = feedSlice.actions;
export const {
  getFeedsSelector,
  getFeedsWithTotalSelector,
  getFeedOrderByIdSelector,
  getFeedsOrderNumber
} = feedSlice.selectors;
