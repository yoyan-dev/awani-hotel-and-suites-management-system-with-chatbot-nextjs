import { Button } from "@heroui/react";
import { BookingFormStep } from "../types/booking-form.types";

interface BookingFormActionsProps {
  step: BookingFormStep;
  bookingIsLoading: boolean;
  isGuestIdVerified: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function BookingFormActions({
  step,
  bookingIsLoading,
  isGuestIdVerified,
  onPrevious,
  onNext,
}: BookingFormActionsProps) {
  return (
    <div className="flex justify-between w-full">
      <Button
        variant="flat"
        type="button"
        onPress={onPrevious}
        isDisabled={step === 1}
      >
        Previous
      </Button>

      {step < 3 ? (
        <Button color="primary" type="button" onPress={onNext}>
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
  );
}
