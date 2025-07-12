import { IAuthUser } from '@/types/IAuthUser';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from './authSlice';
import { IPendingAction } from '@/types/IPendingAction';

interface PendingActionState {
  loading: boolean;
  error: string | null;
  pendingActions: IPendingAction[];
}

const initialState: PendingActionState = {
  loading: true,
  error: null,
  pendingActions: [],
};

export const fetchPendingRequiredActions = createAsyncThunk(
  'requiredActions/fetchRequiredActions',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const authUser = (getState() as any).auth as IAuthUser;
      const response = await axios.get(
        `${baseURL}/user/getUserRequiredActions`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUser?.token}`,
          },
        },
      );
      console.log('pending required actions fetched:', response.data);

      if (!response.data) {
        return rejectWithValue('No user data received');
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('Unauthorized! logging out...');
        dispatch(logout());
      }
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch pending required actions',
      );
    }
  },
);

const requiredActionsSlice = createSlice({
  name: 'requiredActions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRequiredActions.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Fetching pending actions dispatched...');
      })
      .addCase(fetchPendingRequiredActions.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingActions = action.payload.map((recode: any) => {
          return {
            ...recode,
            actionType: recode.actionType || null,
          };
        });
        console.log('pending actions updated:', action.payload);
      })
      .addCase(fetchPendingRequiredActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Error fetching pending actions:', action.payload);
      });
  },
});

export default requiredActionsSlice.reducer;
