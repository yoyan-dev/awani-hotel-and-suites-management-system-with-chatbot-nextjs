import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/features/analytics/analytics-slice";
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
} from "@/features/analytics/analytics-thunk";
import {
  BookingAnalyticsParams,
  FunctionHallAnalyticsParams,
  RoomAnalyticsParams,
  FunctionRoomAnalyticsParams,
  DashboardSummaryParams,
  FilterParams,
  BookingOverviewParams,
} from "@/types/analytics";

export function useAnalytics() {
  const dispatch = useAppDispatch();
  const {
    bookingAnalyticsData,
    functionHallAnalyticsData,
    roomAnalyticsData,
    functionRoomAnalyticsData,
    dashboardSummary,
    paginatedBookings,
    paginatedFunctionHallBookings,
    paginatedRooms,
    paginatedFunctionRooms,
    bookingOverview,
    isLoading,
    error,
  } = useAppSelector((state) => state.analytics);

  return {
    bookingAnalyticsData,
    functionHallAnalyticsData,
    roomAnalyticsData,
    functionRoomAnalyticsData,
    dashboardSummary,
    paginatedBookings,
    paginatedFunctionHallBookings,
    paginatedRooms,
    paginatedFunctionRooms,
    bookingOverview,
    isLoading,
    error,
    clearError: () => dispatch(clearError()),
    bookingAnalytics: (payload: BookingAnalyticsParams | null) =>
      dispatch(bookingAnalytics(payload || {})),
    functionHallAnalytics: (payload: FunctionHallAnalyticsParams | null) =>
      dispatch(functionHallAnalytics(payload || {})),
    roomAnalytics: (payload: RoomAnalyticsParams | null) =>
      dispatch(roomAnalytics(payload || {})),
    functionRoomAnalytics: (payload: FunctionRoomAnalyticsParams | null) =>
      dispatch(functionRoomAnalytics(payload || {})),
    fetchDashboardSummary: (payload: DashboardSummaryParams | null) =>
      dispatch(getDashboardSummary(payload || {})),
    fetchBookings: (payload: FilterParams | null) =>
      dispatch(fetchPaginatedBookings(payload || {})),
    fetchFunctionHallBookings: (payload: FilterParams | null) =>
      dispatch(fetchPaginatedFunctionHallBookings(payload || {})),
    fetchRooms: (payload: FilterParams | null) =>
      dispatch(fetchPaginatedRooms(payload || {})),
    fetchFunctionRooms: (payload: FilterParams | null) =>
      dispatch(fetchPaginatedFunctionRooms(payload || {})),
    fetchBookingOverview: (payload: BookingOverviewParams | null) =>
      dispatch(fetchBookingOverview(payload || {})),
  };
}
