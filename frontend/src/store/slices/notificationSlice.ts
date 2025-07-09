import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type { Notification } from '@/types/notification';
import { RootState } from '../store';

interface NotificationState {
  latestItems: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  latestItems: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Selectors
export const selectLatestNotifications = (state: RootState) =>
  state.notifications.latestItems;
export const selectUnreadCount = (state: RootState) =>
  state.notifications.unreadCount;
export const selectNotificationLoading = (state: RootState) =>
  state.notifications.loading;
export const selectNotificationError = (state: RootState) =>
  state.notifications.error;

const baseURL = import.meta.env.VITE_API_URL;

interface ErrorResponse {
  message: string;
}

export const fetchLatestNotifications = createAsyncThunk<
  Notification[],
  number | undefined,
  { state: RootState; rejectValue: string }
>(
  'notification/fetchLatest',
  async (size = 5, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${baseURL}/notification/`, {
        params: { page: 0, size, readStatus: 'all', categoryGroup: 'all' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data.content;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch latest notifications',
      );
    }
  },
);

export const fetchUnreadCount = createAsyncThunk<
  number,
  void,
  { state: RootState; rejectValue: string }
>('notification/fetchUnreadCount', async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${baseURL}/notification/unread-count`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch unread count',
    );
  }
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.latestItems = action.payload;
      })
      .addCase(fetchLatestNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch latest notifications';
      })
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch unread count';
      });
  },
});

export const {
  resetError,
  decrementUnreadCount,
  incrementUnreadCount,
  setUnreadCount,
} = notificationSlice.actions;
export default notificationSlice.reducer;
