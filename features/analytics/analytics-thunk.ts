import { apiFetch } from "@/lib/api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToast } from "@heroui/react";
import {
  BookingAnalyticsParams,
  BookingAnalyticsResponse,
  FunctionHallAnalyticsParams,
  FunctionHallAnalyticsResponse,
  RoomAnalyticsParams,
  RoomAnalyticsResponse,
  FunctionRoomAnalyticsParams,
  FunctionRoomAnalyticsResponse,
  DashboardSummaryParams,
  DashboardSummaryResponse,
  FilterParams,
  BookingOverviewParams,
  BookingOverviewResponse,
  Booking,
  FunctionHallBooking,
  Room,
  FunctionRoom,
} from "@/types/analytics";

const apiUrl = "/api/analytics";

export const bookingAnalytics = createAsyncThunk<
  BookingAnalyticsResponse,
  BookingAnalyticsParams | undefined,
  { rejectValue: string }
>("analytics/bookingAnalytics", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append("status", params.status);
    }
    if (params?.booking_source) {
      searchParams.append("booking_source", params.booking_source);
    }
    if (params?.start && params?.end) {
      searchParams.append("start", params.start);
      searchParams.append("end", params.end);
    } else if (params?.date) {
      searchParams.append("date", params.date);
    }
    if (params?.room_type_id) {
      searchParams.append("room_type_id", params.room_type_id);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const res = await apiFetch(`${apiUrl}/bookings?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch booking analytics",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch booking analytics",
      );
    }

    return response.data as BookingAnalyticsResponse;
  } catch (err) {
    console.error("Error fetching booking analytics:", err);
    return rejectWithValue("Failed to fetch booking analytics");
  }
});

export const functionHallAnalytics = createAsyncThunk<
  FunctionHallAnalyticsResponse,
  FunctionHallAnalyticsParams | undefined,
  { rejectValue: string }
>("analytics/functionHallAnalytics", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append("status", params.status);
    }
    if (params?.event_type) {
      searchParams.append("event_type", params.event_type);
    }
    if (params?.start && params?.end) {
      searchParams.append("start", params.start);
      searchParams.append("end", params.end);
    } else if (params?.date) {
      searchParams.append("date", params.date);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const res = await apiFetch(
      `${apiUrl}/function-hall-bookings?${searchParams.toString()}`,
    );
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch function hall analytics",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch function hall analytics",
      );
    }

    return response.data as FunctionHallAnalyticsResponse;
  } catch (err) {
    console.error("Error fetching function hall analytics:", err);
    return rejectWithValue("Failed to fetch function hall analytics");
  }
});

export const roomAnalytics = createAsyncThunk<
  RoomAnalyticsResponse,
  RoomAnalyticsParams | undefined,
  { rejectValue: string }
>("analytics/roomAnalytics", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append("status", params.status);
    }
    if (params?.room_type_id) {
      searchParams.append("room_type_id", params.room_type_id);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const res = await apiFetch(`${apiUrl}/rooms?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch room analytics",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch room analytics",
      );
    }

    return response.data as RoomAnalyticsResponse;
  } catch (err) {
    console.error("Error fetching room analytics:", err);
    return rejectWithValue("Failed to fetch room analytics");
  }
});

export const functionRoomAnalytics = createAsyncThunk<
  FunctionRoomAnalyticsResponse,
  FunctionRoomAnalyticsParams | undefined,
  { rejectValue: string }
>("analytics/functionRoomAnalytics", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append("status", params.status);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const res = await apiFetch(
      `${apiUrl}/function-rooms?${searchParams.toString()}`,
    );
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch function room analytics",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch function room analytics",
      );
    }

    return response.data as FunctionRoomAnalyticsResponse;
  } catch (err) {
    console.error("Error fetching function room analytics:", err);
    return rejectWithValue("Failed to fetch function room analytics");
  }
});

export const getDashboardSummary = createAsyncThunk<
  DashboardSummaryResponse,
  DashboardSummaryParams | undefined,
  { rejectValue: string }
>("analytics/dashboardSummary", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.start) {
      searchParams.append("start", params.start);
    }
    if (params?.end) {
      searchParams.append("end", params.end);
    }

    const res = await apiFetch(`${apiUrl}/dashboard?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch dashboard summary",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch dashboard summary",
      );
    }

    return response.data as DashboardSummaryResponse;
  } catch (err) {
    console.error("Error fetching dashboard summary:", err);
    return rejectWithValue("Failed to fetch dashboard summary");
  }
});

type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

export const fetchPaginatedBookings = createAsyncThunk<
  PaginatedResult<Booking>,
  FilterParams | undefined,
  { rejectValue: string }
>("analytics/fetchPaginatedBookings", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append("status", params.status);
    }
    if (params?.booking_source) {
      searchParams.append("booking_source", params.booking_source);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }
    if (params?.sort_by) {
      searchParams.append("sort_by", params.sort_by);
    }
    if (params?.sort_order) {
      searchParams.append("sort_order", params.sort_order);
    }

    const res = await apiFetch(`${apiUrl}/bookings?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description: response.error?.message ?? "Failed to fetch bookings",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch bookings",
      );
    }

    return response.data as PaginatedResult<Booking>;
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return rejectWithValue("Failed to fetch bookings");
  }
});

