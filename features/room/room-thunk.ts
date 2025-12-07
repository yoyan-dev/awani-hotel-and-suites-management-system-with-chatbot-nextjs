import { createAsyncThunk } from "@reduxjs/toolkit";
import type { FetchRoomsParams, Room, RoomPagination } from "@/types/room";
import { addToast } from "@heroui/react";

//analytics
export const fetchAnalytics = createAsyncThunk<any>(
  "room/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/rooms/analytics`);
      const data = await res.json();

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

export const fetchRooms = createAsyncThunk<
  { data: Room[]; pagination: RoomPagination },
  FetchRoomsParams | undefined
>("room/fetchRooms", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.query) searchParams.append("q", params.query);
    if (params?.roomTypeID)
      searchParams.append("roomTypeID", params.roomTypeID);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.selectedDate)
      searchParams.append("selectedDate", params.selectedDate);

    const res = await fetch(`/api/rooms?${searchParams.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message ?? "Failed to fetch rooms");
      return rejectWithValue(data.message ?? "Failed to fetch rooms");
    }

    return data as {
      data: Room[];
      pagination: RoomPagination;
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchRoom = createAsyncThunk<Room, string>(
  "room/fetchRoom",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/rooms/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch room"
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

export const fetchAvailableRooms = createAsyncThunk<
  { data: Room[] },
  FetchRoomsParams | undefined
>("room/fetchAvailableRooms", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.isStatusSelected)
      searchParams.append("isStatusSelected", String(params.isStatusSelected));
    if (params?.roomTypeID)
      searchParams.append("roomTypeId", params.roomTypeID);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.checkIn) searchParams.append("checkIn", params.checkIn);
    if (params?.checkOut) searchParams.append("checkOut", params.checkOut);

    const res = await fetch(
      `/api/rooms/available-rooms?${searchParams.toString()}`
    );
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message ?? "Failed to fetch rooms");
      return rejectWithValue(data.message ?? "Failed to fetch rooms");
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const addRoom = createAsyncThunk<Room, FormData>(
  "room/addRoom",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add room"
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
  }
);

// UPDATE
export const updateRoom = createAsyncThunk<Room, Room, { rejectValue: string }>(
  "room/updateRoom",
  async (room, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(room),
      });

      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to update room"
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
  }
);

// DELETE
export const deleteRoom = createAsyncThunk<string, string>(
  "room/deleteRoom",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete room"
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
export const deleteRooms = createAsyncThunk<
  Room[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>("rooms/deleteRooms", async ({ selectedValues }, thunkAPI) => {
  try {
    const body =
      selectedValues === "all"
        ? { selectedValues: "all" }
        : { selectedValues: Array.from(selectedValues) };

    const res = await fetch("/api/rooms", {
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
