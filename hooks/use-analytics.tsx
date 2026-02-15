import { useCallback } from "react";
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

  const clearAnalyticsError = useCallback(
    () => dispatch(clearError()),
    [dispatch],
  );

  const bookingAnalyticsAction = useCallback(
    (payload: BookingAnalyticsParams | null) =>
      dispatch(bookingAnalytics(payload || {})),
    [dispatch],
  );

  const functionHallAnalyticsAction = useCallback(
    (payload: FunctionHallAnalyticsParams | null) =>
      dispatch(functionHallAnalytics(payload || {})),
    [dispatch],
  );

  const roomAnalyticsAction = useCallback(
    (payload: RoomAnalyticsParams | null) => dispatch(roomAnalytics(payload || {})),
    [dispatch],
  );

  const functionRoomAnalyticsAction = useCallback(
    (payload: FunctionRoomAnalyticsParams | null) =>
      dispatch(functionRoomAnalytics(payload || {})),
    [dispatch],
  );

  const fetchDashboardSummaryAction = useCallback(
    (payload: DashboardSummaryParams | null) =>
      dispatch(getDashboardSummary(payload || {})),
    [dispatch],
  );

  const fetchBookingsAction = useCallback(
    (payload: FilterParams | null) => dispatch(fetchPaginatedBookings(payload || {})),
    [dispatch],
  );

  const fetchFunctionHallBookingsAction = useCallback(
    (payload: FilterParams | null) =>
      dispatch(fetchPaginatedFunctionHallBookings(payload || {})),
    [dispatch],
  );

  const fetchRoomsAction = useCallback(
    (payload: FilterParams | null) => dispatch(fetchPaginatedRooms(payload || {})),
    [dispatch],
  );

  const fetchFunctionRoomsAction = useCallback(
    (payload: FilterParams | null) =>
      dispatch(fetchPaginatedFunctionRooms(payload || {})),
    [dispatch],
  );

  const fetchBookingOverviewAction = useCallback(
    (payload: BookingOverviewParams | null) =>
      dispatch(fetchBookingOverview(payload || {})),
    [dispatch],
  );

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
    clearError: clearAnalyticsError,
    bookingAnalytics: bookingAnalyticsAction,
    functionHallAnalytics: functionHallAnalyticsAction,
    roomAnalytics: roomAnalyticsAction,
    functionRoomAnalytics: functionRoomAnalyticsAction,
    fetchDashboardSummary: fetchDashboardSummaryAction,
    fetchBookings: fetchBookingsAction,
    fetchFunctionHallBookings: fetchFunctionHallBookingsAction,
    fetchRooms: fetchRoomsAction,
    fetchFunctionRooms: fetchFunctionRoomsAction,
    fetchBookingOverview: fetchBookingOverviewAction,
  };
}
