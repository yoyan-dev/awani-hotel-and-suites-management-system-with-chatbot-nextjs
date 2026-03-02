import {
  addToast,
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

const eventTypeLabels: Record<string, string> = {
  wedding: "Wedding",
  birthday: "Birthday",
  corporate: "Corporate Event",
  debut: "Debut",
  others: "Others",
};

function formatDateTimeLabel(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
  const formRef = React.useRef<HTMLFormElement>(null);
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
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [previewData, setPreviewData] = React.useState({
    full_name: "",
    contact_number: "",
    email: "",
    address: "",
    nationality: "",
    gender: "",
    event_type: "",
    number_of_guest: "",
    notes: "",
    event_start: "",
    event_end: "",
  });

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

  const readField = React.useCallback((name: string) => {
    const form = formRef.current;
    if (!form) return "";
    const value = new FormData(form).get(name);
    return typeof value === "string" ? value.trim() : "";
  }, []);

  const capturePreviewData = React.useCallback(() => {
    const eventType = readField("event_type");
    setPreviewData({
      full_name: readField("full_name"),
      contact_number: readField("contact_number"),
      email: readField("email"),
      address: readField("address"),
      nationality: readField("nationality"),
      gender: readField("gender"),
      event_type: eventTypeLabels[eventType] || eventType || "-",
      number_of_guest: readField("number_of_guest"),
      notes: readField("notes"),
      event_start: formatDateTimeLabel(String(eventDuration.start || "")),
      event_end: formatDateTimeLabel(String(eventDuration.end || "")),
    });
  }, [eventDuration.end, eventDuration.start, readField]);

  function validateGuestStep() {
    const requiredFields: { name: string; label: string }[] = [
      { name: "full_name", label: "full name" },
      { name: "contact_number", label: "contact number" },
      { name: "address", label: "home address" },
      { name: "nationality", label: "nationality" },
      { name: "gender", label: "gender" },
      { name: "email", label: "email" },
    ];

    for (const field of requiredFields) {
      if (!readField(field.name)) {
        addToast({
          title: "Missing Information",
          description: `Please provide your ${field.label}.`,
          color: "warning",
        });
        return false;
      }
    }

    if (!isGuestIdVerified) {
      addToast({
        title: "ID Verification Required",
        description:
          "Please upload and verify both front and back ID images to continue.",
        color: "warning",
      });
      return false;
    }

    return true;
  }

  function validateEventStep() {
    const eventType = readField("event_type");
    const numberOfGuest = Number(readField("number_of_guest"));
    const eventStart = String(eventDuration.start || "");
    const eventEnd = String(eventDuration.end || "");

    if (!eventType) {
      addToast({
        title: "Missing Information",
        description: "Please select an event type.",
        color: "warning",
      });
      return false;
    }

    if (!Number.isFinite(numberOfGuest) || numberOfGuest <= 0) {
      addToast({
        title: "Invalid Number of Guests",
        description: "Please enter a valid number of guests.",
        color: "warning",
      });
      return false;
    }

    const parsedStart = new Date(eventStart);
    const parsedEnd = new Date(eventEnd);

    if (
      !eventStart ||
      !eventEnd ||
      Number.isNaN(parsedStart.getTime()) ||
      Number.isNaN(parsedEnd.getTime()) ||
      parsedStart >= parsedEnd
    ) {
      addToast({
        title: "Invalid Event Schedule",
        description: "Please provide a valid start and end event date/time.",
        color: "warning",
      });
      return false;
    }

    return true;
  }

  function handleNext() {
    if (step === 1) {
      if (!validateGuestStep()) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!validateEventStep()) return;
      capturePreviewData();
      setStep(3);
    }
  }

  function handlePrevious() {
    if (step === 2) {
      setStep(1);
      return;
    }
    if (step === 3) {
      setStep(2);
    }
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (step !== 3) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl border border-gray-100 dark:border-gray-700">
      <CardHeader className="text-xl font-semibold">Event Booking</CardHeader>

      <CardBody className="dark:bg-gray-900">
        <Form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6 px-4 w-full">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-3 py-1 font-medium ${
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-default-100 text-default-500"
              }`}
            >
              1. Guest Info
            </span>
            <span
              className={`rounded-full px-3 py-1 font-medium ${
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-default-100 text-default-500"
              }`}
            >
              2. Event Details
            </span>
            <span
              className={`rounded-full px-3 py-1 font-medium ${
                step >= 3
                  ? "bg-primary text-primary-foreground"
                  : "bg-default-100 text-default-500"
              }`}
            >
              3. Preview
            </span>
          </div>

          <div className={step === 1 ? "w-full" : "hidden"}>
            <GuestForm onIdVerificationChange={setIsGuestIdVerified} />
          </div>

          <div className={step === 2 ? "space-y-4 w-full" : "hidden"}>
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

          <div className={step === 3 ? "space-y-4 w-full" : "hidden"}>
            <h1 className="text-lg font-semibold">Preview Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl border border-default-200 p-4 text-sm">
              <div>
                <p className="text-default-500">Full Name</p>
                <p className="font-medium">{previewData.full_name || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Contact Number</p>
                <p className="font-medium">{previewData.contact_number || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Email</p>
                <p className="font-medium">{previewData.email || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Gender</p>
                <p className="font-medium">{previewData.gender || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Nationality</p>
                <p className="font-medium">{previewData.nationality || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Number of Guests</p>
                <p className="font-medium">
                  {previewData.number_of_guest || "-"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-default-500">Address</p>
                <p className="font-medium">{previewData.address || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Event Type</p>
                <p className="font-medium">{previewData.event_type || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Event Start</p>
                <p className="font-medium">{previewData.event_start || "-"}</p>
              </div>
              <div>
                <p className="text-default-500">Event End</p>
                <p className="font-medium">{previewData.event_end || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-default-500">Notes</p>
                <p className="font-medium">{previewData.notes || "-"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <Button
              variant="flat"
              type="button"
              onPress={handlePrevious}
              isDisabled={step === 1}
            >
              Previous
            </Button>

            {step < 3 ? (
              <Button color="primary" type="button" onPress={handleNext}>
                {step === 2 ? "Preview" : "Next"}
              </Button>
            ) : (
              <Button
                color="primary"
                type="submit"
                isLoading={bookingIsLoading}
                isDisabled={!isGuestIdVerified}
              >
                Submit Booking
              </Button>
            )}
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
