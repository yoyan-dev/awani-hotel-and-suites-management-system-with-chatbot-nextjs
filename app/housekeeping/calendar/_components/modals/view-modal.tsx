"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
  Divider,
} from "@heroui/react";
import { format } from "date-fns";
import { Copyright } from "lucide-react";

import { useBookings } from "@/hooks/use-bookings";
import { formatPHP } from "@/lib/format-php";

interface ViewModalProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ data, isOpen, onClose }) => {
  const { booking, isLoading, fetchBooking } = useBookings();

  React.useEffect(() => {
    if (data?.id) {
      fetchBooking(data.id);
    }
  }, [data?.id]);

  if (!booking?.id) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      placement="top-center"
      radius="sm"
      size="xl"
      scrollBehavior="outside"
    >
      <ModalContent>
        {() =>
          isLoading && !booking?.id ? (
            <div className="p-6 text-sm">Loading booking details…</div>
          ) : (
            <>
              {/* HEADER */}
              <ModalHeader className="bg-primary text-white px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm opacity-80">Booking Details</span>
                  <span className="text-lg font-semibold">
                    {booking.booking_number || "—"}
                  </span>
                </div>
              </ModalHeader>

              {/* BODY */}
              <ModalBody className="px-6 py-5 space-y-6 text-sm">
                {/* Guest Info */}
                {booking.user && (
                  <section className="space-y-2">
                    <h3 className="font-medium text-gray-900">
                      Guest Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-gray-600">
                      <div>
                        <p className="text-xs text-gray-400">Full Name</p>
                        <p>{booking.user.full_name}</p>
                      </div>
                      {/* <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p>{booking.user.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Contact</p>
                        <p>{booking.user.contact_number || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Nationality</p>
                        <p>{booking.user.nationality || "—"}</p>
                      </div> */}
                    </div>
                  </section>
                )}

                <Divider />

                {/* Booking Info */}
                <section className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      Booking Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-gray-600">
                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>

                      <p>
                        {booking.check_in
                          ? format(new Date(booking.check_in), "MMM dd, yyyy")
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>

                      <p>
                        {booking.check_out
                          ? format(new Date(booking.check_out), "MMM dd, yyyy")
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Guests</p>

                      <p>{booking.number_of_guests || 1}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Purpose</p>
                      <p>{booking.purpose || "—"}</p>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* Room Info */}
                {booking.room_type && (
                  <section className="space-y-3">
                    <h3 className="font-medium text-gray-900">
                      Room Information{" "}
                      <span className="font-medium text-default-600">
                        {booking.room?.room_number
                          ? `(Room #${booking.room.room_number})`
                          : "(Room not assigned)"}
                      </span>
                    </h3>

                    {/* {booking.room_type.image && (
                      <Image
                        src={booking.room_type.image}
                        alt="Room image"
                        radius="sm"
                        className="w-full h-40 object-cover"
                      />
                    )}

                    <div className="space-y-1 text-gray-600">
                      <p className="font-medium text-gray-800">
                        {booking.room_type.name}
                      </p>
                      <p className="text-xs">{booking.room_type.description}</p>
                      <p className="text-xs">
                        Max Guests: {booking.room_type.max_guest || 1}
                      </p>
                      <p className="font-medium text-primary">
                        {formatPHP(Number(booking.room_type.price))}
                      </p>
                    </div> */}
                  </section>
                )}

                <Divider />

                {/* Payment */}
                {/* <section className="space-y-2">
                  <h3 className="font-medium text-gray-900">Payment</h3>
                  <div className="grid grid-cols-2 gap-3 text-gray-600">
                    <div>
                      <p className="text-xs text-gray-400">Method</p>
                      <p>{booking.payment_method || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="capitalize">
                        {booking.payment_status || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="font-medium">
                        {formatPHP(Number(booking.total || 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Amount Paid</p>
                      <p>{formatPHP(Number(booking.amount_paid || 0))}</p>
                    </div>
                  </div>
                </section> */}
              </ModalBody>

              {/* FOOTER */}
              <ModalFooter className="bg-primary text-white text-xs flex justify-center py-3">
                <Copyright size={12} />
                <span className="ml-1">Guest booking record</span>
              </ModalFooter>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
};

export default ViewModal;
