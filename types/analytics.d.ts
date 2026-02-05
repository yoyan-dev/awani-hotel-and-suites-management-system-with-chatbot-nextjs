import {
  Tables as SupabaseTables,
  TablesInsert,
  TablesUpdate,
} from "./supabase";

export { TablesInsert, TablesUpdate } from "./supabase";
export type Tables<T extends keyof SupabaseTables["public"]["Tables"]> =
  SupabaseTables["public"]["Tables"][T]["Row"];

export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;
export type BookingUpdate = TablesUpdate<"bookings">;

export type FunctionHallBooking = Tables<"function_hall_bookings">;
export type FunctionHallBookingInsert = TablesInsert<"function_hall_bookings">;
export type FunctionHallBookingUpdate = TablesUpdate<"function_hall_bookings">;

export type Room = Tables<"rooms">;
export type RoomInsert = TablesInsert<"rooms">;
export type RoomUpdate = TablesUpdate<"rooms">;

export type FunctionRoom = Tables<"function-rooms">;
export type FunctionRoomInsert = TablesInsert<"function-rooms">;
export type FunctionRoomUpdate = TablesUpdate<"function-rooms">;

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";
export type PaymentStatus = "pending" | "partial" | "paid" | "refunded";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface DateRangeParams {
  start?: string;
  end?: string;
  date?: string;
}

export interface FilterParams extends PaginationParams, DateRangeParams {
  status?: string;
  search?: string;
  room_type_id?: string;
  booking_source?: string;
  event_type?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    generated_at: string;
    filters_applied: Record<string, unknown>;
    execution_time_ms: number;
  };
}

export interface DailyAnalyticsPoint {
  date: string;
  count: number;
  total: number;
}

export interface MonthlyAnalyticsPoint {
  month: string;
  count: number;
  total: number;
}

export interface BookingAnalyticsResponse {
  summary: {
    total_bookings: number;
    total_revenue: number;
    average_booking_value: number;
    pending_bookings: number;
    confirmed_bookings: number;
    checked_in_today: number;
    checked_out_today: number;
    cancelled_bookings: number;
  };
  trends: {
    daily: DailyAnalyticsPoint[];
    monthly: MonthlyAnalyticsPoint[];
    weekly_comparison: {
      current_week: number;
      previous_week: number;
      percent_change: number;
    };
  };
  distributions: {
    by_status: Record<string, number>;
    by_payment_status: Record<string, number>;
    by_booking_source: Record<string, number>;
    by_room_type: Record<string, number>;
    by_month: Record<string, number>;
  };
  top_performers: {
    most_booked_room_types: { name: string; count: number }[];
    peak_booking_days: { day: string; count: number }[];
    revenue_by_source: { source: string; revenue: number }[];
  };
}

export interface FunctionHallAnalyticsResponse {
  summary: {
    total_bookings: number;
    total_revenue: number;
    average_booking_value: number;
    upcoming_bookings: number;
    completed_bookings: number;
    pending_bookings: number;
    cancelled_bookings: number;
    total_guests_expected: number;
  };
  trends: {
    daily: DailyAnalyticsPoint[];
    monthly: MonthlyAnalyticsPoint[];
    weekly_comparison: {
      current_week: number;
      previous_week: number;
      percent_change: number;
    };
  };
  distributions: {
    by_event_type: Record<string, number>;
    by_status: Record<string, number>;
    by_room: Record<string, number>;
    by_month: Record<string, number>;
    by_day_of_week: Record<string, number>;
  };
  top_performers: {
    most_popular_rooms: { name: string; bookings: number; revenue: number }[];
    most_popular_event_types: { type: string; count: number }[];
    peak_months: { month: string; bookings: number }[];
  };
}

export interface RoomAnalyticsResponse {
  summary: {
    total_rooms: number;
    available_rooms: number;
    occupied_rooms: number;
    maintenance_rooms: number;
    occupancy_rate: number;
    average_room_rate: number;
    total_room_revenue: number;
  };
  trends: {
    daily_occupancy: {
      date: string;
      occupied: number;
      available: number;
      occupancy_rate: number;
      revenue: number;
    }[];
    monthly_revenue: {
      month: string;
      revenue: number;
      bookings: number;
      average_rate: number;
    }[];
  };
  distributions: {
    by_status: Record<string, number>;
    by_room_type: Record<string, number>;
    by_floor: Record<string, number>;
  };
  room_details: {
    id: string;
    room_number: number | null;
    status: string;
    room_type_id: string | null;
    current_booking?: {
      guest_name: string;
      check_in: string;
      check_out: string;
    } | null;
    days_since_last_status_change?: number;
  }[];
}

export interface FunctionRoomAnalyticsResponse {
  summary: {
    total_function_rooms: number;
    available_rooms: number;
    booked_rooms: number;
    maintenance_rooms: number;
    utilization_rate: number;
    average_utilization: number;
    total_revenue: number;
  };
  trends: {
    daily_utilization: DailyAnalyticsPoint[];
    monthly: MonthlyAnalyticsPoint[];
  };
  distributions: {
    by_status: Record<string, number>;
    by_type: Record<string, number>;
    by_capacity: Record<string, number>;
  };
  room_details: {
    id: string;
    room_number: number | null;
    status: string;
    type: string | null;
    max_guest: number | null;
    current_booking?: {
      guest_name: string;
      event_date: string;
      number_of_guest: number;
    } | null;
    utilization_percentage?: number;
  }[];
}

export interface DashboardSummaryResponse {
  timestamp: string;
  bookings: {
    today: number;
    this_week: number;
    this_month: number;
    pending: number;
    revenue_today: number;
    revenue_this_month: number;
  };
  function_halls: {
    today: number;
    this_week: number;
    this_month: number;
    pending: number;
    revenue_today: number;
    revenue_this_month: number;
  };
  rooms: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    occupancy_rate: number;
  };
  function_rooms: {
    total: number;
    available: number;
    booked: number;
    utilization_rate: number;
  };
  quick_stats: {
    total_guests_checked_in: number;
    total_guests_checked_out_today: number;
    upcoming_check_outs: number;
    upcoming_events: number;
  };
}

export interface AnalyticsState {
  bookingAnalyticsData: BookingAnalyticsResponse;
  functionHallAnalyticsData: FunctionHallAnalyticsResponse;
  roomAnalyticsData: RoomAnalyticsResponse;
  functionRoomAnalyticsData: FunctionRoomAnalyticsResponse;
  dashboardSummary: DashboardSummaryResponse | null;
  paginatedBookings: {
    data: Booking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  paginatedFunctionHallBookings: {
    data: FunctionHallBooking[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  paginatedRooms: {
    data: Room[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  paginatedFunctionRooms: {
    data: FunctionRoom[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  bookingOverview: BookingOverviewResponse | null;
  isLoading: boolean;
  error?: string;
}

export interface BookingAnalyticsParams extends FilterParams {}
export interface FunctionHallAnalyticsParams extends FilterParams {}
export interface RoomAnalyticsParams extends FilterParams {}
export interface FunctionRoomAnalyticsParams extends FilterParams {}
export interface DashboardSummaryParams extends DateRangeParams {}

export interface BookingOverviewResponse {
  summary: {
    total_revenue: number;
    total_bookings: number;
    pending_bookings: number;
    confirmed_bookings: number;
    checked_in_today: number;
    checked_out_today: number;
    cancelled_bookings: number;
    upcoming_bookings: number;
    occupancy_rate: number;
    average_booking_value: number;
  };
  status_distribution: Record<string, number>;
  recent_bookings: Booking[];
}

export interface BookingOverviewParams extends FilterParams {}
