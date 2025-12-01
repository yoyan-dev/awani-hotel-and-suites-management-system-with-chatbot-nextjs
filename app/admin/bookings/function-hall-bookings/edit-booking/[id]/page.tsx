"use client";
import { Button, Form } from "@heroui/react";
import { Copyright } from "lucide-react";
import React from "react";
import BookingDetailsSection from "./_components/booking-details-section";
import GuestInfoSection from "./_components/guest-info-section";
import { useBookings } from "@/hooks/use-bookings";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useRooms } from "@/hooks/use-rooms";
import { Booking } from "@/types/booking";
import { useParams } from "next/navigation";
import Header from "./_components/header";

export default function EditBookingPage() {
  const { id } = useParams();
  const {
    room_types,
    isLoading: typesLoading,
    fetchRoomTypes,
  } = useRoomTypes();
  const {
    booking,
    isLoading: bookingIsLoading,
    error: bookingError,
    fetchBooking,
    updateBooking,
  } = useBookings();
  const { rooms, isLoading: roomLoading, fetchAvailableRooms } = useRooms();
  const [formData, setFormData] = React.useState<Booking>({} as Booking);
  const [specialRequests, setSpecialRequests] = React.useState<
    { name: string; price: string; quantity: number; max_quantity: number }[]
  >([]);

  React.useEffect(() => {
    if (id) {
      fetchBooking(id as string);
      fetchRoomTypes({});
    }
  }, [id]);

  React.useEffect(() => {
    setSpecialRequests(booking.special_requests || []);
    setFormData(booking);
  }, [booking]);

  React.useEffect(() => {
    if (formData?.room_type_id) {
      fetchAvailableRooms({
        roomTypeID: formData?.room_type_id,
        checkIn: formData.check_in,
        checkOut: formData.check_out,
      });
    }
  }, [formData?.room_type_id, formData?.check_in, formData?.check_out]);

  React.useEffect(() => {
    if (
      formData?.room_type_id === booking.room_type_id &&
      booking.special_requests?.length > 0
    )
      return;
    const room = room_types.find((room) => room.id === formData?.room_type_id);
    if (room?.add_ons && booking?.id) {
      setSpecialRequests(
        booking.special_requests?.length > 0
          ? booking.special_requests
          : room.add_ons.map((item: any) => ({
              name: item.name,
              price: item.price,
              quantity: 0,
              max_quantity: item.max_quantity,
            }))
      );
    }
  }, [formData?.room_type_id, booking]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateBooking({
        id: booking.id,
        room_type_id: formData.room_type_id,
        check_in: formData.check_in,
        check_out: formData.check_out,
        room_id: formData.room_id,
        special_requests: specialRequests,
        number_of_guests: formData.number_of_guests,
        status: formData.room_id ? "confirmed" : "pending",
      } as Booking);
    } catch (err) {
      console.error("Failed to update booking", err);
    }
  }

  return (
    <>
      {bookingIsLoading && formData.id ? (
        <div>Loading...</div>
      ) : (
        <>
          <Header />
          <div className="flex-1 px-4 w-full space-y-4 py-4">
            <GuestInfoSection guest={booking.user} />
            <Form onSubmit={handleSubmit}>
              <BookingDetailsSection
                formData={formData}
                setFormData={setFormData}
                room_types={room_types}
                rooms={rooms}
                specialRequests={specialRequests}
                setSpecialRequests={setSpecialRequests}
                typesLoading={typesLoading}
                roomLoading={roomLoading}
              />
              <div className="flex gap-4 justify-end w-full pb-4">
                <Button
                  type="submit"
                  color="primary"
                  radius="none"
                  isLoading={bookingIsLoading}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
          <div className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin py-2">
            <Copyright size={10} /> Alright reserved Ma. Awani.
          </div>
        </>
      )}
    </>
  );
}
