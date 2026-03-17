import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { formatPHP } from "@/lib/format-php";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { OccupancyType } from "@/utils/function-room/occupancy";

const occupancyOptions: OccupancyType[] = [
  "available",
  "half occupied",
  "full occupied",
];

const resolveInitialOccupancy = (value?: string): OccupancyType => {
  if (value === "available") return value;
  if (value === "half occupied") return value;
  if (value === "full occupied") return value;
  return "half occupied";
};

export default function MarkConfirmedModal({
  isOpen,
  onClose,
  booking,
  onConfirmed,
}: {
  isOpen: boolean;
  onClose: () => void;
  booking: FunctionHallBooking;
  onConfirmed?: () => Promise<unknown> | void;
}) {
  const { isLoading, fetchBookings, updateBooking } = useFunctionHallBookings();
  const amountPaid = Number(booking.amount_paid || 0);
  const [occupancyType, setOccupancyType] = React.useState<OccupancyType>(
    resolveInitialOccupancy(booking.occupancy_type),
  );
  const [totalAmountInput, setTotalAmountInput] = React.useState<string>(
    String(booking.total_amount ?? 0),
  );

  React.useEffect(() => {
    if (!isOpen) return;
    setOccupancyType(resolveInitialOccupancy(booking.occupancy_type));
    setTotalAmountInput(String(booking.total_amount ?? 0));
  }, [booking.occupancy_type, booking.total_amount, isOpen]);

  const parsedTotalAmount = Number(totalAmountInput);
  const isInvalidTotalAmount =
    totalAmountInput.trim() === "" ||
    Number.isNaN(parsedTotalAmount) ||
    parsedTotalAmount < 0 ||
    parsedTotalAmount < amountPaid;

  const totalAmountErrorMessage =
    parsedTotalAmount < amountPaid
      ? `Total amount must be at least ${formatPHP(amountPaid)}.`
      : "Total amount cannot be empty or negative.";

  const nextBalance = isInvalidTotalAmount
    ? 0
    : Math.max(parsedTotalAmount - amountPaid, 0);

  const canSubmit = !isInvalidTotalAmount;

  const handleConfirm = async () => {
    if (!canSubmit) return;

    await updateBooking({
      id: booking.id,
      status: "confirmed",
      occupancy_type: occupancyType,
      total_amount: parsedTotalAmount,
    } as FunctionHallBooking);

    await fetchBookings({ page: 1 });

    if (onConfirmed) {
      await onConfirmed();
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onClose={onClose}
      size="md"
      radius="none"
      placement="top-center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="bg-primary text-white">
              Mark Booking Confirmed
            </ModalHeader>
            <ModalBody className="pt-4 pb-2 space-y-3">
              <Select
                isRequired
                label="Occupancy Type"
                labelPlacement="outside"
                placeholder="Select occupancy"
                variant="bordered"
                selectedKeys={[occupancyType]}
                onChange={(e) => setOccupancyType(e.target.value as OccupancyType)}
              >
                {occupancyOptions.map((option) => (
                  <SelectItem key={option} textValue={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>

              <Input
                isRequired
                type="number"
                label="Total Price"
                labelPlacement="outside"
                placeholder="0.00"
                variant="bordered"
                startContent="PHP"
                value={totalAmountInput}
                isInvalid={isInvalidTotalAmount}
                errorMessage={totalAmountErrorMessage}
                onChange={(e) => setTotalAmountInput(e.target.value)}
              />

              <div className="text-sm text-default-600 space-y-1">
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span className="font-medium">{formatPHP(amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance</span>
                  <span className="font-medium">{formatPHP(nextBalance)}</span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                isDisabled={!canSubmit}
                onPress={handleConfirm}
              >
                Mark Confirmed
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
