import { IAuthUser } from '@/types/IAuthUser';
import { getStoredAuthUser } from '@/services/authService';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  token?: string | null;
  role?: string | null;
  isUserLoggedIn?: boolean;
}

const initialState: AuthState = {
  token: null,
  role: null,
  isUserLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IAuthUser>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isUserLoggedIn = true;
      localStorage.setItem(
        'authUser',
        JSON.stringify({
          token: action.payload.token,
          role: action.payload.role,
        } as IAuthUser),
      );
    },
    logout: (state) => {
      localStorage.removeItem('authUser');
      state.token = null;
      state.role = null;
      state.isUserLoggedIn = false;
    },
    restoreUser: (state) => {
      const storedAuthUser = getStoredAuthUser();
      if (storedAuthUser) {
        state.token = storedAuthUser.token;
        state.role = storedAuthUser.role;
        state.isUserLoggedIn = true;
      } else {
        state.token = null;
        state.role = null;
        state.isUserLoggedIn = false;
      }
    },
  },
});

export const { login, logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;
