import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";
import { formatPHP } from "@/lib/format-php";
import { FunctionHallBooking } from "@/types/function-room-booking";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Divider,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { Check } from "lucide-react";
import React from "react";

export default function AddPaymentModal({
  isOpen,
  onClose,
  summary,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  summary: {
    total_amount?: number;
    amount_paid?: number;
    balance?: number;
    payment_status?: string;
  };
  id: string;
}) {
  const { isLoading, fetchBookings, updateBooking } = useFunctionHallBookings();

  const totalAmount = Number(summary.total_amount || 0);
  const currentAmountPaid = Number(summary.amount_paid || 0);
  const currentBalance = Number(summary.balance || totalAmount - currentAmountPaid);

  const [paymentDetail, setPaymentDetail] = React.useState<{
    method: string;
    amountPaid: number;
  }>({ method: "cash", amountPaid: 0 });

  const nextAmountPaid = currentAmountPaid + paymentDetail.amountPaid;
  const nextBalance = Math.max(totalAmount - nextAmountPaid, 0);
  const isInvalidAmount =
    paymentDetail.amountPaid < 0 || nextAmountPaid > totalAmount;
  const canSubmit =
    totalAmount > 0 && paymentDetail.amountPaid > 0 && !isInvalidAmount;

  async function updatePayment() {
    if (!canSubmit) return;

    await updateBooking({
      id,
      payment_method: paymentDetail.method,
      amount_paid: nextAmountPaid,
    } as FunctionHallBooking);

    await fetchBookings({ page: 1 });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onClose={onClose}
      size="lg"
      radius="none"
      scrollBehavior="outside"
      placement="top-center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-primary text-white w-full">
              Add Payment
            </ModalHeader>
            <ModalBody>
              <div className="w-full space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-default-500">Total Amount</span>
                    <span className="font-semibold">{formatPHP(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-500">Current Paid</span>
                    <span className="font-semibold">{formatPHP(currentAmountPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-500">Current Balance</span>
                    <span className="font-semibold">{formatPHP(currentBalance)}</span>
                  </div>
                </div>

                <Divider />

                <Select
                  isRequired
                  radius="none"
                  className="w-full"
                  name="payment_method"
                  placeholder="Select payment method"
                  variant="bordered"
                  selectedKeys={[paymentDetail.method]}
                  onChange={(e) =>
                    setPaymentDetail({
                      ...paymentDetail,
                      method: e.target.value,
                    })
                  }
                >
                  <SelectItem key="cash">Cash</SelectItem>
                  <SelectItem key="gcash">Gcash</SelectItem>
                  <SelectItem key="card">Card</SelectItem>
                  <SelectItem key="bank_transfer">Bank Transfer</SelectItem>
                </Select>

                <div className="flex gap-0">
                  <Input
                    variant="bordered"
                    radius="none"
                    type="number"
                    name="amount_paid"
                    placeholder="00.00"
                    isInvalid={isInvalidAmount}
                    errorMessage="Amount must be greater than 0 and must not exceed remaining balance."
                    startContent="PHP"
                    value={paymentDetail.amountPaid.toString()}
                    onChange={(e) =>
                      setPaymentDetail({
                        ...paymentDetail,
                        amountPaid: Number(e.target.value),
                      })
                    }
                  />
                  <Button
                    color="success"
                    isIconOnly
                    radius="none"
                    onPress={() =>
                      setPaymentDetail({
                        ...paymentDetail,
                        amountPaid: Math.max(totalAmount - currentAmountPaid, 0),
                      })
                    }
                  >
                    <Check />
                  </Button>
                </div>

                <Divider />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-default-500">New Paid Total</span>
                    <span className="font-semibold">{formatPHP(nextAmountPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-default-500">New Balance</span>
                    <span className="font-semibold">{formatPHP(nextBalance)}</span>
                  </div>
                </div>

                <div className="flex justify-end w-full mt-2 gap-2">
                  <Button color="default" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    isLoading={isLoading}
                    isDisabled={!canSubmit}
                    onPress={updatePayment}
                  >
                    Save Payment
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
