import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { FunctionHallBooking } from "@/types/function-room-booking";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
} from "@heroui/react";
import React from "react";

export default function SetTotalAmountModal({
  isOpen,
  onClose,
  bookingId,
  currentTotalAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  currentTotalAmount?: number;
}) {
  const { isLoading, fetchBookings, updateBooking } = useFunctionHallBookings();
  const [totalAmount, setTotalAmount] = React.useState<number>(
    Number(currentTotalAmount || 0),
  );

  React.useEffect(() => {
    if (!isOpen) return;
    setTotalAmount(Number(currentTotalAmount || 0));
  }, [isOpen, currentTotalAmount]);

  const isInvalid = Number.isNaN(totalAmount) || totalAmount < 0;

  const handleSave = async () => {
    if (isInvalid) return;

    await updateBooking({
      id: bookingId,
      total_amount: totalAmount,
    } as FunctionHallBooking);

    await fetchBookings({ page: 1 });
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
            <ModalHeader className="flex flex-col gap-1 bg-primary text-white w-full">
              Set Total Amount
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  type="number"
                  label="Total Amount"
                  labelPlacement="outside"
                  placeholder="0.00"
                  variant="bordered"
                  startContent="PHP"
                  value={totalAmount.toString()}
                  isInvalid={isInvalid}
                  errorMessage="Total amount cannot be negative."
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                />

                <div className="flex justify-end gap-2 pb-4">
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    isLoading={isLoading}
                    isDisabled={isInvalid}
                    onPress={handleSave}
                  >
                    Save Amount
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
