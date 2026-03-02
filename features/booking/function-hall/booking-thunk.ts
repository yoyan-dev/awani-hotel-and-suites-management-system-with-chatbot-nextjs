import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  FetchFunctionHallBookingParams,
  FunctionHallBooking,
  FunctionHallBookingPagination,
} from "@/types/function-room-booking";

const apiUrl = "/api/bookings/function-hall";

export const fetchBookings = createAsyncThunk<
  { data: FunctionHallBooking[]; pagination: FunctionHallBookingPagination },
  FetchFunctionHallBookingParams | undefined
>(
  "function-hall-booking/fetchBookings",
  async (params, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.query) searchParams.append("query", params.query);
      if (params?.guest_id) searchParams.append("guest_id", params.guest_id);
      if (params?.event_start) {
        searchParams.append("start", params.event_start);
      }
      if (params?.event_end) {
        searchParams.append("end", params.event_end);
      }
      if (params?.status) searchParams.append("status", params.status);

      const res = await fetch(`${apiUrl}?${searchParams}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch function hall bookings",
        );
      }
      return data as {
        data: FunctionHallBooking[];
        pagination: FunctionHallBookingPagination;
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchBooking = createAsyncThunk<FunctionHallBooking, string>(
  "function-hall-booking/fetchBooking",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch function hall booking",
        );
      }
      return data.data;
    } catch (error: any) {
      addToast({
        title: "Thunk Error",
        description: error.message,
        color: "danger",
      });
      return rejectWithValue(error.message);
    }
  },
);

export const addBooking = createAsyncThunk<FunctionHallBooking, FormData>(
  "function-hall-booking/addBooking",
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
          data.message?.description ?? "Failed to add function hall booking",
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
export const updateBooking = createAsyncThunk<
  FunctionHallBooking,
  FunctionHallBooking,
  { rejectValue: string }
>(
  "function-hall-booking/updateBooking",
  async (booking, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const data = await res.json();
      addToast(data.message);

      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to update function hall booking",
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
export const deleteBooking = createAsyncThunk<string, string>(
  "function-hall-booking/deleteBooking",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete function hall booking",
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
export const deleteSelectedBooking = createAsyncThunk<
  FunctionHallBooking[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>(
  "function-hall-booking/deleteSelectedBooking",
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
