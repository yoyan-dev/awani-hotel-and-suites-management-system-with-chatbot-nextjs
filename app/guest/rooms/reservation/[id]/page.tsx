"use client";

import BookingForm from "./_components/booking-form";
import SelectedRoom from "./_components/selected-room";
import { addToast, Card, CardBody, CardHeader } from "@heroui/react";
import { useParams } from "next/navigation";
import React from "react";
import AvailableRooms from "./_components/available-rooms";
import { supabase } from "@/lib/supabase/supabase-client";
import { useGuests } from "@/hooks/use-guests";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useBookings } from "@/hooks/use-bookings";
import { FetchRoomTypesParams } from "@/types/room";

export default function Page() {
  const { id } = useParams();
  const [query, setQuery] = React.useState<FetchRoomTypesParams>({});
  const { guest, isLoading: guestIsLoading, fetchGuest } = useGuests();
  const [selectedRoom, setSelectedRoom] = React.useState(id || null);
  const [guestId, setGuestId] = React.useState<string | null>(null);
  const { availabel_room_types, isLoading, fetchAvailableRoomTypes } =
    useRoomTypes();
  const {
    bookings,
    isLoading: bookingIsLoading,
    error,
    fetchBookings,
    addBooking,
  } = useBookings();

  const [specialRequests, setSpecialRequests] = React.useState<
    { name: string; price: string; quantity: number }[]
  >([]);

  React.useEffect(() => {
    if (query.checkIn && query.checkOut) {
      fetchAvailableRoomTypes(query);
    }
    // getCurrentUser();
  }, [query]);

  const room = React.useMemo(() => {
    if (selectedRoom) {
      return availabel_room_types.find((room) => room.id === selectedRoom);
    }
    return null;
  }, [availabel_room_types, selectedRoom]);

  React.useEffect(() => {
    if (room?.add_ons) {
      setSpecialRequests(
        room.add_ons.map((item: any) => ({
          name: item.name,
          price: item.price,
          max_quantity: item.max_quantity,
          quantity: 0,
        }))
      );
    } else {
      setSpecialRequests([]);
    }
  }, [room]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const filtereSpecialRequest = specialRequests.filter(
      (req) => req.quantity > 0
    );

    const check_in_date = formData.get("check_in") || "";
    await fetchBookings({ guest_id: guest.id, check_in: check_in_date });
    if (!bookingIsLoading && bookings.length > 0) {
      addToast({
        title: "Error!",
        description:
          "You still have a pending booking reservation. Please contact awani customer service for assistance.",
        color: "warning",
      });
      return;
    }
    formData.append("guest_id", guest.id || "");
    formData.append(
      "special_requests",
      JSON.stringify(filtereSpecialRequest || [])
    );
    console.log(formData);
    await addBooking(formData);
    if (!error) {
      addToast({
        title: "Booking Successful",
        description:
          "Your reservation has been submitted successfully. Our team will review your request and contact you shortly for confirmation. Thank you for choosing our hotel!",
        color: "success",
      });
    }
  }

  return (
    <div>
      <Card className="border-none shadow-none">
        <CardHeader className="text-xl font-semibold text-center dark:bg-gray-900 ">
          Hotel Reservation
        </CardHeader>
        <CardBody className="dark:bg-gray-900  w-full flex flex-col lg:flex-row items-start gap-8">
          <BookingForm
            onSubmit={handleSubmit}
            query={query}
            setQuery={setQuery}
            guestId={guestId}
            setGuestId={setGuestId}
            roomTypes={availabel_room_types}
            room={room || null}
            isLoading={isLoading}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            specialRequests={specialRequests}
            setSpecialRequests={setSpecialRequests}
            bookingIsLoading={bookingIsLoading}
          />
          {room ? (
            <SelectedRoom room={room} isLoading={isLoading} />
          ) : (
            <AvailableRooms
              rooms={availabel_room_types}
              isLoading={isLoading}
              setSelectedRoom={setSelectedRoom}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
