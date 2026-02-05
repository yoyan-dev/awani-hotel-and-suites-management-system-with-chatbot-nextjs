"use client";

import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Button,
  Textarea,
  Link,
} from "@heroui/react";
import { useParams } from "next/navigation";
import React from "react";
import Loader from "./loader";
import { Mail, Phone } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { formatTime } from "@/utils/formta-time";

type OccupancyType = "available" | "half occupied" | "full occupied";

const getOccupancyColor = (
  occupancy?: OccupancyType,
): "success" | "warning" | "danger" | "default" => {
  switch (occupancy) {
    case "available":
      return "success";
    case "half occupied":
      return "warning";
    case "full occupied":
      return "danger";
    default:
      return "default";
  }
};

export default function BookingDetailsPage() {
  const { id } = useParams();
  const {
    function_hall_booking,
    isLoading,
    error,
    fetchBooking,
    updateBooking,
  } = useFunctionHallBookings();

  React.useEffect(() => {
    fetchBooking(id as string);
  }, []);

  const balance =
    (function_hall_booking.total_amount || 0) -
    (function_hall_booking.amount_paid || 0);

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Booking #{function_hall_booking.booking_number}
          </h1>
          <p className="text-sm text-gray-500">
            Function Room Reservation Details
          </p>
        </div>

        <Chip
          color={
            function_hall_booking.status === "confirmed"
              ? "success"
              : function_hall_booking.status === "cancelled"
                ? "danger"
                : "warning"
          }
          variant="flat"
        >
          {function_hall_booking.status?.toUpperCase() || "pending"}
        </Chip>
      </div>

      <Card className="shadow-sm" radius="sm">
        <CardHeader>
          <h3 className="font-medium text-lg">Guest & Event Summary</h3>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Guest Name</p>
            <p className="font-medium">
              {function_hall_booking.guest?.full_name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <div className="flex gap-4 items-center">
              <p className="font-medium flex items-center gap-2">
                <Phone size={15} />{" "}
                {function_hall_booking.guest?.contact_number}
              </p>
              <p className="font-medium flex items-center gap-2">
                <Mail size={15} /> {function_hall_booking.guest?.email}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Event Type</p>
            <p className="font-medium">{function_hall_booking.event_type}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Booking Source</p>
            <Chip size="sm" variant="flat">
              {function_hall_booking.booking_source || "online"}
            </Chip>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm" radius="sm">
          <CardHeader>
            <h3 className="font-medium">Event Details</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{function_hall_booking.event_date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p>
                {formatTime(function_hall_booking.event_duration?.start)} –{" "}
                {formatTime(function_hall_booking.event_duration?.end)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p>{function_hall_booking.number_of_guest}</p>
            </div>

            <Divider />

            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-sm">{function_hall_booking.notes}</p>
            </div>
          </CardBody>
        </Card>

        {/* Payment Info */}
        <Card className="shadow-sm" radius="sm">
          <CardHeader>
            <h3 className="font-medium">Payment Information</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <Chip
              color={
                function_hall_booking.payment_status === "paid"
                  ? "success"
                  : function_hall_booking.payment_status === "partial"
                    ? "warning"
                    : "danger"
              }
              variant="flat"
            >
              {function_hall_booking.payment_status?.toUpperCase() || "pending"}
            </Chip>

            <p>Method: {function_hall_booking.payment_method || "Not Set"}</p>
            <p>
              Total Amount: ₱
              {function_hall_booking.total_amount?.toLocaleString() || 0}
            </p>
            <p>Paid: ₱{function_hall_booking.amount_paid?.toLocaleString()}</p>

            <Divider />

            <p className="font-semibold text-red-600">
              Balance: ₱{balance.toLocaleString()}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Room & Package */}
      <Card className="shadow-sm" radius="sm">
        <CardHeader>
          <h3 className="font-medium">Room & Banquet Package</h3>
        </CardHeader>
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Room</p>
            <p className="font-medium">
              {function_hall_booking.room?.name || "Not assigned"}
            </p>
            <p className="text-sm text-gray-500">
              Capacity: {function_hall_booking.room?.capacity}
            </p>
            {function_hall_booking.room_id && (
              <Chip
                size="sm"
                color={getOccupancyColor(function_hall_booking.occupancy_type)}
                variant="flat"
                className="mt-2"
              >
                {function_hall_booking.occupancy_type === "half occupied"
                  ? "Half Occupied"
                  : function_hall_booking.occupancy_type === "full occupied"
                    ? "Fully Occupied"
                    : function_hall_booking.occupancy_type || "Available"}
              </Chip>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Package</p>
            <p className="font-medium">
              {function_hall_booking.banquet_package?.name}
            </p>
            <p className="text-sm">
              {formatPHP(
                function_hall_booking.banquet_package?.price_per_cover,
              )}{" "}
              / guest
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Admin Actions */}
      {function_hall_booking.status !== "rejected" &&
      function_hall_booking.status !== "cancelled" ? (
        <Card className="shadow-sm" radius="sm">
          <CardHeader>
            <h3 className="font-medium">Admin Actions</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* <Textarea
            label="Admin Notes"
            placeholder="Add internal notes here..."
          /> */}

            <div className="flex gap-3 justify-end">
              {function_hall_booking.status === "pending" ? (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() =>
                    updateBooking({
                      id: function_hall_booking.id,
                      status: "rejected",
                    } as FunctionHallBooking)
                  }
                >
                  Reject
                </Button>
              ) : (
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() =>
                    updateBooking({
                      id: function_hall_booking.id,
                      status: "cancelled",
                    } as FunctionHallBooking)
                  }
                >
                  Cancelled
                </Button>
              )}
              <Button
                color="success"
                as={Link}
                href={`/admin/bookings/function-hall-bookings/assign-room/${function_hall_booking.id}`}
              >
                {function_hall_booking.room_id ? "Change Room" : "Assign Room"}
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
