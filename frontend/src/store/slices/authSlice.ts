import { IAuthUser } from '@/types/IAuthUser';
import { getStoredAuthUser } from '@/services/authService';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token?: string | null;
  username?: string | null;
  role?: string | null;
}

export const user = getStoredAuthUser();

const initialState: AuthState = {
  token: user?.token,
  username: user?.username,
  role: user?.role,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IAuthUser>) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.role = action.payload.role;
      localStorage.setItem(
        'authUser',
        JSON.stringify({
          token: action.payload.token,
          username: action.payload.username,
          role: action.payload.role,
        } as IAuthUser),
      );
    },
    logout: (state) => {
      localStorage.removeItem('authUser');
      state.token = null;
      state.role = null;
      state.username = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
