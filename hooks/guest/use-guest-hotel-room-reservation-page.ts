"use client";

import React from "react";
import { addToast } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useGuests } from "@/hooks/use-guests";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useBookings } from "@/hooks/use-bookings";
import { FetchRoomTypesParams } from "@/types/room";
import { generateSummary } from "@/utils/generate-summary";
import { Booking } from "@/types/booking";
import { BookingSpecialRequest } from "@/types/add-on";
import { addGuest as addGuestThunk } from "@/features/guest/guest-thunk";
import { addBooking as addHotelBooking } from "@/features/booking/hotel-rooms/booking-thunk";
import { buildGuestFormData } from "@/utils/guest/build-guest-form-data";

export function useGuestHotelRoomReservationPage() {
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

  return {
    query,
    setQuery,
    selectedRoom,
    setSelectedRoom,
    addGuestIsLoading,
    rooms: availabel_room_types,
    isLoading,
    room,
    specialRequests,
    setSpecialRequests,
    summary,
    bookingIsLoading,
    handleSubmit,
  };
}
