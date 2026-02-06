export function hasBookingConflict(
  bookings: any[] = [],
  checkIn: string,
  checkOut: string,
): boolean {
  return bookings.some((booking) => {
    if (booking.status === "cancelled") return false;

    return booking.check_in < checkOut && booking.check_out > checkIn;
  });
}
