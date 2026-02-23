import { Booking } from "@/types/booking";
import {
  Button,
  Chip,
  Input,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  Textarea,
  CheckboxGroup,
  Checkbox,
  Form,
  Tooltip,
  Spinner,
  cn,
  Card,
  CardHeader,
  CardBody,
  DateRangePicker,
  TimeInput,
} from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Link,
  Minus,
  Plus,
  TimerIcon,
} from "lucide-react";
import React, { useState } from "react";
import ViewModal from "./modals/view-modal";
import { Guest } from "@/types/guest";
import PolicyModal from "./modals/policy-modal";
import { formatPHP } from "@/lib/format-php";
import GuestForm from "./guest-form";
import {
  parseZonedDateTime,
  parseAbsoluteToLocal,
} from "@internationalized/date";
interface BookingFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  guestId: string | null;
  setGuestId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedPackage: any;
  setSelectedPackage: React.Dispatch<React.SetStateAction<any>>;
  eventDuration: { start: any; end: any };
  setEventDuration: React.Dispatch<
    React.SetStateAction<{ start: any; end: any }>
  >;
  bookingIsLoading: boolean;
}

export default function BookingForm({
  onSubmit,
  guestId,
  setGuestId,
  selectedPackage,
  setSelectedPackage,
  eventDuration,
  setEventDuration,
  bookingIsLoading,
}: BookingFormProps) {
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);
  return (
    <>
      {!guestId ? (
        <GuestForm guestId={guestId} setGuestId={setGuestId} />
      ) : (
        <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl border border-gray-100 dark:border-gray-700">
          <CardHeader className="text-xl font-semibold">
            📝 Event / Banquet Booking
          </CardHeader>

          <CardBody className="dark:bg-gray-900">
            <Form onSubmit={onSubmit} className="space-y-6 px-4 w-full">
              <div className="space-y-4 w-full">
                <h1 className="flex items-center gap-2">Event Details</h1>
                <Select
                  fullWidth
                  isRequired
                  label="Event Type"
                  name="event_type"
                  labelPlacement="outside"
                  placeholder="Select event type"
                  variant="bordered"
                  className="pt-4"
                >
                  <SelectItem key="wedding">Wedding</SelectItem>
                  <SelectItem key="birthday">Birthday</SelectItem>
                  <SelectItem key="corporate">Corporate Event</SelectItem>
                  <SelectItem key="debut">Debut</SelectItem>
                  <SelectItem key="others">Others</SelectItem>
                </Select>
                <DateRangePicker
                  variant="bordered"
                  hideTimeZone
                  defaultValue={{
                    start: parseAbsoluteToLocal(fiveDaysLater.toISOString()),
                    end: parseAbsoluteToLocal(fiveDaysLater.toISOString()),
                  }}
                  label="Event duration"
                  className="pt-4"
                  onChange={(value) =>
                    setEventDuration({ start: value?.start, end: value?.end })
                  }
                />
                <Input
                  isRequired
                  type="number"
                  min={1}
                  name="number_of_guest"
                  label="Number of Guests"
                  labelPlacement="outside"
                  variant="bordered"
                  className="pt-4"
                />{" "}
                <Textarea
                  name="notes"
                  label="Special Requests / Notes"
                  labelPlacement="outside"
                  placeholder="Stage setup, dietary needs, program flow, etc."
                  variant="bordered"
                  className="pt-4"
                />
              </div>

              <div className="flex justify-end w-full">
                <Button
                  color="primary"
                  type="submit"
                  isLoading={bookingIsLoading}
                >
                  Submit Booking
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      )}
    </>
  );
}
