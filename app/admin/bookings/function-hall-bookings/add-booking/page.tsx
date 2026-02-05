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
import { TimeInput } from "@heroui/react";
import { TimerIcon } from "lucide-react";
import { Time } from "@internationalized/date";

interface EventDuration {
  start: Time | null;
  end: Time | null;
}

export default function AddFunctionHallBookingPage() {
  const {
    isLoading: bookingIsLoading,
    error,
    addBooking,
  } = useFunctionHallBookings();
  const { guests, isLoading: guestLoading, fetchGuests } = useGuests();
  const {
    items: banquetPackages,
    isLoading: packageLoading,
    fetchBanquetPackages,
  } = useBanquetPackages();

  const [selectedGuest, setSelectedGuest] = React.useState<string>();
  const [selectedPackage, setSelectedPackage] = React.useState<string>();
  const [eventDuration, setEventDuration] = React.useState<EventDuration>({
    start: null,
    end: null,
  });

  React.useEffect(() => {
    fetchGuests();
    fetchBanquetPackages({} as BanquetPackageFetchParams);
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
              name="event_type"
              label="Event Type"
              labelPlacement="outside"
              placeholder="Select event type"
              variant="bordered"
            >
              <SelectItem key="wedding">Wedding</SelectItem>
              <SelectItem key="birthday">Birthday</SelectItem>
              <SelectItem key="corporate">Corporate Event</SelectItem>
              <SelectItem key="debut">Debut</SelectItem>
              <SelectItem key="others">Others</SelectItem>
            </Select>

            <Input
              isRequired
              fullWidth
              variant="bordered"
              radius="none"
              type="date"
              label="Event Date"
              name="event_date"
              labelPlacement="outside"
            />

            <div className="flex gap-4">
              <TimeInput
                isRequired
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
                isRequired
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
            <h2 className="w-full bg-primary px-2 py-1 text-white">
              Package & Guests
            </h2>

            <Select
              isRequired
              fullWidth
              radius="none"
              className="flex-1 w-full min-w-40"
              name="banquet_package_id"
              label="Banquet Package"
              labelPlacement="outside"
              placeholder="Select banquet package"
              variant="bordered"
              isLoading={packageLoading}
              selectedKeys={selectedPackage ? [selectedPackage] : []}
              onChange={(e) => setSelectedPackage(e.target.value)}
            >
              {banquetPackages.map((pkg) => (
                <SelectItem key={pkg.id} textValue={pkg.name}>
                  <div className="flex flex-col">
                    <span className="text-small font-medium">{pkg.name}</span>
                    <span className="text-tiny text-gray-600 dark:text-gray-300">
                      ₱{pkg.price_per_cover} per cover
                    </span>
                  </div>
                </SelectItem>
              ))}
            </Select>

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
              Create Booking
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
