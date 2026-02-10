import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Notification, NotificationState } from "@/types/notification";
import {
  addNotification,
  deleteNotification,
  deleteSelectedNotifications,
  fetchNotifications,
  UpdateNotification,
} from "./notification-thunk";

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: undefined,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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
export default notificationsSlice.reducer;
