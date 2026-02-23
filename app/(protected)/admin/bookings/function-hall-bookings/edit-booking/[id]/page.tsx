"use client";
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
import { TimeInput } from "@heroui/react";
import { TimerIcon } from "lucide-react";
import { Time } from "@internationalized/date";
import { useParams } from "next/navigation";
import Header from "./_components/header";
import { FunctionHallBooking } from "@/types/function-room-booking";

interface EventDuration {
  start: Time | null;
  end: Time | null;
}

export default function EditFunctionHallBookingPage() {
  const { id } = useParams();
  const {
    function_hall_booking,
    isLoading: bookingIsLoading,
    error,
    fetchBooking,
    updateBooking,
  } = useFunctionHallBookings();
  const { guests, isLoading: guestLoading, fetchGuests } = useGuests();

  const [selectedGuest, setSelectedGuest] = React.useState<string>();
  const [selectedPackage, setSelectedPackage] = React.useState<string>();
  const [eventDuration, setEventDuration] = React.useState<EventDuration>({
    start: null,
    end: null,
  });
  const [eventType, setEventType] = React.useState<string>("");
  const [numberOfGuests, setNumberOfGuests] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");

  React.useEffect(() => {
    if (id) {
      fetchBooking(id as string);
    }
    fetchGuests();
  }, [id]);

  // Populate form when booking data is loaded
  React.useEffect(() => {
    if (function_hall_booking?.id) {
      setSelectedGuest(function_hall_booking.guest_id);
      setEventType(function_hall_booking.event_type || "");
      setNumberOfGuests(
        function_hall_booking.number_of_guest?.toString() || "",
      );
      setNotes(function_hall_booking.notes || "");

      // Parse event duration if it exists
      if (function_hall_booking.event_duration) {
        const duration = function_hall_booking.event_duration;
        setEventDuration({
          start: duration.start
            ? new Time(duration.start.hour, duration.start.minute)
            : null,
          end: duration.end
            ? new Time(duration.end.hour, duration.end.minute)
            : null,
        });
      }
    }
  }, [function_hall_booking]);

  const filteredGuest = React.useMemo(
    () =>
      guests.find((guest) => guest.id === selectedGuest) ||
      ({ full_name: "", contact_number: "", address: "" } as GuestType),
    [selectedGuest, guests],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (!selectedGuest) {
        addToast({
          title: "Error",
          description: "Please select a guest.",
          color: "warning",
        });
        return;
      }

      if (!id) {
        addToast({
          title: "Error",
          description: "Booking ID is missing.",
          color: "danger",
        });
        return;
      }

      const updateData: Partial<FunctionHallBooking> = {
        id: id as string,
        guest_id: selectedGuest,
        event_type: eventType,
        number_of_guest: parseInt(numberOfGuests) || 0,
        notes: notes,
        event_duration:
          eventDuration.start && eventDuration.end
            ? {
                start: {
                  hour: eventDuration.start.hour,
                  minute: eventDuration.start.minute,
                },
                end: {
                  hour: eventDuration.end.hour,
                  minute: eventDuration.end.minute,
                },
              }
            : undefined,
      };

      await updateBooking(updateData as FunctionHallBooking);

      if (!error) {
        addToast({
          title: "Success",
          description: "Function hall booking updated successfully.",
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

  if (bookingIsLoading && !function_hall_booking?.id) {
    return (
      <div className="flex-1 px-4 w-full py-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading booking details...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex-1 px-4 w-full space-y-4 py-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Edit Function Hall Booking
        </h1>

        {/* Guest Selection */}
        <div className="space-y-4">
          <h2 className="w-full bg-primary px-2 py-1 text-white">
            Guest Information
          </h2>
          <Select
            isRequired
            fullWidth
            radius="none"
            className="flex-1 w-full min-w-40"
            label="Select Guest"
            labelPlacement="outside"
            placeholder="Select a guest"
            variant="bordered"
            isLoading={guestLoading}
            selectedKeys={selectedGuest ? [selectedGuest] : []}
            onChange={(e) => setSelectedGuest(e.target.value)}
          >
            {guests.map((guest) => (
              <SelectItem key={guest.id} textValue={guest.full_name}>
                <div className="flex flex-col">
                  <span className="text-small font-medium">
                    {guest.full_name}
                  </span>
                  <span className="text-tiny text-gray-600 dark:text-gray-300">
                    {guest.contact_number}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>

          {selectedGuest && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium">{filteredGuest.full_name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredGuest.contact_number}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredGuest.address}
              </p>
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Details */}
          <div className="space-y-4">
            <h2 className="w-full bg-primary px-2 py-1 text-white">
              Event Details
            </h2>

            <Select
              isRequired
              fullWidth
              radius="none"
              className="flex-1 w-full min-w-40"
              label="Event Type"
              labelPlacement="outside"
              placeholder="Select event type"
              variant="bordered"
              selectedKeys={eventType ? [eventType] : []}
              onChange={(e) => setEventType(e.target.value)}
            >
              <SelectItem key="wedding">Wedding</SelectItem>
              <SelectItem key="birthday">Birthday</SelectItem>
              <SelectItem key="corporate">Corporate Event</SelectItem>
              <SelectItem key="debut">Debut</SelectItem>
              <SelectItem key="others">Others</SelectItem>
            </Select>

            <div className="flex gap-4">
              <TimeInput
                label="Start Time"
                labelPlacement="outside"
                variant="bordered"
                startContent={<TimerIcon size={16} />}
                value={eventDuration.start}
                onChange={(time) =>
                  setEventDuration((prev: EventDuration) => ({
                    ...prev,
                    start: time,
                  }))
                }
                className="flex-1"
              />
              <TimeInput
                label="End Time"
                labelPlacement="outside"
                variant="bordered"
                startContent={<TimerIcon size={16} />}
                value={eventDuration.end}
                onChange={(time) =>
                  setEventDuration((prev: EventDuration) => ({
                    ...prev,
                    end: time,
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Package & Guests */}
          <div className="space-y-4">
            <Input
              isRequired
              fullWidth
              variant="bordered"
              radius="none"
              type="number"
              min={1}
              label="Number of Guests"
              name="number_of_guest"
              labelPlacement="outside"
              placeholder="Enter number of guests"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="w-full bg-primary px-2 py-1 text-white">
              Additional Information
            </h2>

            <Textarea
              fullWidth
              variant="bordered"
              radius="none"
              name="notes"
              label="Notes / Special Requests"
              labelPlacement="outside"
              placeholder="Enter any special requests or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-4 justify-end w-full pb-4 pt-4">
            <Button
              type="submit"
              radius="none"
              size="sm"
              color="primary"
              isLoading={bookingIsLoading}
            >
              Update Booking
            </Button>
          </div>
        </Form>
      </div>
      <div className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin py-2">
        <Copyright size={10} /> Alright reserved Ma. Awani.
      </div>
    </>
  );
}