export const fetchPaginatedFunctionHallBookings = createAsyncThunk<
  PaginatedResult<FunctionHallBooking>,
  FilterParams | undefined,
  { rejectValue: string }
>(
  "analytics/fetchPaginatedFunctionHallBookings",
  async (params, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.event_type) {
        searchParams.append("event_type", params.event_type);
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.page) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.limit) {
        searchParams.append("limit", params.limit.toString());
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const res = await apiFetch(
        `${apiUrl}/function-hall-bookings?${searchParams.toString()}`,
      );
      const response = await res.json();

      if (!res.ok) {
        addToast({
          title: "Error",
          description:
            response.error?.message ?? "Failed to fetch function hall bookings",
          color: "danger",
        });
        return rejectWithValue(
          response.error?.message ?? "Failed to fetch function hall bookings",
        );
      }

      return response.data as PaginatedResult<FunctionHallBooking>;
    } catch (err) {
      console.error("Error fetching function hall bookings:", err);
      return rejectWithValue("Failed to fetch function hall bookings");
    }
  },
);

export const fetchPaginatedRooms = createAsyncThunk<
  PaginatedResult<Room>,
  FilterParams | undefined,
  { rejectValue: string }
>("analytics/fetchPaginatedRooms", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append("status", params.status);
    }
    if (params?.room_type_id) {
      searchParams.append("room_type_id", params.room_type_id);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }
    if (params?.sort_by) {
      searchParams.append("sort_by", params.sort_by);
    }
    if (params?.sort_order) {
      searchParams.append("sort_order", params.sort_order);
    }

    const res = await apiFetch(`${apiUrl}/rooms?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description: response.error?.message ?? "Failed to fetch rooms",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch rooms",
      );
    }

    return response.data as PaginatedResult<Room>;
  } catch (err) {
    console.error("Error fetching rooms:", err);
    return rejectWithValue("Failed to fetch rooms");
  }
});

export const fetchPaginatedFunctionRooms = createAsyncThunk<
  PaginatedResult<FunctionRoom>,
  FilterParams | undefined,
  { rejectValue: string }
>(
  "analytics/fetchPaginatedFunctionRooms",
  async (params, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.page) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.limit) {
        searchParams.append("limit", params.limit.toString());
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const res = await apiFetch(
        `${apiUrl}/function-rooms?${searchParams.toString()}`,
      );
      const response = await res.json();

      if (!res.ok) {
        addToast({
          title: "Error",
          description:
            response.error?.message ?? "Failed to fetch function rooms",
          color: "danger",
        });
        return rejectWithValue(
          response.error?.message ?? "Failed to fetch function rooms",
        );
      }

      return response.data as PaginatedResult<FunctionRoom>;
    } catch (err) {
      console.error("Error fetching function rooms:", err);
      return rejectWithValue("Failed to fetch function rooms");
    }
  },
);

export const fetchBookingOverview = createAsyncThunk<
  BookingOverviewResponse,
  BookingOverviewParams | undefined,
  { rejectValue: string }
>("analytics/fetchBookingOverview", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append("status", params.status);
    }
    if (params?.search) {
      searchParams.append("search", params.search);
    }
    if (params?.date) {
      searchParams.append("date", params.date);
    }
    if (params?.start && params?.end) {
      searchParams.append("start", params.start);
      searchParams.append("end", params.end);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.append("limit", params.limit.toString());
    }
    if (params?.sort_by) {
      searchParams.append("sort_by", params.sort_by);
    }
    if (params?.sort_order) {
      searchParams.append("sort_order", params.sort_order);
    }

    const res = await apiFetch(`${apiUrl}/overview?${searchParams.toString()}`);
    const response = await res.json();

    if (!res.ok) {
      addToast({
        title: "Error",
        description:
          response.error?.message ?? "Failed to fetch booking overview",
        color: "danger",
      });
      return rejectWithValue(
        response.error?.message ?? "Failed to fetch booking overview",
      );
    }

    return response.data as BookingOverviewResponse;
  } catch (err) {
    console.error("Error fetching booking overview:", err);
    return rejectWithValue("Failed to fetch booking overview");
  }
});

