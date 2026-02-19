"use client";
import { Guest } from "@/types/guest";
import {
  Button,
  Form,
  addToast,
  Select,
  SelectItem,
  Input,
  Textarea,
} from "@heroui/react";
import { Copyright } from "lucide-react";
import React from "react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { useGuests } from "@/hooks/use-guests";
import { useBanquetPackages } from "@/hooks/use-banquet-packages";
import { Guest as GuestType } from "@/types/guest";
import { BanquetPackageFetchParams } from "@/types/banquet-package";
import { Time } from "@internationalized/date";
import GuestInfoSection from "./_components/guest-info-section";
import BookingDetailsSection from "./_components/booking-details-section";

interface EventDuration {
  start: any;
  end: any;
}

export default function AddFunctionHallBookingPage() {
  const {
    isLoading: bookingIsLoading,
    error,
    addBooking,
  } = useFunctionHallBookings();
  const { guests, isLoading: guestLoading, fetchGuests } = useGuests();

  const [selectedGuest, setSelectedGuest] = React.useState<string>();
  const [eventDuration, setEventDuration] = React.useState<EventDuration>({
    start: null,
    end: null,
  });

  React.useEffect(() => {
    fetchGuests();
  }, []);

  const filteredGuest = React.useMemo(
    () =>
      guests.find((guest) => guest.id === selectedGuest) ||
      ({ full_name: "", contact_number: "", address: "" } as GuestType),
    [selectedGuest, guests],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      if (!selectedGuest) {
        addToast({
          title: "Error",
          description: "Please select or register guest.",
          color: "warning",
        });
        return;
      }

      if (!eventDuration.start || !eventDuration.end) {
        addToast({
          title: "Error",
          description: "Please select event start and end time.",
          color: "warning",
        });
        return;
      }

      formData.append("status", "confirmed");
      formData.append("guest_id", selectedGuest);
      formData.append("event_duration", JSON.stringify(eventDuration));
      formData.append("booking_source", "walk-in");

      await addBooking(formData);

      if (!error) {
        addToast({
          title: "Success",
          description: "Function hall booking created successfully.",
          color: "success",
        });
      }
    } catch (e: any) {
      addToast({
        title: "Error!",
        description: e?.message || "Unknown Error!",
        color: "warning",
      });
    }
  }

  return (
    <>
      <div className="flex-1 px-4 w-full space-y-4 py-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Add Function Hall Booking
        </h1>

        <GuestInfoSection
          guests={guests}
          selectedGuest={selectedGuest}
          setSelectedGuest={setSelectedGuest}
          filteredGuest={filteredGuest}
          loading={guestLoading}
        />

        <BookingDetailsSection
          handleSubmit={handleSubmit}
          eventDuration={eventDuration}
          setEventDuration={setEventDuration}
          bookingIsLoading={bookingIsLoading}
        />
      </div>
      <div className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin py-2">
        <Copyright size={10} /> Alright reserved Ma. Awani.
      </div>
    </>
  );
}
