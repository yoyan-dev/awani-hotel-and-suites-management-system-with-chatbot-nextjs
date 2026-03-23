import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, UserFormData } from "@/types/users";
import { addToast } from "@heroui/react";

const apiUrl = "/api/users";

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetch(apiUrl);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch users",
        );
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchUser = createAsyncThunk<User, string>(
  "users/fetchUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch user",
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

export const addUser = createAsyncThunk<User, FormData>(
  "users/addUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiFetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add register new user",
        );
      }
      return data.data;
    } catch (err: any) {
      console.log(err.message);
      addToast({
        title: "Error",
        description: err.message,
        color: "danger",
      });
      return rejectWithValue(err.message);
    }
  },
);

// UPDATE
export const updateUser = createAsyncThunk<User, User, { rejectValue: string }>(
  "users/updateUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to update user",
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

//UPDATE PROFILE
export const updateUserProfile = createAsyncThunk<
  User,
  UserFormData,
  { rejectValue: string }
>("users/updateUserProfile", async (user, { rejectWithValue }) => {
  try {
    const res = await apiFetch(`${apiUrl}/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(
        data.message?.description ?? "Failed to update user",
      );
    }

    return {} as User;
  } catch (err: any) {
    addToast({
      title: "Error",
      description: err.message,
      color: "danger",
    });
    return rejectWithValue(err.message);
  }
});

// DELETE
export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete user",
        );
      }

      return data.data;
    } catch (error: any) {
      addToast({
        title: "Error",
        description: `Thunk Error: ${error.message}`,
        color: "danger",
      });
      return rejectWithValue(error.message);
    }
  },
);

//  delete selected rooms or all
export const deleteSelectedUser = createAsyncThunk<
  User[],
  { selectedValues: Set<string> | "all" },
  { rejectValue: string }
>("users/deleteSelectedUser", async ({ selectedValues }, thunkAPI) => {
  try {
    const body =
      selectedValues === "all"
        ? { selectedValues: "all" }
        : { selectedValues: Array.from(selectedValues) };

    const res = await apiFetch(apiUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    addToast(data.message);
    if (!res.ok) return thunkAPI.rejectWithValue(data.error);

    return data.data;
  } catch (err: any) {
    addToast({
      title: "Error",
      description: err.message,
      color: "danger",
    });
    return thunkAPI.rejectWithValue(err.message);
  }
});


