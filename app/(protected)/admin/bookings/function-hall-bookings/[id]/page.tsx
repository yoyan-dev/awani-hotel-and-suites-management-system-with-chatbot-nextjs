"use client";

import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { Card, CardBody, Chip, Button } from "@heroui/react";
import { useParams } from "next/navigation";
import React from "react";
import Loader from "./loader";
import { Mail, Phone } from "lucide-react";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { formateDateAndTime } from "@/app/utils/to-date-range";
import { bookingStatusColorMap } from "@/app/constants/function-hall-booking";
import { formatPHP } from "@/lib/format-php";
import MarkConfirmedModal from "../_components/modals/mark-confirmed-modal";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { function_hall_booking, isLoading, fetchBooking, updateBooking } =
    useFunctionHallBookings();
  const totalAmount = Number(function_hall_booking.total_amount || 0);
  const amountPaid = Number(function_hall_booking.amount_paid || 0);
  const balance = Number(
    function_hall_booking.balance || Math.max(totalAmount - amountPaid, 0),
  );
  const paymentStatus = function_hall_booking.payment_status || "pending";
  const [markConfirmedOpen, setMarkConfirmedOpen] = React.useState(false);

  const updateStatus = async (status: string) => {
    await updateBooking({
      id: function_hall_booking.id,
      status,
    } as FunctionHallBooking);
    await fetchBooking(id as string);
  };

  React.useEffect(() => {
    fetchBooking(id as string);
  }, [id]);

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <MarkConfirmedModal
        isOpen={markConfirmedOpen}
        onClose={() => setMarkConfirmedOpen(false)}
        booking={function_hall_booking}
        onConfirmed={() => fetchBooking(id as string)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-2xl font-semibold">
            Booking #{function_hall_booking.booking_number}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Function Room Details</p>
        </div>

        <Chip
          variant="flat"
          className={`uppercase text-sm ${bookingStatusColorMap[function_hall_booking.status || "default"]}`}
        >
          {function_hall_booking.status || "Pending"}
        </Chip>
      </div>

      {/* Guest Info */}
      <Card radius="sm" className="shadow-none border border-gray-200">
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs">Guest Name</p>
            <p className="font-medium">
              {function_hall_booking.guest?.full_name}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Contact</p>
            <div className="flex flex-col md:flex-row gap-2 text-sm font-medium">
              <span className="flex items-center gap-1">
                <Phone size={14} />{" "}
                {function_hall_booking.guest?.contact_number}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={14} /> {function_hall_booking.guest?.email}
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Event Type</p>
            <p className="font-medium">{function_hall_booking.event_type}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Booking Source</p>
            <Chip size="sm" variant="flat">
              {function_hall_booking.booking_source || "Online"}
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* Event & Payment */}
      <Card radius="sm" className="shadow-none border border-gray-200">
        <CardBody className="space-y-2">
          <p className="text-gray-500 text-xs">Event Date</p>
          <p className="text-sm">
            {formateDateAndTime(function_hall_booking.event_start)} -{" "}
            {formateDateAndTime(function_hall_booking.event_end)}
          </p>
          <p className="text-gray-500 text-xs">Guests</p>
          <p className="text-sm">{function_hall_booking.number_of_guest}</p>
        </CardBody>
      </Card>
      <Card radius="sm" className="shadow-none border border-gray-200">
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs">Notes</p>
            <p className="text-sm">{function_hall_booking.notes || "-"}</p>
          </div>
        </CardBody>
      </Card>

      <Card radius="sm" className="shadow-none border border-gray-200">
        <CardBody className="space-y-3">
          <p className="text-gray-500 text-xs">Payment Summary</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-medium">{formatPHP(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-medium">{formatPHP(amountPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Balance</span>
              <span className="font-medium">{formatPHP(balance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium">
                {function_hall_booking.payment_method || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status</span>
              <Chip size="sm" variant="flat" className="uppercase">
                {paymentStatus}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Admin Actions */}
      {function_hall_booking.status !== "rejected" &&
        function_hall_booking.status !== "cancelled" &&
        function_hall_booking.status !== "completed" && (
          <Card radius="sm" className="shadow-none border border-gray-200">
            <CardBody className="flex justify-end gap-2">
              {function_hall_booking.status === "pending" ? (
                <>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => updateStatus("rejected")}
                  >
                    Reject Booking
                  </Button>
                  <Button
                    color="success"
                    onPress={() => setMarkConfirmedOpen(true)}
                  >
                    Mark Confirmed
                  </Button>
                </>
              ) : function_hall_booking.status === "confirmed" ? (
                <>
                  <Button
                    color="warning"
                    variant="flat"
                    onPress={() => updateStatus("ongoing")}
                  >
                    Mark Ongoing
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => updateStatus("cancelled")}
                  >
                    Mark Cancelled
                  </Button>
                </>
              ) : function_hall_booking.status === "ongoing" ? (
                <>
                  <Button
                    color="success"
                    variant="flat"
                    onPress={() => updateStatus("completed")}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => updateStatus("cancelled")}
                  >
                    Mark Cancelled
                  </Button>
                </>
              ) : (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => updateStatus("cancelled")}
                >
                  Mark Cancelled
                </Button>
              )}
            </CardBody>
          </Card>
        )}
    </div>
  );
}
