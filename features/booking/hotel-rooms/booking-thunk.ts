import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Booking,
  BookingPagination,
  FetchBookingParams,
} from "@/types/booking";
import { addToast } from "@heroui/react";

const apiUrl = "/api/bookings/hotel-rooms";

export const fetchBookings = createAsyncThunk<
  { data: Booking[]; pagination: BookingPagination },
  FetchBookingParams | undefined
>("booking/fetchBookings", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.query) searchParams.append("query", params.query);
    if (params?.guest_id) searchParams.append("guest_id", params.guest_id);
    if (params?.check_in) searchParams.append("check_in", params.check_in);
    if (params?.check_out) searchParams.append("check_out", params.check_out);
    if (params?.date_range) {
      searchParams.append("start", params.date_range.start);
      searchParams.append("end", params.date_range.end);
    }
    if (params?.roomTypeID)
      searchParams.append("roomTypeID", params.roomTypeID);
    if (params?.status) searchParams.append("status", params.status);

    const res = await fetch(`${apiUrl}?${searchParams}`);
    const response = await res.json();

    if (!res.ok || !response.success) {
      addToast({
        title: "Error",
        description:
          response.message?.description ?? "Failed to fetch bookings",
        color: "danger",
      });
      return rejectWithValue(
        response.message?.description ?? "Failed to fetch bookings",
      );
    }
    return {
      data: response.data as Booking[],
      pagination: response.pagination as BookingPagination,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchBooking = createAsyncThunk<Booking, string>(
  "booking/fetchBooking",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        addToast(data.message);
        return rejectWithValue(
          data.message?.description ?? "Failed to fetch booking",
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

export const addBooking = createAsyncThunk<Booking, FormData>(
  "booking/addBooking",
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
          data.message?.description ?? "Failed to add booking",
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
  Booking,
  Booking,
  { rejectValue: string }
>("booking/updateBooking", async (booking, { rejectWithValue }) => {
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
        data.message?.description ?? "Failed to update booking",
      );
    }

    return data.room;
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
export const deleteBooking = createAsyncThunk<string, string>(
  "booking/deleteBooking",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to delete booking",
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
  Booking[],
  { selectedValues: Set<number> | "all" },
  { rejectValue: string }
>("booking/deleteSelectedBooking", async ({ selectedValues }, thunkAPI) => {
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
});
