"use client";

import BookingForm from "./_components/booking-form";
import SelectedRoom from "./_components/selected-room";
import { addToast, Card, CardBody, CardHeader } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import AvailableRooms from "./_components/available-rooms";
import { useGuests } from "@/hooks/use-guests";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useBookings } from "@/hooks/use-bookings";
import { FetchRoomTypesParams } from "@/types/room";
import { generateSummary } from "@/utils/generate-summary";
import { Booking } from "@/types/booking";
import { BookingSpecialRequest } from "@/types/add-on";
import { addGuest as addGuestThunk } from "@/features/guest/guest-thunk";
import { addBooking as addHotelBooking } from "@/features/booking/hotel-rooms/booking-thunk";
import { buildGuestFormData } from "@/app/guest/reservations/_utils/build-guest-form-data";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [query, setQuery] = React.useState<FetchRoomTypesParams>({});
  const [selectedRoom, setSelectedRoom] = React.useState(id || null);
  const { addGuest, isLoading: addGuestIsLoading } = useGuests();
  const { availabel_room_types, isLoading, fetchAvailableRoomTypes } =
    useRoomTypes();
  const { isLoading: bookingIsLoading, addBooking } = useBookings();

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
    if (!room || !query.checkIn || !query.checkOut) {
      return null;
    }
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

    const { guestFormData, generatedGuestId } = buildGuestFormData(formData);
    const addGuestResult = await addGuest(guestFormData);
    if (!addGuestThunk.fulfilled.match(addGuestResult)) {
      addToast({
        title: "Guest Registration Failed",
        description:
          "We could not save guest information. Please review your details and try again.",
        color: "danger",
      });
      return;
    }

    const createdGuestId = addGuestResult.payload.id || generatedGuestId;
    const filteredSpecialRequest = specialRequests.filter(
      (req) => req.quantity > 0,
    );

    formData.append("guest_id", createdGuestId);
    formData.append("total", String(payload?.total ?? 0));
    formData.append("total_add_ons", String(payload?.totalAddOnsPrice ?? 0));
    formData.append(
      "special_requests",
      JSON.stringify(filteredSpecialRequest || []),
    );

    const addBookingResult = await addBooking(formData);
    if (addHotelBooking.fulfilled.match(addBookingResult)) {
      addToast({
        title: "Booking Successful",
        description:
          "Your reservation has been submitted successfully. Our team will review your request and contact you shortly for confirmation. Thank you for choosing our hotel!",
        color: "success",
      });
      router.push("/guest");
    }
  }

  return (
    <div className="min-h-screen pb-12 pt-6 md:pt-8">
      <Card className="mx-auto w-full max-w-[1320px] rounded-4xl border border-[#e3d8c8] bg-[#fffdf8] shadow-[0_32px_70px_-50px_rgba(31,26,19,0.54)]">
        <CardHeader className="flex flex-col items-start gap-3 border-b border-[#eadfce] bg-[#f8f1e8] px-5 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#987345]">
            Secure Reservation
          </p>
          <h1 className="font-serif text-3xl tracking-tight text-[#231f1a] md:text-4xl">
            Hotel Reservation
          </h1>
          <p className="text-sm text-[#645b4e]">
            Complete your details and select your preferred room arrangement.
          </p>
        </CardHeader>
        <CardBody className="w-full gap-8 p-4 sm:p-6 lg:p-8">
          <div className="grid w-full grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
            <BookingForm
              onSubmit={(e) => handleSubmit(e, summary)}
              query={query}
              setQuery={setQuery}
              roomTypes={availabel_room_types}
              room={room || null}
              summary={summary}
              isLoading={isLoading}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
              bookingIsLoading={bookingIsLoading}
              addGuestIsLoading={addGuestIsLoading}
            />
            {room ? (
              <SelectedRoom room={room} isLoading={isLoading} />
            ) : query.checkIn && query.checkOut ? (
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
