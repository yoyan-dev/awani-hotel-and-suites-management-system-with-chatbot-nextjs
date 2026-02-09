import { BOOKING_ACTIONS_BY_STATUS } from "@/config/booking/booking-action-rules";
import { BookingStatus } from "@/types/booking";
import { BookingAction } from "@/types/booking-action";

export const canBookingAction = (
  status: BookingStatus,
  action: BookingAction,
) => {
  return BOOKING_ACTIONS_BY_STATUS[status]?.includes(action);
};
