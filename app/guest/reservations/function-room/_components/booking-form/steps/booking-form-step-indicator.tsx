import { BookingFormStep } from "../types/booking-form.types";

const bookingSteps: { id: BookingFormStep; label: string }[] = [
  { id: 1, label: "Guest Info" },
  { id: 2, label: "Event Details" },
  { id: 3, label: "Preview" },
];

interface BookingFormStepIndicatorProps {
  step: BookingFormStep;
}

export default function BookingFormStepIndicator({
  step,
}: BookingFormStepIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {bookingSteps.map((bookingStep) => (
        <span
          key={bookingStep.id}
          className={`rounded-full px-3 py-1 font-medium ${
            step >= bookingStep.id
              ? "bg-primary text-primary-foreground"
              : "bg-default-100 text-default-500"
          }`}
        >
          {bookingStep.id}. {bookingStep.label}
        </span>
      ))}
    </div>
  );
}
