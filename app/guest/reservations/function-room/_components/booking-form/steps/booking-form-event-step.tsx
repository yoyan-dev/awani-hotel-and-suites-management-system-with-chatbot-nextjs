import {
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  TimeInput,
} from "@heroui/react";
import { Time } from "@internationalized/date";

const eventTypeOptions = [
  { key: "wedding", label: "Wedding" },
  { key: "birthday", label: "Birthday" },
  { key: "corporate", label: "Corporate Event" },
  { key: "debut", label: "Debut" },
  { key: "others", label: "Others" },
];

const inputClassNames = {
  label: "text-[#6b6153] font-medium",
  input: "!text-[#1f1e1b] placeholder:text-[#8a7f71]",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] text-[#1f1e1b] group-data-[focus=true]:border-[#b08a53]",
  segment: "!text-[#1f1e1b] data-[placeholder=true]:!text-[#8a7f71]",
};

const selectClassNames = {
  label: "text-[#6b6153] font-medium",
  trigger:
    "border-[#dac7af] bg-[#fffaf3] text-[#1f1e1b] group-data-[focus=true]:border-[#b08a53] text-black",
  value: "text-[#1f1e1b] data-[placeholder=true]:text-[#8a7f71]",
  selectorIcon: "text-[#7a6f62]",
};

const datePickerClassNames = {
  base: "text-[#1f1e1b]",
  label: "text-[#6b6153] font-medium",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] text-[#1f1e1b] group-data-[focus=true]:border-[#b08a53]",
  input: "!text-[#1f1e1b]",
  segment: "!text-[#1f1e1b] data-[placeholder=true]:!text-[#8a7f71]",
  selectorIcon: "!text-[#7a6f62]",
  selectorButton: "!text-[#7a6f62]",
};

interface BookingFormEventStepProps {
  minDate: any;
  startDate: any;
  endDate: any;
  startTime: Time;
  endTime: Time;
  onStartDateChange: (value: any) => void;
  onEndDateChange: (value: any) => void;
  onStartTimeChange: (value: Time) => void;
  onEndTimeChange: (value: Time) => void;
}

export default function BookingFormEventStep({
  minDate,
  startDate,
  endDate,
  startTime,
  endTime,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: BookingFormEventStepProps) {
  return (
    <div className="w-full space-y-4">
      <h1 className="font-serif text-2xl text-[#281f14]">Event Details</h1>
      <p className="text-xs text-[#6c6254]">
        Enter your event information, preferred schedule, and expected
        attendees.
      </p>
      <Select
        fullWidth
        isRequired
        label="Event Type"
        name="event_type"
        labelPlacement="outside"
        placeholder="Select event type"
        variant="bordered"
        radius="lg"
        className="pt-2"
        classNames={selectClassNames}
      >
        {eventTypeOptions.map((eventType) => (
          <SelectItem key={eventType.key}>{eventType.label}</SelectItem>
        ))}
      </Select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <DatePicker
          variant="bordered"
          radius="lg"
          minValue={minDate}
          value={startDate}
          label="Start date"
          onChange={(value) => value && onStartDateChange(value)}
          classNames={datePickerClassNames}
        />
        <DatePicker
          variant="bordered"
          radius="lg"
          minValue={startDate}
          value={endDate}
          label="End date"
          onChange={(value) => value && onEndDateChange(value)}
          classNames={datePickerClassNames}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeInput
          isRequired
          label="Start time"
          labelPlacement="outside"
          variant="bordered"
          radius="lg"
          value={startTime}
          onChange={(value) => value && onStartTimeChange(value as Time)}
          classNames={inputClassNames}
        />
        <TimeInput
          isRequired
          label="End time"
          labelPlacement="outside"
          variant="bordered"
          radius="lg"
          value={endTime}
          onChange={(value) => value && onEndTimeChange(value as Time)}
          classNames={inputClassNames}
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
        radius="lg"
        className="pt-4"
        classNames={inputClassNames}
      />
      <Textarea
        name="notes"
        label="Special Requests / Notes"
        labelPlacement="outside"
        placeholder="Stage setup, dietary needs, program flow, etc."
        variant="bordered"
        radius="lg"
        className="pt-4"
        classNames={inputClassNames}
      />
    </div>
  );
}
