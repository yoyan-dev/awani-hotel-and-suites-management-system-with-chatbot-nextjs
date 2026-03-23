import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Guest } from "@/types/guest";
import { addToast } from "@heroui/react";

const apiUrl = "/api/guest";

export const fetchGuests = createAsyncThunk<Guest[]>(
  "guest/fetchGuests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetch(apiUrl);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch guests"
        );
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGuest = createAsyncThunk<Guest, string>(
  "guest/fetchGuest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch guest"
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
  }
);

export const addGuest = createAsyncThunk<Guest, FormData>(
  "guest/addGuest",
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
          data.message?.description ?? "Failed to add guest"
        );
      }
      return data.data;
    } catch (err: any) {
      console.log(err.message);
      addToast({
        title: "Thunk Error!",
        description: err.message,
        color: "danger",
      });
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE
export const updateGuest = createAsyncThunk<
  Guest,
  Guest,
  { rejectValue: string }
>("guest/updateGuest", async (guest, { rejectWithValue }) => {
  try {
    const res = await apiFetch(`${apiUrl}/${guest.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guest),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(
        data.message?.description ?? "Failed to update guest"
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
});

// DELETE
export const deleteGuest = createAsyncThunk<string, string>(
  "guest/deleteGuest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete guest"
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
  }
);

//  delete selected rooms or all
export const deleteSelectedGuest = createAsyncThunk<
  Guest[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>("guest/deleteSelectedGuest", async ({ selectedValues }, thunkAPI) => {
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

