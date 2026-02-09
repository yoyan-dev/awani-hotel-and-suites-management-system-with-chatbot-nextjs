export function hasBookingConflict(
  bookings: any[] = [],
  checkIn: string,
  checkOut: string,
): boolean {
  return bookings.some((booking) => {
    if (booking.status === "cancelled") return false;

    return booking.checked_in < checkOut && booking.checked_out > checkIn;
  });
}
