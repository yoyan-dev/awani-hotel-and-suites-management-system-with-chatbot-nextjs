import { cookies, headers } from "next/headers";
import AdminClient from "./admin-client";
import type {
  ApiResponse,
  BookingAnalyticsResponse,
  FunctionHallAnalyticsResponse,
  FunctionRoomAnalyticsResponse,
  RoomAnalyticsResponse,
} from "@/types/analytics";

type AdminInitialData = {
  bookingAnalyticsData: BookingAnalyticsResponse;
  functionHallAnalyticsData: FunctionHallAnalyticsResponse;
  roomAnalyticsData: RoomAnalyticsResponse;
  functionRoomAnalyticsData: FunctionRoomAnalyticsResponse;
  initialError: string | null;
};

const EMPTY_BOOKING_ANALYTICS: BookingAnalyticsResponse = {
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
};

const EMPTY_FUNCTION_HALL_ANALYTICS: FunctionHallAnalyticsResponse = {
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
};

const EMPTY_ROOM_ANALYTICS: RoomAnalyticsResponse = {
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
};

const EMPTY_FUNCTION_ROOM_ANALYTICS: FunctionRoomAnalyticsResponse = {
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
};

async function fetchAnalytics<T>(
  url: string,
  requestInit: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, requestInit);
    const payload = (await res.json()) as ApiResponse<T>;

    if (!res.ok || !payload.success) {
      return {
        data: null,
        error: payload.error?.message ?? "Failed to fetch analytics data",
      };
    }

    return { data: payload.data ?? null, error: null };
  } catch {
    return { data: null, error: "Failed to fetch analytics data" };
  }
}

async function getAdminInitialData(): Promise<AdminInitialData> {
  const headerStore = await headers();
  const cookieStore = await cookies();

  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (host ? `${protocol}://${host}` : "http://localhost:3000");

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const requestInit: RequestInit = {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  };

  const [bookingResult, functionHallResult, roomResult, functionRoomResult] =
    await Promise.all([
      fetchAnalytics<BookingAnalyticsResponse>(
        `${baseUrl}/api/analytics/bookings`,
        requestInit,
      ),
      fetchAnalytics<FunctionHallAnalyticsResponse>(
        `${baseUrl}/api/analytics/function-hall-bookings`,
        requestInit,
      ),
      fetchAnalytics<RoomAnalyticsResponse>(
        `${baseUrl}/api/analytics/rooms`,
        requestInit,
      ),
      fetchAnalytics<FunctionRoomAnalyticsResponse>(
        `${baseUrl}/api/analytics/function-rooms`,
        requestInit,
      ),
    ]);

  return {
    bookingAnalyticsData: bookingResult.data ?? EMPTY_BOOKING_ANALYTICS,
    functionHallAnalyticsData:
      functionHallResult.data ?? EMPTY_FUNCTION_HALL_ANALYTICS,
    roomAnalyticsData: roomResult.data ?? EMPTY_ROOM_ANALYTICS,
    functionRoomAnalyticsData:
      functionRoomResult.data ?? EMPTY_FUNCTION_ROOM_ANALYTICS,
    initialError:
      bookingResult.error ??
      functionHallResult.error ??
      roomResult.error ??
      functionRoomResult.error ??
      null,
  };
}

export default async function AdminDashboardPage() {
  const {
    bookingAnalyticsData,
    functionHallAnalyticsData,
    roomAnalyticsData,
    functionRoomAnalyticsData,
    initialError,
  } = await getAdminInitialData();

  return (
    <AdminClient
      initialBookingAnalyticsData={bookingAnalyticsData}
      initialFunctionHallAnalyticsData={functionHallAnalyticsData}
      initialRoomAnalyticsData={roomAnalyticsData}
      initialFunctionRoomAnalyticsData={functionRoomAnalyticsData}
      initialError={initialError}
    />
  );
}
