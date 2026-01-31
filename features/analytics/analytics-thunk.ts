import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  BookingAnalyticsParams,
  BookingAnalyticsResponse,
  FunctionHallAnalyticsParams,
  FunctionHallAnalyticsResponse,
} from "@/types/analytics";
import { FunctionHallBooking } from "@/types/function-room-booking";

const apiUrl = "/api/analytics";

export const bookingAnalytics = createAsyncThunk<
  BookingAnalyticsResponse,
  BookingAnalyticsParams | undefined,
  { rejectValue: string }
>("analytics/bookingAnalytics", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    // Filters
    if (params?.status) {
      searchParams.append("status", params.status);
    }

    if (params?.booking_source) {
      searchParams.append("booking_source", params.booking_source);
    }

    // Date range (priority)
    if (params?.start && params?.end) {
      searchParams.append("start", params.start);
      searchParams.append("end", params.end);
    }

    // Single date
    else if (params?.date) {
      searchParams.append("date", params.date);
    }

    const res = await fetch(`${apiUrl}/bookings?${searchParams.toString()}`);

    const data = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description: data?.error ?? "Failed to fetch booking analytics",
        color: "danger",
      });

      return rejectWithValue(
        data?.error ?? "Failed to fetch booking analytics",
      );
    }

    return data.data as BookingAnalyticsResponse;
  } catch (err) {
    console.error("Error fetching booking analytics:", err);

    return rejectWithValue("Failed to fetch booking analytics");
  }
});

export const functionHallAnalytics = createAsyncThunk<
  FunctionHallAnalyticsResponse, // ✅ Correct return type
  FunctionHallAnalyticsParams | undefined,
  { rejectValue: string }
>("analytics/functionHallAnalytics", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    // Filters
    if (params?.status) {
      searchParams.append("status", params.status);
    }

    // Date range (priority)
    if (params?.start && params?.end) {
      searchParams.append("start", params.start);
      searchParams.append("end", params.end);
    }

    // Single date (optional fallback)
    else if (params?.date) {
      searchParams.append("date", params.date);
    }

    const res = await fetch(
      `${apiUrl}/function-hall-bookings?${searchParams.toString()}`,
    );

    const data = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description: data?.error ?? "Failed to fetch function hall analytics",
        color: "danger",
      });

      return rejectWithValue(
        data?.error ?? "Failed to fetch function hall analytics",
      );
    }

    return data.data as FunctionHallAnalyticsResponse;
  } catch (err) {
    console.error("Error fetching function hall analytics:", err);
    return rejectWithValue("Failed to fetch function hall analytics");
  }
});
