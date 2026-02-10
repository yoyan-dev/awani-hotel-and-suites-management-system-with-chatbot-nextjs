import { createAsyncThunk } from "@reduxjs/toolkit";
import { Notification } from "@/types/notification";
import { addToast } from "@heroui/react";

const apiUrl = "/api/notifications";

// FETCH ALL
export const fetchNotifications = createAsyncThunk<Notification[]>(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch notifications",
        );
      }
      return data.data;
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
      });
      return rejectWithValue(error.message);
    }
  },
);

// FETCH SINGLE NOTIFICATION
export const fetchNotification = createAsyncThunk<Notification, string>(
  "notifications/fetchNotification",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch notification",
        );
      }
      return data.data;
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
      });
      return rejectWithValue(error.message);
    }
  },
);

// ADD NEW NOTIFICATION
export const addNotification = createAsyncThunk<Notification, Notification>(
  "notifications/addNotification",
  async (notification, { rejectWithValue }) => {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });
      const data = await res.json();
      // addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add notification",
        );
      }

      return data.data;
    } catch (err: any) {
      // addToast({
      //   title: "Error",
      //   description: err.message,
      //   color: "danger",
      // });
      return rejectWithValue(err.message);
    }
  },
);

// UPDATE
export const UpdateNotification = createAsyncThunk<
  Notification,
  Notification,
  { rejectValue: string }
>(
  "notifications/UpdateNotification",
  async (notification, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${notification.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });

      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to update notification",
        );
      }

      return data.data;
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger",
      });
      return rejectWithValue(err.message);
    }
  },
);

// DELETE NOTIFICATION
export const deleteNotification = createAsyncThunk<string, string>(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete notification",
        );
      }

      return data.data;
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message,
        color: "danger",
      });
      return rejectWithValue(err.message);
    }
  },
);

// DELETE SELECTED OR ALL NOTIFICATIONS
export const deleteSelectedNotifications = createAsyncThunk<Notification[]>(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(apiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      // addToast(data.message);

      if (!res.ok) return rejectWithValue(data.error);

      return [];
    } catch (err: any) {
      // addToast({
      //   title: "Error",
      //   description: err.message,
      //   color: "danger",
      // });
      return rejectWithValue(err.message);
    }
  },
);
