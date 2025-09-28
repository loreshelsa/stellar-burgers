import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TOrdersDataState = {
  orderIngredients: TIngredient[];
  bun: TIngredient | null;
};

const initialState: TOrdersDataState = {
  orderIngredients: [],
  bun: null
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
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
    moveUpIngregients: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const temp = state.orderIngredients[index];
      state.orderIngredients[index] = state.orderIngredients[index - 1];
      state.orderIngredients[index - 1] = temp;
    },
    moveDownIngregients: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const temp = state.orderIngredients[index];
      state.orderIngredients[index] = state.orderIngredients[index + 1];
      state.orderIngredients[index + 1] = temp;
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.orderIngredients = [];
    }
  },
  selectors: {
    getIngredientsSelector: (state) => state.orderIngredients,
    getBunsSelector: (state) => state.bun
  }
});

export const constructorReducer = constructorSlice.reducer;
export const { getIngredientsSelector, getBunsSelector } =
  constructorSlice.selectors;
export const {
  addIngredients,
  removeIngregients,
  resetConstructor,
  moveUpIngregients,
  moveDownIngregients
} = constructorSlice.actions;
