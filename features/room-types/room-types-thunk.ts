import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchRoomTypesParams, RoomType } from "@/types/room";
import { addToast } from "@heroui/react";

const apiUrl = "/api/room-types";

export const fetchRoomTypes = createAsyncThunk<
  RoomType[],
  FetchRoomTypesParams | undefined
>("roomTypes/fetchRoomTypes", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append("q", params.query);
    if (params?.maxGuest)
      searchParams.append("maxGuest", params.maxGuest.toString());
    const res = await apiFetch(`${apiUrl}?${searchParams}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message);
      return rejectWithValue(
        data.message?.description ?? "Failed to fetch room types",
      );
    }
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchRoomType = createAsyncThunk<RoomType, string>(
  "roomTypes/fetchRoomType",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch room type",
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

export const fetchAvailableRoomTypes = createAsyncThunk<
  RoomType[],
  FetchRoomTypesParams | undefined
>("roomTypes/fetchAvailableRoomTypes", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.checkIn) searchParams.append("checkIn", params.checkIn);
    if (params?.checkOut) searchParams.append("checkOut", params.checkOut);
    if (params?.maxGuest)
      searchParams.append("maxGuest", params.maxGuest.toString());
    const res = await apiFetch(`${apiUrl}/available-room-types?${searchParams}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message);
      return rejectWithValue(
        data.message?.description ?? "Failed to fetch room types",
      );
    }
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const addRoomType = createAsyncThunk<RoomType, FormData>(
  "roomTypes/addRoomType",
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
          data.message?.description ?? "Failed to add item in room type",
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
export const updateRoomType = createAsyncThunk<
  RoomType,
  RoomType,
  { rejectValue: string }
>("roomTypes/updateRoomType", async (inventory, { rejectWithValue }) => {
  try {
    const res = await apiFetch(`${apiUrl}/${inventory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inventory),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(
        data.message?.description ?? "Failed to update room types",
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
export const deleteRoomType = createAsyncThunk<string, string>(
  "roomTypes/deleteRoomType",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete item",
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

