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
        className="rounded-full bg-[#f2e8d9] text-[#5e5447]"
      >
        Previous
      </Button>

      {step < 3 ? (
        <Button
          type="button"
          onPress={onNext}
          className="rounded-full bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
        >
          {step === 2 ? "Preview" : "Next"}
        </Button>
      ) : (
        <Button
          type="submit"
          isLoading={bookingIsLoading}
          isDisabled={!isGuestIdVerified}
          className="rounded-full bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
        >
          Submit Booking
        </Button>
      )}
    </div>
  );
}
