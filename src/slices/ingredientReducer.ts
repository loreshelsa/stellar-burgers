import { getIngredientsApi } from '@api';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error?: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: undefined
};

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

const ingregientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state.ingredients,
    getBunsSelector: (state) =>
      state.ingredients.filter((item) => item.type === 'bun'),
    getMainsSelector: (state) =>
      state.ingredients.filter((item) => item.type === 'main'),
    getSauceSelector: (state) =>
      state.ingredients.filter((item) => item.type === 'sauce'),
    getLoadingSelector: (state) => state.loading,
    getIngredientByIdSelector: (state, id) =>
      state.ingredients.find((item) => item._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

export const ingredientReducer = ingregientSlice.reducer;
export const {
  getIngredientsSelector,
  getBunsSelector,
  getMainsSelector,
  getSauceSelector,
  getLoadingSelector,
  getIngredientByIdSelector
} = ingregientSlice.selectors;
