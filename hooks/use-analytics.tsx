import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading } from "@/features/room/room-slice";
import {
  bookingAnalytics,
  functionHallAnalytics,
} from "@/features/analytics/analytics-thunk";
import {
  BookingAnalyticsParams,
  FunctionHallAnalyticsParams,
} from "@/types/analytics";

export function useAnalytics() {
  const dispatch = useAppDispatch();
  const { bookingAnalyticsData, functionHallAnalyticsData, isLoading, error } =
    useAppSelector((state) => state.analytics);
  return {
    bookingAnalyticsData,
    functionHallAnalyticsData,
    isLoading,
    error,
    setLoading: () => dispatch(setLoading(true)),
    bookingAnalytics: (payload: BookingAnalyticsParams | null) =>
      dispatch(bookingAnalytics(payload || {})),
    functionHallAnalytics: (payload: FunctionHallAnalyticsParams | null) =>
      dispatch(functionHallAnalytics(payload || {})),
  };
}
