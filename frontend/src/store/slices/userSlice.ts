import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IUser } from '@/types/IUser';
import axios from 'axios';
import { IAuthUser } from '@/types/IAuthUser';
import { logout } from './authSlice';

interface UserState extends IUser {
  loading: boolean;
  error?: string | null;
}

const initialState: UserState = {
  username: null,
  email: null,
  firstName: null,
  lastName: null,
  fcmTokens: [],
  profile_photo: null,
  role: null,
  loading: true,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const authUser = (getState() as any).auth as IAuthUser;
      const response = await axios.get(`${baseURL}/user/getCurrentUser`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser?.token}`,
        },
      });
      console.log('Current user data fetched:', response.data);

      // Ensure we have user data in the response
      if (!response.data) {
        return rejectWithValue('No user data received');
      }

      // Add aditional setup for user data
      const userData = {
        ...response.data,
        profile_photo_link: response.data.profilePicture?.id
          ? `${baseURL}/user/getUserProfilePhoto?file_uuid=${response.data.profilePicture.id}`
          : null,
        fcmTokens: response.data.fcmTokens || [],
      };
      delete userData.profilePicture;

      console.log('Processed user data:', userData);
      return userData;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('Unauthorized! logging out...');
        dispatch(logout());
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user data',
      );
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Fetching user data dispatched...');
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.fcmTokens = action.payload.fcmTokens;
        state.profile_photo =
          action.payload.profile_photo_link || '/defaultProfilePhoto.jpg';
        state.role = action.payload.role;
        console.log('User data updated:', action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Error fetching user data:', action.payload);
      });
  },
});

export default userSlice.reducer;
