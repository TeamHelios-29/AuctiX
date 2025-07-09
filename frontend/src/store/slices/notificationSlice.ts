import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import type {
  Notification,
  NotificationSettingsResponse,
} from '@/types/notification';
import { RootState } from '../store';

interface NotificationState {
  preferences: NotificationSettingsResponse | null;
  items: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  currentPage: number;
  totalPages: number | null;
  categoryGroups: string[];
  readStatusFilter: 'all' | 'unread' | 'read';
}

const initialState: NotificationState = {
  preferences: null,
  items: [],
  loading: false,
  error: null,
  unreadCount: 0,
  currentPage: 1,
  totalPages: null,
  categoryGroups: [],
  readStatusFilter: 'all',
};

// Selectors
export const selectNotifications = (state: RootState) =>
  state.notifications.items;
export const selectCurrentPage = (state: RootState) =>
  state.notifications.currentPage;
export const selectTotalPages = (state: RootState) =>
  state.notifications.totalPages;
export const selectNotificationLoading = (state: RootState) =>
  state.notifications.loading;
export const selectUnreadCount = (state: RootState) =>
  state.notifications.unreadCount;
export const selectCategoryGroups = (state: RootState) =>
  state.notifications.categoryGroups;
export const selectReadStatusFilter = (state: RootState) =>
  state.notifications.readStatusFilter;

const baseURL = import.meta.env.VITE_API_URL;

interface FetchParams {
  page?: number;
  size?: number;
  readStatus?: string;
  categoryGroup?: string;
}

interface PaginatedResponse {
  items: Notification[];
  currentPage: number;
  totalPages: number;
}

interface ErrorResponse {
  message: string;
}

export const fetchNotifications = createAsyncThunk<
  PaginatedResponse,
  FetchParams,
  { state: RootState; rejectValue: string }
>('notification/fetch', async (params = {}, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const {
      page = 0,
      size = 10,
      readStatus = 'all',
      categoryGroup = 'all',
    } = params;

    const response = await axios.get(`${baseURL}/notification/`, {
      params: { page, size, readStatus, categoryGroup },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });

    const data = response.data;

    return {
      items: data.content,
      currentPage: data.number + 1, // because page number is zero-based
      totalPages: data.totalPages,
    };
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch notifications',
    );
  }
});

export const fetchCategoryGroups = createAsyncThunk<
  string[],
  void,
  { state: RootState; rejectValue: string }
>(
  'notification/fetchCategoryGroups',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const response = await axios.get(
        `${baseURL}/notification/category-groups`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );

      return response.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category groups',
      );
    }
  },
);

export const refreshNotifications = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('notification/refresh', async (_, { getState, dispatch }) => {
  const { notifications } = getState();

  await dispatch(
    fetchNotifications({
      page: notifications.currentPage - 1,
      size: 10,
      readStatus: notifications.readStatusFilter,
    }),
  );
});

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

export const markNotificationRead = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>('notification/markRead', async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.post(
      `${baseURL}/notification/${id}/read`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );
    return id;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    return rejectWithValue(
      error.response?.data?.message || 'Failed to mark notification as read',
    );
  }
});

export const markNotificationUnread = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>('notification/markUnread', async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.post(
      `${baseURL}/notification/${id}/unread`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );
    return id;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    return rejectWithValue(
      error.response?.data?.message || 'Failed to mark notification as unread',
    );
  }
});

export const removeNotification = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>('notification/delete', async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    await axios.delete(`${baseURL}/notification/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return id;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete notification',
    );
  }
});

export const markAllNotificationsRead = createAsyncThunk<
  boolean,
  void,
  { state: RootState; rejectValue: string }
>(
  'notification/markAllRead',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth, notifications } = getState();
      await axios.post(
        `${baseURL}/notification/mark-all-read`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );

      await dispatch(
        fetchNotifications({
          page: notifications.currentPage - 1,
          size: 10,
          readStatus: notifications.readStatusFilter,
        }),
      );

      return true;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to mark all notifications as read',
      );
    }
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setReadStatusFilter: (
      state,
      action: PayloadAction<'all' | 'read' | 'unread'>,
    ) => {
      state.readStatusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch notifications';
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch unread count';
      })
      .addCase(fetchCategoryGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryGroups = action.payload;
      })
      .addCase(fetchCategoryGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch category groups';
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
        }
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload || 'Failed to mark notification as read';
      })
      .addCase(markNotificationUnread.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n.id === action.payload);
        if (notification && notification.read) {
          notification.read = false;
        }
      })
      .addCase(markNotificationUnread.rejected, (state, action) => {
        state.error = action.payload || 'Failed to mark notification as unread';
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      })
      .addCase(removeNotification.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete notification';
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.read = true;
        });
        state.loading = false;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || 'Failed to mark all notifications as read';
      });
  },
});

export const { resetError, setReadStatusFilter } = notificationSlice.actions;
export default notificationSlice.reducer;
