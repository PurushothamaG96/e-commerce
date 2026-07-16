import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  image: string;
  accessToken: string;
}

interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

interface LoginArgs {
  username: string;
  password: string;
}

/**
 * Async thunk demonstrating the classic createAsyncThunk pattern
 * (pending / fulfilled / rejected) alongside RTK Query.
 *
 * DummyJSON test credentials: username "emilys", password "emilyspass".
 */
export const login = createAsyncThunk<AuthUser, LoginArgs, { rejectValue: string }>(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 30 }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { message?: string };
        return rejectWithValue(body.message ?? 'Invalid credentials');
      }
      return (await res.json()) as AuthUser;
    } catch {
      return rejectWithValue('Network error — please try again.');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Login failed';
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.user !== null;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
