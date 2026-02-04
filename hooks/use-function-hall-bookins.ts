import {
  addBooking,
  completeBooking,
  deleteBooking,
  fetchBooking,
  fetchBookings,
  updateBooking,
} from "@/features/booking/function-hall/booking-thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  FetchFunctionHallBookingParams,
  FunctionHallBooking,
} from "@/types/function-room-booking";

export function useFunctionHallBookings() {
  const dispatch = useAppDispatch();
  const {
    function_hall_bookings,
    function_hall_booking,
    pagination,
    isLoading,
    error,
  } = useAppSelector((state) => state.function_hall_booking);
  return {
    function_hall_booking,
    function_hall_bookings,
    pagination,
    isLoading,
    error,
    fetchBookings: (payload: FetchFunctionHallBookingParams | undefined) =>
      dispatch(fetchBookings(payload)),
    fetchBooking: (id: string) => dispatch(fetchBooking(id)),
    addBooking: (payload: FormData) => dispatch(addBooking(payload)),
    updateBooking: (payload: FunctionHallBooking) =>
      dispatch(updateBooking(payload)),
    deleteBooking: (id: string) => dispatch(deleteBooking(id)),
    completeBooking: (
      bookingId: string,
      roomId: string,
      occupancyType: string,
    ) => dispatch(completeBooking({ bookingId, roomId, occupancyType })),
  };
}
