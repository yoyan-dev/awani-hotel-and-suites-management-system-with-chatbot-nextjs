import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Form,
  Card,
  CardHeader,
  CardBody,
  DatePicker,
  TimeInput,
} from "@heroui/react";
import React from "react";
import GuestForm from "./guest-form";
import {
  today as todayDate,
  getLocalTimeZone,
  Time,
  parseDate,
} from "@internationalized/date";
import { parseISODateOnly } from "@/utils/function-room/event-duration-date";

interface BookingFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  eventDuration: { start: any; end: any };
  setEventDuration: React.Dispatch<
    React.SetStateAction<{ start: any; end: any }>
  >;
  bookingIsLoading: boolean;
}

export default function BookingForm({
  onSubmit,
  eventDuration,
  setEventDuration,
  bookingIsLoading,
}: BookingFormProps) {
  const minDate = React.useMemo(
    () => todayDate(getLocalTimeZone()).add({ days: 5 }),
    [],
  );
  const defaultStartDate = React.useMemo(
    () => parseDate(minDate.toString()),
    [minDate],
  );
  const defaultEndDate = React.useMemo(
    () => parseDate(minDate.toString()),
    [minDate],
  );
  const defaultStartTime = React.useMemo(() => new Time(9, 0), []);
  const defaultEndTime = React.useMemo(() => new Time(17, 0), []);
  const [startDate, setStartDate] = React.useState(defaultStartDate);
  const [endDate, setEndDate] = React.useState(defaultEndDate);
  const [startTime, setStartTime] = React.useState(defaultStartTime);
  const [endTime, setEndTime] = React.useState(defaultEndTime);
  const [isGuestIdVerified, setIsGuestIdVerified] = React.useState(false);

  React.useEffect(() => {
    if (!eventDuration.start || !eventDuration.end) return;

    const startParsed = new Date(String(eventDuration.start));
    const endParsed = new Date(String(eventDuration.end));

    if (!Number.isNaN(startParsed.getTime())) {
      const startDateOnly =
        parseISODateOnly(eventDuration.start) ?? defaultStartDate.toString();
      setStartDate(parseDate(startDateOnly));
      setStartTime(new Time(startParsed.getHours(), startParsed.getMinutes()));
    }

    if (!Number.isNaN(endParsed.getTime())) {
      const endDateOnly =
        parseISODateOnly(eventDuration.end) ?? defaultEndDate.toString();
      setEndDate(parseDate(endDateOnly));
      setEndTime(new Time(endParsed.getHours(), endParsed.getMinutes()));
    }
  }, [
    defaultEndDate,
    defaultStartDate,
    eventDuration.end,
    eventDuration.start,
  ]);

  React.useEffect(() => {
    if (endDate.compare(startDate) < 0) {
      setEndDate(startDate);
    }
  }, [endDate, startDate]);

  React.useEffect(() => {
    const startDatePart = startDate?.toString();
    const endDatePart = endDate?.toString();
    if (!startDatePart || !endDatePart) return;

    const startDateTime = new Date(
      `${startDatePart}T${String(startTime.hour).padStart(2, "0")}:${String(
        startTime.minute,
      ).padStart(2, "0")}:00`,
    );
    const endDateTime = new Date(
      `${endDatePart}T${String(endTime.hour).padStart(2, "0")}:${String(
        endTime.minute,
      ).padStart(2, "0")}:00`,
    );

    const nextStart = startDateTime.toISOString();
    const nextEnd = endDateTime.toISOString();

    setEventDuration((prev) =>
      prev.start === nextStart && prev.end === nextEnd
        ? prev
        : { start: nextStart, end: nextEnd },
    );
  }, [
    endDate,
    endTime.hour,
    endTime.minute,
    setEventDuration,
    startDate,
    startTime.hour,
    startTime.minute,
  ]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl border border-gray-100 dark:border-gray-700">
      <CardHeader className="text-xl font-semibold">Event Booking</CardHeader>

      <CardBody className="dark:bg-gray-900">
        <Form onSubmit={onSubmit} className="space-y-6 px-4 w-full">
          <GuestForm onIdVerificationChange={setIsGuestIdVerified} />

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <DatePicker
                variant="bordered"
                minValue={minDate}
                value={startDate}
                label="Start date"
                onChange={(value) => value && setStartDate(value)}
              />
              <DatePicker
                variant="bordered"
                minValue={startDate}
                value={endDate}
                label="End date"
                onChange={(value) => value && setEndDate(value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput
                isRequired
                label="Start time"
                labelPlacement="outside"
                variant="bordered"
                value={startTime}
                onChange={(value) => value && setStartTime(value as Time)}
              />
              <TimeInput
                isRequired
                label="End time"
                labelPlacement="outside"
                variant="bordered"
                value={endTime}
                onChange={(value) => value && setEndTime(value as Time)}
              />
            </div>
            <Input
              isRequired
              type="number"
              min={1}
              name="number_of_guest"
              label="Number of Guests"
              labelPlacement="outside"
              variant="bordered"
              className="pt-4"
            />
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
              isDisabled={!isGuestIdVerified}
            >
              Submit Booking
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
