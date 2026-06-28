import { addToast, Card, CardBody, CardHeader, Form } from "@heroui/react";
import React from "react";
import GuestForm from "./guest-form";
import {
  today as todayDate,
  getLocalTimeZone,
  Time,
  parseDate,
} from "@internationalized/date";
import { parseISODateOnly } from "@/utils/function-room/event-duration-date";
import BookingFormStepIndicator from "./booking-form/steps/booking-form-step-indicator";
import BookingFormEventStep from "./booking-form/steps/booking-form-event-step";
import BookingFormPreviewStep from "./booking-form/steps/booking-form-preview-step";
import BookingFormActions from "./booking-form/controls/booking-form-actions";
import {
  BookingFormStep,
  BookingPreviewData,
} from "./booking-form/types/booking-form.types";

const eventTypeLabels: Record<string, string> = {
  wedding: "Wedding",
  birthday: "Birthday",
  corporate: "Corporate Event",
  debut: "Debut",
  others: "Others",
};

const requiredGuestFields: { name: string; label: string }[] = [
  { name: "full_name", label: "full name" },
  { name: "contact_number", label: "contact number" },
  { name: "address", label: "home address" },
  { name: "nationality", label: "nationality" },
  { name: "gender", label: "gender" },
  { name: "email", label: "email" },
];

const initialPreviewData: BookingPreviewData = {
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
};

function createGuestVerificationId() {
  return crypto.randomUUID();
}

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
  const [guestId] = React.useState(createGuestVerificationId);
  const formRef = React.useRef<HTMLFormElement>(null);
  const minDate = React.useMemo(
    () => todayDate(getLocalTimeZone()).add({ days: 5 }),
    [],
  );
  const [startDate, setStartDate] = React.useState<any>(null);
  const [endDate, setEndDate] = React.useState<any>(null);
  const [startTime, setStartTime] = React.useState<Time | null>(null);
  const [endTime, setEndTime] = React.useState<Time | null>(null);
  const hasUserEditedScheduleRef = React.useRef(false);
  const skipSubmitRef = React.useRef(false);
  const [isGuestIdVerified, setIsGuestIdVerified] = React.useState(false);
  const [step, setStep] = React.useState<BookingFormStep>(1);
  const [previewData, setPreviewData] =
    React.useState<BookingPreviewData>(initialPreviewData);

  React.useEffect(() => {
    if (hasUserEditedScheduleRef.current) return;
    if (!eventDuration.start || !eventDuration.end) return;

    const startParsed = new Date(String(eventDuration.start));
    const endParsed = new Date(String(eventDuration.end));

    if (!Number.isNaN(startParsed.getTime())) {
      const startDateOnly = parseISODateOnly(eventDuration.start);
      if (startDateOnly) {
        const nextStartDate = parseDate(startDateOnly);
        if (!startDate || nextStartDate.toString() !== startDate.toString()) {
          setStartDate(nextStartDate);
        }
      }
      if (
        !startTime ||
        startParsed.getHours() !== startTime.hour ||
        startParsed.getMinutes() !== startTime.minute
      ) {
        setStartTime(
          new Time(startParsed.getHours(), startParsed.getMinutes()),
        );
      }
    }

    if (!Number.isNaN(endParsed.getTime())) {
      const endDateOnly = parseISODateOnly(eventDuration.end);
      if (endDateOnly) {
        const nextEndDate = parseDate(endDateOnly);
        if (!endDate || nextEndDate.toString() !== endDate.toString()) {
          setEndDate(nextEndDate);
        }
      }
      if (
        !endTime ||
        endParsed.getHours() !== endTime.hour ||
        endParsed.getMinutes() !== endTime.minute
      ) {
        setEndTime(new Time(endParsed.getHours(), endParsed.getMinutes()));
      }
    }
  }, [
    eventDuration.end,
    eventDuration.start,
    endDate,
    endTime?.hour,
    endTime?.minute,
    startDate,
    startTime?.hour,
    startTime?.minute,
  ]);

  React.useEffect(() => {
    if (startDate && endDate && endDate.compare(startDate) < 0) {
      setEndDate(startDate);
    }
  }, [endDate, startDate]);

  React.useEffect(() => {
    const startDatePart = startDate?.toString();
    const endDatePart = endDate?.toString();
    if (!startDatePart || !endDatePart || !startTime || !endTime) {
      setEventDuration((prev) =>
        prev.start || prev.end ? { start: "", end: "" } : prev,
      );
      return;
    }

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
    endTime?.hour,
    endTime?.minute,
    setEventDuration,
    startDate,
    startTime?.hour,
    startTime?.minute,
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
    for (const field of requiredGuestFields) {
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
      skipSubmitRef.current = true;
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
    if (skipSubmitRef.current) {
      skipSubmitRef.current = false;
      e.preventDefault();
      return;
    }
    if (step !== 3) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  }

  return (
    <Card className="mx-auto w-full max-w-4xl rounded-3xl border border-[#e7dccd] bg-[#fffefb] shadow-[0_26px_56px_-44px_rgba(35,29,22,0.52)]">
      <CardHeader className="border-b border-[#eadfce] bg-[#fcf7ef] px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#987345]">
            Booking Flow
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#241f1a] sm:text-3xl">
            Event Booking Details
          </h2>
        </div>
      </CardHeader>

      <CardBody className="p-4 sm:p-6">
        <Form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="w-full space-y-6"
        >
          <input type="hidden" name="id" value={guestId} />

          <BookingFormStepIndicator step={step} />

          <div className={step === 1 ? "w-full" : "hidden"}>
            <GuestForm
              guestId={guestId}
              onIdVerificationChange={setIsGuestIdVerified}
            />
          </div>

          <div className={step === 2 ? "w-full" : "hidden"}>
            <BookingFormEventStep
              minDate={minDate}
              startDate={startDate}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              onStartDateChange={(value) => {
                hasUserEditedScheduleRef.current = true;
                setStartDate(value);
              }}
              onEndDateChange={(value) => {
                hasUserEditedScheduleRef.current = true;
                setEndDate(value);
              }}
              onStartTimeChange={(value) => {
                hasUserEditedScheduleRef.current = true;
                setStartTime(value);
              }}
              onEndTimeChange={(value) => {
                hasUserEditedScheduleRef.current = true;
                setEndTime(value);
              }}
            />
          </div>

          <div className={step === 3 ? "w-full" : "hidden"}>
            <BookingFormPreviewStep previewData={previewData} />
          </div>

          <BookingFormActions
            step={step}
            bookingIsLoading={bookingIsLoading}
            isGuestIdVerified={isGuestIdVerified}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </Form>
      </CardBody>
    </Card>
  );
}
