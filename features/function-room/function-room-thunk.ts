import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  FetchFunctionRoomParams,
  FunctionRoom,
  FunctionRoomPagination,
} from "@/types/function-room";

export const fetchFunctionRooms = createAsyncThunk<
  { data: FunctionRoom[]; pagination: FunctionRoomPagination },
  FetchFunctionRoomParams | undefined
>("room/fetchFunctionRooms", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.query) searchParams.append("q", params.query);
    if (params?.status) searchParams.append("status", params.status);

    const res = await fetch(`/api/function-rooms?${searchParams.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message ?? "Failed to fetch function rooms");
      return rejectWithValue(data.message ?? "Failed to fetch function rooms");
    }

    return data as {
      data: FunctionRoom[];
      pagination: FunctionRoomPagination;
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchFunctionRoom = createAsyncThunk<FunctionRoom, string>(
  "room/fetchFunctionRoom",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/function-rooms/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch function room"
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

// export const fetchAvailableFunctionRooms = createAsyncThunk<
//   { data: Room[] },
//   FetchRoomsParams | undefined
// >("room/fetchAvailableFunctionRooms", async (params, { rejectWithValue }) => {
//   try {
//     const searchParams = new URLSearchParams();
//     if (params?.status) searchParams.append("status", params.status);
//     if (params?.checkIn) searchParams.append("checkIn", params.checkIn);
//     if (params?.checkOut) searchParams.append("checkOut", params.checkOut);

//     const res = await fetch(
//       `/api/function-function-rooms/available-rooms?${searchParams.toString()}`
//     );
//     const data = await res.json();

//     if (!res.ok || !data.success) {
//       addToast(data.message ?? "Failed to fetch rooms");
//       return rejectWithValue(data.message ?? "Failed to fetch rooms");
//     }

//     return data;
//   } catch (error: any) {
//     return rejectWithValue(error.message);
//   }
// });

export const addFunctionRoom = createAsyncThunk<FunctionRoom, FormData>(
  "room/addFunctionRoom",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/function-rooms", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to add function room"
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
export const updateFunctionRoom = createAsyncThunk<
  FunctionRoom,
  FunctionRoom,
  { rejectValue: string }
>("room/updateFunctionRoom", async (room, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/function-rooms/${room.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    });

    const data = await res.json();
    addToast(data.message);

    if (!res.ok || !data.success) {
      return rejectWithValue(
        data.message?.description ?? "Failed to update function room"
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
export const deleteFunctionRoom = createAsyncThunk<string, string>(
  "room/deleteFunctionRoom",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/function-rooms/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete function room"
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
export const deleteFunctionRooms = createAsyncThunk<
  FunctionRoom[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>(
  "function-rooms/deleteFunctionRooms",
  async ({ selectedValues }, thunkAPI) => {
    try {
      const body =
        selectedValues === "all"
          ? { selectedValues: "all" }
          : { selectedValues: Array.from(selectedValues) };

      const res = await fetch("/api/function-rooms", {
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
  }
);
