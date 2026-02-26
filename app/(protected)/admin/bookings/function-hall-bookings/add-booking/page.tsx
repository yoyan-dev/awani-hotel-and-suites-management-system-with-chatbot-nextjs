"use client";
import { Form, addToast } from "@heroui/react";
import { Copyright } from "lucide-react";
import React from "react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { useGuests } from "@/hooks/use-guests";
import GuestInfoSection from "./_components/guest-info-section";
import BookingDetailsSection from "./_components/booking-details-section";
import { addBooking as addFunctionHallBooking } from "@/features/booking/function-hall/booking-thunk";
import { addGuest as addGuestThunk } from "@/features/guest/guest-thunk";
import { parseISODateTime } from "@/utils/function-room/event-duration-date";

interface EventDuration {
  start: any;
  end: any;
}

export default function AddFunctionHallBookingPage() {
  const { isLoading: bookingIsLoading, addBooking } = useFunctionHallBookings();
  const { addGuest } = useGuests();
  const [eventDuration, setEventDuration] = React.useState<EventDuration>({
    start: null,
    end: null,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const guestId = crypto.randomUUID();
      const guestFormData = new FormData();
      guestFormData.append("id", guestId);
      guestFormData.append(
        "full_name",
        String(formData.get("guest_full_name") ?? ""),
      );
      guestFormData.append(
        "contact_number",
        String(formData.get("guest_contact_number") ?? ""),
      );
      guestFormData.append("address", String(formData.get("guest_address") ?? ""));
      guestFormData.append(
        "nationality",
        String(formData.get("guest_nationality") ?? ""),
      );
      guestFormData.append("email", String(formData.get("guest_email") ?? ""));

      const addGuestResult = await addGuest(guestFormData);
      if (!addGuestThunk.fulfilled.match(addGuestResult)) {
        addToast({
          title: "Error",
          description: "Unable to create guest record.",
          color: "danger",
        });
        return;
      }

      if (!eventDuration.start || !eventDuration.end) {
        addToast({
          title: "Error",
          description: "Please select event date and start/end time.",
          color: "warning",
        });
        return;
      }

      const eventStartISO = String(eventDuration.start);
      const eventEndISO = String(eventDuration.end);
      const eventStart = parseISODateTime(eventStartISO);
      const eventEnd = parseISODateTime(eventEndISO);

      if (!eventStart || !eventEnd || eventStart >= eventEnd) {
        addToast({
          title: "Error",
          description:
            "Invalid event duration. End time must be after start time.",
          color: "warning",
        });
        return;
      }

      formData.append("status", "confirmed");
      formData.append("guest_id", addGuestResult.payload.id || guestId);
      formData.append("event_start", eventStartISO);
      formData.append("event_end", eventEndISO);
      formData.append("booking_source", "walk-in");

      const addResult = await addBooking(formData);
      if (addFunctionHallBooking.fulfilled.match(addResult)) {
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
        <Form onSubmit={handleSubmit} className="space-y-4 w-full">
          <GuestInfoSection />

          <BookingDetailsSection
            eventDuration={eventDuration}
            setEventDuration={setEventDuration}
            bookingIsLoading={bookingIsLoading}
          />
        </Form>
      </div>
      <div className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin py-2">
        <Copyright size={10} /> Alright reserved Ma. Awani.
      </div>
    </>
  );
}
