import {
  Select,
  SelectItem,
  Input,
  Chip,
  Button,
  Form,
  TimeInput,
  Textarea,
  DateRangePicker,
} from "@heroui/react";
import { parseAbsoluteToLocal, Time } from "@internationalized/date";
interface EventDuration {
  start: any;
  end: any;
}

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  eventDuration: EventDuration;
  setEventDuration: React.Dispatch<React.SetStateAction<EventDuration>>;
  bookingIsLoading: boolean;
}

export default function BookingDetailsSection({
  handleSubmit,
  eventDuration,
  setEventDuration,
  bookingIsLoading,
}: Props) {
  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 w-full">
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
        <DateRangePicker
          variant="bordered"
          hideTimeZone
          defaultValue={{
            start: parseAbsoluteToLocal(fiveDaysLater.toISOString()),
            end: parseAbsoluteToLocal(fiveDaysLater.toISOString()),
          }}
          label="Event duration"
          className="pt-4"
          isRequired
          onChange={(value) =>
            setEventDuration({ start: value?.start, end: value?.end })
          }
        />
        {/* 

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
        </div> */}
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
    </Form>
  );
}
