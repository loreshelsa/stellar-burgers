import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi, loginUserApi, registerUserApi, updateUserApi } from '@api';
import { TLoginData, TRegisterData } from '../utils/burger-api';
import { getCookie } from '../utils/cookie';
import { TUser } from '@utils-types';

type TAuthState = {
  form: TLoginData;
  error: string | null;
  sending: boolean;
  registerForm: TRegisterData;
  registerError: string | null;
  registerSending: boolean;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  user: TUser | null;
  checkUserAuthSending: boolean;
  checkUserAuthError: string | null;
  updateForm: Partial<TRegisterData>;
  updateUserError: string | null;
  updateUserSending: boolean;
};

export type TFieldType<T> = {
  field: keyof T;
  value: string;
};

const initialState: TAuthState = {
  form: {
    email: '',
    password: ''
  },
  registerForm: {
    email: '',
    password: '',
    name: ''
  },
  updateForm: {
    email: '',
    password: '',
    name: ''
  },
  error: null,
  sending: false,
  registerError: null,
  registerSending: false,
  isAuthenticated: false,
  isAuthChecked: false,
  user: null,
  checkUserAuthSending: false,
  checkUserAuthError: null,
  updateUserError: null,
  updateUserSending: false
};

export const login = createAsyncThunk('auth/login', async (data: TLoginData) =>
  loginUserApi(data)
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const updateUser = createAsyncThunk(
  'auth/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const checkUserAuth = createAsyncThunk(
  'auth/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      return getUserApi().finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormValue: (state, action: PayloadAction<TFieldType<TLoginData>>) => {
      state.form[action.payload.field] = action.payload.value;
    },
    setRegisterFormValue: (
      state,
      action: PayloadAction<TFieldType<TRegisterData>>
    ) => {
      state.registerForm[action.payload.field] = action.payload.value;
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    reset: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  selectors: {
    sendingSelector: (state) => state.sending,
    sendErrorSelector: (state) => state.error,
    authSelector: (state) => state.form,

    sendingRegisterSelector: (state) => state.registerSending,
    sendErrorRegisterSelector: (state) => state.registerError,
    registerSelector: (state) => state.registerForm,

    authenticatedSelector: (state) => state.isAuthenticated,
    authCheckedSelector: (state) => state.isAuthChecked,
    userDataSelector: (state) => state.user
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
        state.sending = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.sending = false;
        state.isAuthChecked = true;
        state.error = action.error.message ?? null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.sending = false;
      })
      .addCase(register.pending, (state) => {
        state.registerError = null;
        state.registerSending = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerSending = false;
        state.registerError = action.error.message ?? null;
      })
      .addCase(register.fulfilled, (state) => {
        state.registerSending = false;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.checkUserAuthError = null;
        state.checkUserAuthSending = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.checkUserAuthSending = false;
        state.checkUserAuthError = action.error.message ?? null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.checkUserAuthSending = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
        state.updateUserSending = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserSending = false;
        state.updateUserError = action.error.message ?? null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUserSending = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
      });
  }
});

export const authReducer = authSlice.reducer;
export const { setRegisterFormValue, authChecked, setFormValue, reset } =
  authSlice.actions;

export const {
  sendingSelector,
  sendErrorSelector,
  authSelector,
  authenticatedSelector,
  authCheckedSelector,
  userDataSelector
} = authSlice.selectors;
