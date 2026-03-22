"use client";

import { useParams } from "next/navigation";
import Loader from "./loader";
import MarkConfirmedModal from "../_components/modals/mark-confirmed-modal";
import { useFunctionHallBookingDetails } from "@/hooks/front-office/bookings/use-function-hall-booking-details";
import { downloadFunctionHallBookingPdf } from "@/utils/booking/function-hall-booking-pdf";
import BookingDetailsHeader from "./_components/booking-details-header";
import BookingGuestCard from "./_components/booking-guest-card";
import BookingEventCard from "./_components/booking-event-card";
import BookingNotesCard from "./_components/booking-notes-card";
import BookingPaymentCard from "./_components/booking-payment-card";
import BookingStatusActions from "./_components/booking-status-actions";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const bookingId = String(id);
  const {
    booking,
    isLoading,
    totalAmount,
    amountPaid,
    balance,
    paymentStatus,
    markConfirmedOpen,
    setMarkConfirmedOpen,
    refreshBooking,
    updateStatus,
  } = useFunctionHallBookingDetails(bookingId);

  const handleDownloadPdf = async () => {
    if (!booking) return;

    await downloadFunctionHallBookingPdf({
      booking,
      totalAmount,
      amountPaid,
      balance,
      paymentStatus,
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <MarkConfirmedModal
        isOpen={markConfirmedOpen}
        onClose={() => setMarkConfirmedOpen(false)}
        booking={booking}
        onConfirmed={refreshBooking}
      />

      <div className="space-y-6">
        <BookingDetailsHeader
          bookingNumber={booking.booking_number}
          status={booking.status}
          onDownloadPdf={handleDownloadPdf}
        />
        <BookingGuestCard booking={booking} />
        <BookingEventCard booking={booking} />
        <BookingNotesCard notes={booking.notes} />
        <BookingPaymentCard
          totalAmount={totalAmount}
          amountPaid={amountPaid}
          balance={balance}
          paymentMethod={booking.payment_method}
          paymentStatus={paymentStatus}
        />
        <BookingStatusActions
          status={booking.status}
          onUpdateStatus={updateStatus}
          onOpenMarkConfirmed={() => setMarkConfirmedOpen(true)}
        />
      </div>
    </div>
  );
}
