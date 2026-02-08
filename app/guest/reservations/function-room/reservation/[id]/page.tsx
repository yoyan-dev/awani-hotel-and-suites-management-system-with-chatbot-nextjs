"use client";

import BookingForm from "./_components/booking-form";
import SelectedRoom from "./_components/selected-room";
import { addToast, Card, CardBody, CardHeader } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import AvailableRooms from "./_components/available-rooms";
import { supabase } from "@/lib/supabase-client";
import { useGuests } from "@/hooks/use-guests";
import { useRoomTypes } from "@/hooks/use-room-types";
import { useBookings } from "@/hooks/use-bookings";
import { FetchRoomTypesParams } from "@/types/room";
import { generateSummary } from "@/utils/generate-summary";
import { Booking } from "@/types/booking";
import { useBanquetPackages } from "@/hooks/use-banquet-packages";
import { BanquetPackageFetchParams } from "@/types/banquet-package";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = React.useState(id || null);
  const [guestId, setGuestId] = React.useState<string | null>(null);
  const [eventDate, setEventDate] = React.useState();
  const [EventDuration, setEventDuration] = React.useState({
    start: "",
    end: "",
  });
  const { items, isLoading, fetchBanquetPackages } = useBanquetPackages();
  const {
    function_hall_bookings,
    isLoading: bookingIsLoading,
    error,
    fetchBookings,
    addBooking,
  } = useFunctionHallBookings();

  React.useEffect(() => {
    fetchBanquetPackages({} as BanquetPackageFetchParams);
  }, []);

  const banquetPackage = React.useMemo(() => {
    if (selectedPackage) {
      return items.find((pkg) => pkg.id === selectedPackage);
    }
    return null;
  }, [items, selectedPackage]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await fetchBookings({ guest_id: guestId || "", event_date: eventDate });
    if (!bookingIsLoading && function_hall_bookings.length > 0) {
      addToast({
        title: "Error!",
        description:
          "You still have a pending booking reservation. Please contact awani customer service for assistance.",
        color: "warning",
      });
      return;
    }
    formData.append("guest_id", guestId || "");
    formData.append("event_duration", JSON.stringify(EventDuration));

    await addBooking(formData);
    if (error === undefined) {
      addToast({
        title: "Reservation Successful",
        description:
          "Your reservation has been submitted successfully. Our team will review your request and contact you shortly for confirmation. Thank you for choosing our hotel!",
        color: "success",
      });
      // router.push("/");
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <Card className="border-none shadow-none">
        <CardHeader className="text-xl font-semibold text-center dark:bg-gray-900 ">
          Hotel Reservation
        </CardHeader>
        <CardBody className="dark:bg-gray-900  w-full flex flex-col lg:flex-row items-start gap-8">
          <BookingForm
            onSubmit={handleSubmit}
            guestId={guestId}
            setGuestId={setGuestId}
            items={items}
            banquetPackage={banquetPackage || null}
            isLoading={isLoading}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
            eventDate={eventDate}
            setEventDate={setEventDate}
            eventDuration={EventDuration}
            setEventDuration={setEventDuration}
            bookingIsLoading={bookingIsLoading}
          />
          {/* {room ? (
            <SelectedRoom room={room} isLoading={isLoading} />
          ) : (
            <AvailableRooms
              rooms={availabel_room_types}
              isLoading={isLoading}
              setSelectedRoom={setSelectedRoom}
            />
          )} */}
        </CardBody>
      </Card>
    </div>
  );
}
