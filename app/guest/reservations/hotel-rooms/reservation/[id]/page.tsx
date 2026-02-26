"use client";

import BookingForm from "./_components/booking-form";
import SelectedRoom from "./_components/selected-room";
import { addToast, Card, CardBody, CardHeader } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import AvailableRooms from "./_components/available-rooms";
import { supabase } from "@/lib/supabase/supabase-client";
import { useGuests } from "@/hooks/use-guests";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useBookings } from "@/hooks/use-bookings";
import { FetchRoomTypesParams } from "@/types/room";
import { generateSummary } from "@/utils/generate-summary";
import { Booking } from "@/types/booking";
import { BookingSpecialRequest } from "@/types/add-on";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [query, setQuery] = React.useState<FetchRoomTypesParams>({});
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
    BookingSpecialRequest[]
  >([]);

  React.useEffect(() => {
    if (query.checkIn && query.checkOut) {
      fetchAvailableRoomTypes(query);
    }
  }, [query]);

  const room = React.useMemo(() => {
    if (selectedRoom) {
      return availabel_room_types.find((room) => room.id === selectedRoom);
    }
    return null;
  }, [availabel_room_types, selectedRoom]);

  React.useEffect(() => {
    if (room?.room_type_add_ons) {
      setSpecialRequests(
        room.room_type_add_ons.map((item: any) => ({
          room_type_add_on_id: item.id,
          add_on_id: item.add_on_id,
          name: item.add_on?.name,
          price: item.add_on?.price,
          quantity_limit: item.quantity_limit,
          remaining_quantity: item.remaining_quantity ?? item.quantity_limit,
          quantity: 0,
        })),
      );
    } else {
      setSpecialRequests([]);
    }
  }, [room]);

  const summary = React.useMemo(() => {
    if (
      specialRequests.length === 0 ||
      !room ||
      !query.checkIn ||
      !query.checkOut
    )
      return null;
    return generateSummary(
      {
        checked_in: query.checkIn,
        checked_out: query.checkOut,
        room_type: room,
        payment_method: "",
        amount_paid: 0,
      } as Booking,
      specialRequests,
    );
  }, [specialRequests, room, query]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    payload: any,
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const filtereSpecialRequest = specialRequests.filter(
      (req) => req.quantity > 0,
    );

    const checked_in_date = formData.get("checked_in") || "";
    
    formData.append("guest_id", guestId || "");
    formData.append("total", payload?.total);
    formData.append("total_add_ons", payload?.totalAddOnsPrice);
    formData.append(
      "special_requests",
      JSON.stringify(filtereSpecialRequest || []),
    );
    console.log(formData);
    await addBooking(formData);
    if (error === undefined) {
      addToast({
        title: "Booking Successful",
        description:
          "Your reservation has been submitted successfully. Our team will review your request and contact you shortly for confirmation. Thank you for choosing our hotel!",
        color: "success",
      });
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen pb-12 pt-6 md:pt-8">
      <Card className="mx-auto w-full max-w-7xl border border-default-200/70 bg-content1 shadow-sm dark:border-default-100/10">
        <CardHeader className="flex flex-col items-start gap-2 border-b border-default-200/60 bg-content2/40 px-5 py-5 sm:px-8 dark:border-default-100/10">
          {/* Refined page header for stronger visual hierarchy */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Hotel Reservation
          </h1>
          <p className="text-sm text-default-600 dark:text-default-300">
            Complete your details and select your preferred room arrangement.
          </p>
        </CardHeader>
        <CardBody className="w-full gap-8 p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
          {/* Responsive two-column layout:
              mobile/tablet: stacked
              desktop: booking form + room summary/available rooms side panel */}
          <div className="grid w-full grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
            <BookingForm
              onSubmit={(e) => handleSubmit(e, summary)}
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
            {room && guestId ? (
              <SelectedRoom room={room} isLoading={isLoading} />
            ) : guestId ? (
              <AvailableRooms
                rooms={availabel_room_types}
                isLoading={isLoading}
                setSelectedRoom={setSelectedRoom}
              />
            ) : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
