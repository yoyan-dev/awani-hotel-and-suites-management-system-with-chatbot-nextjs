import { createSlice } from "@reduxjs/toolkit";
import {
  bookingAnalytics,
  functionHallAnalytics,
  roomAnalytics,
  functionRoomAnalytics,
  getDashboardSummary,
  fetchPaginatedBookings,
  fetchPaginatedFunctionHallBookings,
  fetchPaginatedRooms,
  fetchPaginatedFunctionRooms,
  fetchBookingOverview,
} from "./analytics-thunk";
import { AnalyticsState } from "@/types/analytics";

const initialState: AnalyticsState = {
  bookingAnalyticsData: {
    summary: {
      total_bookings: 0,
      total_revenue: 0,
      average_booking_value: 0,
      pending_bookings: 0,
      confirmed_bookings: 0,
      checked_in_today: 0,
      checked_out_today: 0,
      cancelled_bookings: 0,
    },
    trends: {
      daily: [],
      monthly: [],
      weekly_comparison: {
        current_week: 0,
        previous_week: 0,
        percent_change: 0,
      },
    },
    distributions: {
      by_status: {},
      by_payment_status: {},
      by_booking_source: {},
      by_room_type: {},
      by_month: {},
    },
    top_performers: {
      most_booked_room_types: [],
      peak_booking_days: [],
      revenue_by_source: [],
    },
  },
  functionHallAnalyticsData: {
    summary: {
      total_bookings: 0,
      total_revenue: 0,
      average_booking_value: 0,
      upcoming_bookings: 0,
      completed_bookings: 0,
      pending_bookings: 0,
      cancelled_bookings: 0,
      total_guests_expected: 0,
    },
    trends: {
      daily: [],
      monthly: [],
      weekly_comparison: {
        current_week: 0,
        previous_week: 0,
        percent_change: 0,
      },
    },
    distributions: {
      by_event_type: {},
      by_status: {},
      by_room: {},
      by_month: {},
      by_day_of_week: {},
    },
    top_performers: {
      most_popular_rooms: [],
      most_popular_event_types: [],
      peak_months: [],
    },
  },
  roomAnalyticsData: {
    summary: {
      total_rooms: 0,
      available_rooms: 0,
      occupied_rooms: 0,
      maintenance_rooms: 0,
      occupancy_rate: 0,
      average_room_rate: 0,
      total_room_revenue: 0,
    },
    trends: {
      daily_occupancy: [],
      monthly_revenue: [],
    },
    distributions: {
      by_status: {},
      by_room_type: {},
      by_floor: {},
    },
    room_details: [],
  },
  functionRoomAnalyticsData: {
    summary: {
      total_function_rooms: 0,
      available_rooms: 0,
      booked_rooms: 0,
      maintenance_rooms: 0,
      utilization_rate: 0,
      average_utilization: 0,
      total_revenue: 0,
    },
    trends: {
      daily_utilization: [],
      monthly: [],
    },
    distributions: {
      by_status: {},
      by_type: {},
      by_capacity: {},
    },
    room_details: [],
  },
  dashboardSummary: null,
  paginatedBookings: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },
  },
  paginatedFunctionHallBookings: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },
  },
  paginatedRooms: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },
  },
  paginatedFunctionRooms: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },
  },
  bookingOverview: null,
  isLoading: false,
  error: undefined,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(bookingAnalytics.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(bookingAnalytics.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bookingAnalyticsData = action.payload;
    });
    builder.addCase(bookingAnalytics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(functionHallAnalytics.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(functionHallAnalytics.fulfilled, (state, action) => {
      state.isLoading = false;
      state.functionHallAnalyticsData = action.payload;
    });
    builder.addCase(functionHallAnalytics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(roomAnalytics.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(roomAnalytics.fulfilled, (state, action) => {
      state.isLoading = false;
      state.roomAnalyticsData = action.payload;
    });
    builder.addCase(roomAnalytics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(functionRoomAnalytics.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(functionRoomAnalytics.fulfilled, (state, action) => {
      state.isLoading = false;
      state.functionRoomAnalyticsData = action.payload;
    });
    builder.addCase(functionRoomAnalytics.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getDashboardSummary.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(getDashboardSummary.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dashboardSummary = action.payload;
    });
    builder.addCase(getDashboardSummary.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchPaginatedBookings.pending.type, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchPaginatedBookings.fulfilled.type, (state, action: any) => {
      state.isLoading = false;
      state.paginatedBookings = action.payload;
    });
    builder.addCase(fetchPaginatedBookings.rejected.type, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchPaginatedFunctionHallBookings.pending.type, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(
      fetchPaginatedFunctionHallBookings.fulfilled.type,
      (state, action: any) => {
        state.isLoading = false;
        state.paginatedFunctionHallBookings = action.payload;
      },
    );
    builder.addCase(fetchPaginatedFunctionHallBookings.rejected.type, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchPaginatedRooms.pending.type, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchPaginatedRooms.fulfilled.type, (state, action: any) => {
      state.isLoading = false;
      state.paginatedRooms = action.payload;
    });
    builder.addCase(fetchPaginatedRooms.rejected.type, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchPaginatedFunctionRooms.pending.type, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchPaginatedFunctionRooms.fulfilled.type, (state, action: any) => {
      state.isLoading = false;
      state.paginatedFunctionRooms = action.payload;
    });
    builder.addCase(fetchPaginatedFunctionRooms.rejected.type, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchBookingOverview.pending.type, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchBookingOverview.fulfilled.type, (state, action: any) => {
      state.isLoading = false;
      state.bookingOverview = action.payload;
    });
    builder.addCase(fetchBookingOverview.rejected.type, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
