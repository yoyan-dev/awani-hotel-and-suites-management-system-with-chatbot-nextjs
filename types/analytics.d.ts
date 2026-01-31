export interface BookingAnalyticsResponse {
  totalBookings: number;
  totalRevenue: number;

  statusDistribution: Record<BookingStatus, number>;

  bookingSourceDistribution: {
    walk_in: number;
    online: number;
  };

  dateRange: {
    start: string;
    end: string;
  };
}

export interface FunctionHallAnalyticsResponse {
  totalBookings: number;
  totalRevenue: number;

  eventTypeDistribution: Record<string, number>;

  dateRange: {
    start: string;
    end: string;
  };
}

export interface DailyAnalyticsPoint {
  date: string; // YYYY-MM-DD
  count: number;
  total: number;
}

export interface MonthlyAnalyticsPoint {
  month: string; // YYYY-MM
  count: number;
  total: number;
}

export interface AnalyticsApiResponse<T> {
  data: T;
  generated_at: string;
  filters_applied: {
    date?: string;
    start?: string;
    end?: string;
  };
}

interface DateOnlyFilter {
  date?: string; // ISO date string: "2026-01-31"
}

interface DateRangeFilter {
  start?: string; // ISO date string
  end?: string; // ISO date string
}

type DateQuery = DateOnlyFilter & DateRangeFilter;

export interface BookingAnalyticsParams extends DateQuery {
  status?: string;
  booking_source?: "walk-in" | "online";
  room_type_id?: string;
}

export interface FunctionHallAnalyticsParams extends DateQuery {
  status?: string;
  event_type?: string;
}

export interface AnalyticsState {
  bookingAnalyticsData: BookingAnalyticsResponse;
  functionHallAnalyticsData: FunctionHallAnalyticsResponse;
  isLoading: boolean;
  error?: string;
}
