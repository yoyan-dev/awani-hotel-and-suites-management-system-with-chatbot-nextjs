"use client";

import React from "react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { FunctionHallBooking } from "@/types/function-room-booking";

export function useFunctionHallBookingDetails(bookingId: string) {
  const { function_hall_booking, isLoading, fetchBooking, updateBooking } =
    useFunctionHallBookings();
  const [markConfirmedOpen, setMarkConfirmedOpen] = React.useState(false);

  const totalAmount = Number(function_hall_booking.total_amount || 0);
  const amountPaid = Number(function_hall_booking.amount_paid || 0);
  const balance = Number(
    function_hall_booking.balance || Math.max(totalAmount - amountPaid, 0),
  );
  const paymentStatus = function_hall_booking.payment_status || "pending";

  const refreshBooking = async () => {
    await fetchBooking(bookingId);
  };

  const updateStatus = async (status: string) => {
    await updateBooking({
      id: function_hall_booking.id,
      status,
    } as FunctionHallBooking);
    await fetchBooking(bookingId);
  };

  React.useEffect(() => {
    fetchBooking(bookingId);
  }, [bookingId]);

  return {
    booking: function_hall_booking,
    isLoading,
    totalAmount,
    amountPaid,
    balance,
    paymentStatus,
    markConfirmedOpen,
    setMarkConfirmedOpen,
    refreshBooking,
    updateStatus,
  };
}
