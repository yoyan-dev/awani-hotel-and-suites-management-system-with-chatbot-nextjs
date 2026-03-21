import {
  Select,
  SelectItem,
  Input,
  Button,
  TimeInput,
  Textarea,
  DatePicker,
} from "@heroui/react";
import {
  today as todayDate,
  getLocalTimeZone,
  Time,
  parseDate,
} from "@internationalized/date";
import React from "react";
import { parseISODateOnly } from "@/utils/function-room/event-duration-date";
interface EventDuration {
  start: any;
  end: any;
}

interface Props {
  eventDuration: EventDuration;
  setEventDuration: React.Dispatch<React.SetStateAction<EventDuration>>;
  bookingIsLoading: boolean;
}

export default function BookingDetailsSection({
  eventDuration,
  setEventDuration,
  bookingIsLoading,
}: Props) {
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
  }, [defaultEndDate, defaultStartDate, eventDuration.end, eventDuration.start]);

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
    <div className="space-y-4 w-full">
      {/* Event Details */}
      <div className="space-y-4 w-full">
        <h2 className="w-full bg-primary px-2 py-1 text-white">
          Event Details
        </h2>

        <Select
          isRequired
          fullWidth
          radius="none"
          className="flex-1 w-full min-w-40 pt-4"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <DatePicker
            variant="bordered"
            minValue={minDate}
            value={startDate}
            label="Start date"
            isRequired
            onChange={(value) => value && setStartDate(value)}
          />
          <DatePicker
            variant="bordered"
            minValue={startDate}
            value={endDate}
            label="End date"
            isRequired
            onChange={(value) => value && setEndDate(value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TimeInput
            isRequired
            label="Start Time"
            labelPlacement="outside"
            variant="bordered"
            value={startTime}
            onChange={(value) => value && setStartTime(value as Time)}
            className="flex-1"
          />
          <TimeInput
            isRequired
            label="End Time"
            labelPlacement="outside"
            variant="bordered"
            value={endTime}
            onChange={(value) => value && setEndTime(value as Time)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Package & Guests */}
      <div className="space-y-4 w-full">
        <Input
          className="mt-4"
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
      <div className="space-y-4 w-full">
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
    </div>
  );
}
