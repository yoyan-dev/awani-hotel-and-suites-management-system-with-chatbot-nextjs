import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import { GuestRequest } from "@/types/gues-request";

const apiUrl = "/api/guest-requests";

export const fetchGuestRequests = createAsyncThunk<GuestRequest[]>(
  "inventory/fetchGuestRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch guest requests",
        );
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchGuestRequest = createAsyncThunk<GuestRequest, string>(
  "inventory/fetchGuestRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch guest request",
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

export const addGuestRequest = createAsyncThunk<GuestRequest, FormData>(
  "inventory/addGuestRequest",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add guest request",
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
export const updateGuestRequest = createAsyncThunk<
  GuestRequest,
  GuestRequest,
  { rejectValue: string }
>(
  "inventory/updateGuestRequest",
  async (guest_request, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${guest_request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guest_request),
      });

      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to update guest request",
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

// DELETE
export const deleteGuestRequest = createAsyncThunk<string, string>(
  "inventory/deleteGuestRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete guest request",
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

//  delete selected rooms or all
export const deleteSelectedGuestRequest = createAsyncThunk<
  GuestRequest[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>(
  "inventory/deleteSelectedGuestRequest",
  async ({ selectedValues }, thunkAPI) => {
    try {
      const body =
        selectedValues === "all"
          ? { selectedValues: "all" }
          : { selectedValues: Array.from(selectedValues) };

      const res = await fetch(apiUrl, {
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
  },
);
