import { Booking } from "@/types/booking";
import { BookingSpecialRequest } from "@/types/add-on";
import { calculateBookingPrice, getNights } from "./pricing";

export function generateSummary(
  booking: Booking,
  specialRequests: BookingSpecialRequest[],
) {
  const amountPaid = booking.amount_paid ?? 0;

  const totalAddOnsPrice =
    specialRequests.length > 0
      ? specialRequests.reduce(
          (acc, item) => acc + Number(item.price) * (item.quantity || 0),
          0,
        )
      : 0;

  const nights = getNights(booking.checked_in, booking.checked_out);
  const totalPerNights = calculateBookingPrice(booking);
  const total = totalPerNights + totalAddOnsPrice;
  const balance = total - amountPaid;

  const status =
    amountPaid >= total ? "paid" : amountPaid > 0 ? "deposit" : "unpaid";

  return {
    specialRequests,
    roomPrice: booking.room_type.price,
    totalAddOnsPrice,
    nights,
    totalPerNights,
    total,
    paymentMethod: booking.payment_method,
    amountPaid,
    balance,
    status,
  };
}
