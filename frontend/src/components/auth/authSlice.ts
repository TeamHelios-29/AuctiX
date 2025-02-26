import { IAuthUser } from '@/Interfaces/IAuthUser';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token?: string | null;
  username?: string | null;
  role?: string | null;
}

const getStoredAuthUser = () => {
  let valiedAuthUser: IAuthUser | null = null;
  try {
    const storedAuthUser = localStorage.getItem('authUser');
    if (storedAuthUser != 'undefined' && storedAuthUser != null) {
      valiedAuthUser = JSON.parse(storedAuthUser) as IAuthUser;
    }
  } catch (e) {
    console.error('AuthData corrupted');
    localStorage.removeItem('authUser');
  }
  return valiedAuthUser;
};

const user = getStoredAuthUser();
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
      state.token = null;
      localStorage.removeItem('authUser');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
