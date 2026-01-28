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
  Button,
  Input,
} from "@heroui/react";
import { format } from "date-fns";
import { Copyright, SquareCheckBig, SquarePen, SquareX } from "lucide-react";

import { useBookings } from "@/hooks/use-bookings";
import { formatPHP } from "@/lib/format-php";
import { Booking } from "@/types/booking";
import { generateSummary } from "@/utils/generate-summary";

interface ViewModalProps {
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ data, isOpen, onClose }) => {
  const { booking, isLoading, fetchBooking, fetchBookings, updateBooking } =
    useBookings();
  const [formData, setFormData] = React.useState<Booking>({} as Booking);
  const [editBookingDetails, setEditBookingDetails] = React.useState(false);

  React.useEffect(() => {
    if (data?.id) {
      fetchBooking(data.id);
    }
  }, [data?.id]);

  React.useEffect(() => {
    setFormData(booking);
  }, [booking]);

  const summary = React.useMemo(() => {
    if (!booking?.id)
      return {
        total: 0,
        totalAddOnsPrice: 0,
      };
    if (
      booking.special_requests.length === 0 ||
      !booking.room_type ||
      !formData.check_in ||
      !formData.check_out
    )
      return null;
    return generateSummary(
      {
        check_in: formData.check_in,
        check_out: formData.check_out,
        room_type: booking.room_type,
        payment_method: booking.payment_method,
        amount_paid: booking.amount_paid,
      } as Booking,
      booking.special_requests,
    );
  }, [formData.check_in, formData.check_out]);

  if (!booking?.id) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      placement="top-center"
      radius="sm"
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
                      <div>
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
                      </div>
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
                    <div className="flex gap-4">
                      <Button
                        onPress={() =>
                          setEditBookingDetails(!editBookingDetails)
                        }
                        variant="flat"
                        color={!editBookingDetails ? "primary" : "danger"}
                        size="sm"
                      >
                        {editBookingDetails ? (
                          <SquareX size={16} />
                        ) : (
                          <SquarePen size={16} />
                        )}
                      </Button>
                      {editBookingDetails && (
                        <Button
                          isLoading={isLoading}
                          onPress={async () => {
                            await updateBooking({
                              id: booking.id,
                              check_in: formData.check_in,
                              check_out: formData.check_out,
                              number_of_guests: formData.number_of_guests,
                              total: String(summary?.total || booking.total),
                              total_add_ons: String(
                                summary?.totalAddOnsPrice ||
                                  booking.total_add_ons,
                              ),
                            } as Booking);
                            await fetchBookings({
                              roomTypeID: booking.room_type.id,
                              room_id: booking.room_id,
                            });
                          }}
                          variant="flat"
                          color="primary"
                          size="sm"
                        >
                          <SquareCheckBig size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-gray-600">
                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>
                      {editBookingDetails ? (
                        <Input
                          type="date"
                          value={formData.check_in}
                          isDisabled={booking.status === "check-in"}
                          onChange={(e) =>
                            setFormData({
                              ...booking,
                              check_in: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p>
                          {booking.check_in
                            ? format(new Date(booking.check_in), "MMM dd, yyyy")
                            : "—"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>
                      {editBookingDetails ? (
                        <Input
                          type="date"
                          value={formData.check_out}
                          onChange={(e) =>
                            setFormData({
                              ...booking,
                              check_out: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p>
                          {booking.check_out
                            ? format(
                                new Date(booking.check_out),
                                "MMM dd, yyyy",
                              )
                            : "—"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Guests</p>
                      {editBookingDetails ? (
                        <Input
                          type="number"
                          value={formData.number_of_guests?.toString()}
                          isDisabled={booking.status === "check-in"}
                          onChange={(e) =>
                            setFormData({
                              ...booking,
                              number_of_guests: Number(e.target.value),
                            })
                          }
                        />
                      ) : (
                        <p>{booking.number_of_guests || 1}</p>
                      )}
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

                    {booking.room_type.image && (
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
                    </div>
                  </section>
                )}

                <Divider />

                {/* Payment */}
                <section className="space-y-2">
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
                </section>
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
