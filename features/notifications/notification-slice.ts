import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationState } from "@/types/notification";
import {
  addNotification,
  deleteNotification,
  deleteSelectedNotifications,
  fetchNotifications,
  fetchNotificationsPage,
  UpdateNotification,
} from "./notification-thunk";

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  isLoadingMore: false,
  page: 1,
  limit: 20,
  total: 0,
  hasMore: false,
  error: undefined,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    markNotificationsRead: (state, action: PayloadAction<number[]>) => {
      const ids = new Set(action.payload);
      state.notifications = state.notifications.map((notification) =>
        ids.has(notification.id)
          ? { ...notification, is_read: true }
          : notification,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // GET all notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.isLoading = false;
          state.notifications = action.payload;
          state.error = undefined;
        },
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // GET paginated notifications
      .addCase(fetchNotificationsPage.pending, (state, action) => {
        const append = Boolean(action.meta.arg.append);
        if (append) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = undefined;
      })
      .addCase(fetchNotificationsPage.fulfilled, (state, action) => {
        const { items, total, page, limit, append } = action.payload;
        state.isLoading = false;
        state.isLoadingMore = false;
        state.total = total;
        state.page = page;
        state.limit = limit;
        state.hasMore = page * limit < total;
        state.notifications = append
          ? [...state.notifications, ...items]
          : items;
        state.error = undefined;
      })
      .addCase(fetchNotificationsPage.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.error.message;
      })

      // ADD notification
      .addCase(addNotification.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        addNotification.fulfilled,
        (state, action: PayloadAction<Notification>) => {
          state.isLoading = false;
          state.error = undefined;
          state.notifications.unshift(action.payload); // prepend new notification
        },
      )
      .addCase(addNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      //UPDATE notification
      .addCase(UpdateNotification.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        UpdateNotification.fulfilled,
        (state, action: PayloadAction<Notification>) => {
          state.isLoading = false;
          state.error = undefined;
          const index = state.notifications.findIndex(
            (r) => r.id === action.payload.id,
          );
          if (index !== -1) {
            state.notifications[index] = action.payload;
          }
        },
      )
      .addCase(UpdateNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // DELETE single notification
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    // DELETE selected or all notifications
    // .addCase(deleteSelectedNotifications.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = undefined;
    // })
    // .addCase(deleteSelectedNotifications.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.error = undefined;
    // })
    // .addCase(deleteSelectedNotifications.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  },
});

export const { setLoading } = notificationsSlice.actions;
export const { markNotificationsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
