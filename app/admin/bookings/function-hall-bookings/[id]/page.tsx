"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Image,
  Button,
  Chip,
  Divider,
  User,
} from "@heroui/react";
import { CalendarDays, Users, Tag, Info, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { formatPHP } from "@/lib/format-php";
import { calculateBookingPrice, getNights } from "@/utils/pricing";
import { useBookings } from "@/hooks/use-bookings";
import GuestModal from "./_components/modals/guest-details-modal";
import { Booking } from "@/types/booking";
import { Room } from "@/types/room";
import { useRooms } from "@/hooks/use-rooms";
import Link from "next/link";

function formatDate(d?: string) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BookingDetailsStunning() {
  const { id } = useParams();
  const { booking, isLoading, error, fetchBooking, updateBooking } =
    useBookings();
  const { updateRoom } = useRooms();
  const [viewOpen, setViewOpen] = React.useState(false);
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      fetchBooking(id as string);
    }
  }, [id, error]);

  async function handleSubmit(room: Room) {
    await updateBooking({
      id: booking.id,
      room_id: room.id,
      status: "confirmed",
    } as Booking);

    await updateRoom({
      id: room.id,
      bookings: [...(room.bookings || []), booking],
    });
    fetchBooking(id as string);
  }

  if (isLoading || !booking) {
    return <div className="p-6">Loading...</div>;
  }
  return (
    <div className="w-full mx-auto pb-4">
      <GuestModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        guest={booking.user}
      />

      <div className="px-4 py-2 text-white bg-primary mb-4">
        Booking Details
      </div>
      <Card className="overflow-hidden" radius="none">
        <div className="md:flex">
          <div className="md:w-1/2">
            <Image
              src={booking.room_type?.image || "/placeholder-room.jpg"}
              alt={booking.room_type?.name || "Room"}
              className="w-full h-56 md:h-full object-cover"
              radius="none"
            />
          </div>

          <div className="md:w-1/2 p-5 flex flex-col gap-3">
            <div className="flex items-start gap-4">
              <User
                avatarProps={{
                  src:
                    booking.user?.image ||
                    "https://i.pravatar.cc/150?u=a04258114e29026702d",
                }}
                className="transition-transform"
                description="Awani Guest"
                name={booking.user?.full_name}
              />
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-semibold leading-tight">
                  {booking.user?.full_name || "Guest Name"}
                </h1>
                <p className="text-sm text-gray-500">
                  {booking.user?.contact_number || ""}
                </p>
                <div className="mt-2 flex gap-2 items-center">
                  <Chip
                    variant="flat"
                    color={
                      booking.status === "confirmed"
                        ? "success"
                        : booking.status === "cancelled"
                          ? "danger"
                          : "warning"
                    }
                    className="uppercase text-xs"
                  >
                    {booking.status || "pending"}
                  </Chip>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Info className="w-3 h-3" /> Booking summary
                  </span>
                </div>
              </div>
              <div>
                <Button
                  variant="light"
                  size="sm"
                  color="primary"
                  className="mt-1"
                  onPress={() => setViewOpen(true)}
                >
                  view guest
                </Button>
              </div>
            </div>

            <div className="mt-1">
              <h2 className="text-lg font-medium">{booking.room_type?.name}</h2>
              {booking.room_type?.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {booking.room_type?.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <div className="text-sm">
                  <div className="text-xs text-gray-500">Rate / Night</div>
                  <div className="font-semibold">
                    {formatPHP(booking.room_type?.price)}
                  </div>
                </div>

                <div className="text-sm">
                  <div className="text-xs text-gray-500">Add-ons</div>
                  <div className="font-semibold">
                    {formatPHP(Number(booking.total_add_ons))}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatPHP(
                      calculateBookingPrice(booking) +
                        Number(booking.total_add_ons || 0)
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div className="flex gap-2">
              <Button color="primary">Edit</Button>
              <Button color="danger">Cancel</Button>
              <div className="ml-auto hidden sm:flex items-center text-sm text-gray-500 gap-2">
                <Tag className="w-4 h-4" />
                {booking.room ? (
                  <div className="flex gap-2 items-center">
                    <span>#{booking.room?.room_number}</span>
                    <Link
                      className="px-2 py-1 bg-primary text-white rounded-sm"
                      href={`booking/assign-room/${booking.id}`}
                    >
                      Transfer room
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <span>No room assigned</span>
                    {(booking.status === "check-in" ||
                      booking.status === "confirmed") && (
                      <Link
                        className="px-2 py-1 bg-primary text-white rounded-sm"
                        href={`/admin/booking/assign-room/${booking.id}`}
                      >
                        Choose room
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card radius="none" className="mt-4">
        <CardHeader>
          <h3 className="font-semibold">Additional Details</h3>
        </CardHeader>
        <CardBody className="space-y-3">
          <div>
            <div className="text-xs text-gray-500">Company</div>
            <div className="text-sm">{booking.company || "N/A"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Purpose of stay</div>
            <div className="text-sm">{booking.purpose || "N/A"}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Place Last Visited</div>
            <div className="text-sm">
              {booking.places_last_visited || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Recent Sickness</div>
            <div className="text-sm">{booking.recent_sickness || "N/A"}</div>
          </div>
        </CardBody>
      </Card>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card radius="none">
          <CardHeader>
            <h3 className="font-semibold">Schedule</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-default-500" />
              <div>
                <div className="text-xs text-gray-500">Check-in</div>
                <div className="font-medium">
                  {formatDate(booking.check_in)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-default-500" />
              <div>
                <div className="text-xs text-gray-500">Check-out</div>
                <div className="font-medium">
                  {formatDate(booking.check_out)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-default-500" />
              <div>
                <div className="text-xs text-gray-500">Guests</div>
                <div className="font-medium">{booking.number_of_guests}</div>
              </div>
            </div>

            {booking.special_requests ? (
              <div>
                <div className="text-xs text-gray-500">Special requests</div>
                <div className="flex gap-2 flex-wrap">
                  {booking.special_requests.map((req: any) => (
                    <Chip key={req.name}>
                      {req.quantity} {req.name} -{" "}
                      {req.price > 0 ? req.price : "free"}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-default-500" />
              <div>
                <div className="text-xs text-gray-500">Request Messages</div>
                <div className="text-sm">
                  {booking.request_messages || "No request messages"}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card radius="none">
          <CardHeader>
            <h3 className="font-semibold">Summary</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="text-gray-500">
                {booking.payment_method ? booking.payment_method : "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Total in {getNights(booking.check_in, booking.check_out)} nights
              </span>
              <strong>{formatPHP(calculateBookingPrice(booking))}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Add-ons</span>
              <strong>{formatPHP(Number(booking.total_add_ons))}</strong>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-sm">Total</span>
              <div className="text-lg font-bold text-green-600">
                {formatPHP(
                  calculateBookingPrice(booking) +
                    Number(booking.total_add_ons || 0)
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Amount Paid</span>
              <div className="text-lg font-bold text-green-600">
                {formatPHP(Number(booking.amount_paid) || 0)}
              </div>
            </div>
          </CardBody>
          <CardFooter className="p-4">
            <div className="text-xs text-gray-500">
              Payment handled on arrival.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
