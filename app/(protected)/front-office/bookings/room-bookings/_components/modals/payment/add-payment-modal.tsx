import { useBookings } from "@/hooks/use-bookings";
import { formatPHP } from "@/lib/format-php";
import { Booking } from "@/types/booking";
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
  addToast,
} from "@heroui/react";
import { Check } from "lucide-react";
import React from "react";
import type { BookingPaymentSummary } from "@/utils/generate-summary";

function resolvePaymentStatus(total: number, amountPaid: number) {
  if (amountPaid >= total && total > 0) return "paid";
  if (amountPaid > 0) return "deposit";
  return "unpaid";
}

function formatStatus(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  paymentDetail,
  setPaymentDetail,
  summary,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  paymentDetail: {
    method: string;
    amountPaid: number;
  };
  setPaymentDetail: React.Dispatch<
    React.SetStateAction<{
      method: string;
      amountPaid: number;
    }>
  >;
  summary: BookingPaymentSummary;
  id: string;
}) {
  const { isLoading, fetchBookings, updateBooking } = useBookings();

  const currentAmountPaid = Number(summary.amountPaid || 0);
  const totalAmount = Number(summary.total || 0);
  const nextAmountPaid =
    currentAmountPaid + Number(paymentDetail.amountPaid || 0);
  const nextBalance = Math.max(totalAmount - nextAmountPaid, 0);
  const nextStatus = resolvePaymentStatus(totalAmount, nextAmountPaid);
  const isInvalidAmount =
    paymentDetail.amountPaid < 0 || nextAmountPaid > totalAmount;
  const canSubmit =
    totalAmount > 0 &&
    paymentDetail.amountPaid > 0 &&
    !isInvalidAmount &&
    Boolean(paymentDetail.method);

  React.useEffect(() => {
    if (!isOpen) return;

    setPaymentDetail({
      method: summary.paymentMethod || "cash",
      amountPaid: 0,
    });
  }, [isOpen, setPaymentDetail, summary.paymentMethod]);

  async function updatePayment() {
    if (!canSubmit) return;

    try {
      await updateBooking({
        id,
        payment_method: paymentDetail.method,
        amount_paid: nextAmountPaid,
        payment_status: nextStatus,
      } as Booking).unwrap();

      addToast({
        title: "Success",
        description: "Payment details updated successfully.",
        color: "success",
      });

      await fetchBookings({});
      onClose();
    } catch (error) {}
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onClose={onClose}
      size="xl"
      radius="none"
      scrollBehavior="outside"
      placement="top-center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-primary text-white w-full">
              Add Payment Details
            </ModalHeader>
            <ModalBody>
              <div className="w-full space-y-4">
                {summary.totalAddOnsPrice > 0 ? (
                  <>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">
                        Special Requests
                      </h3>

                      <div className="space-y-2">
                        {summary.specialRequests.map(
                          (req, index) =>
                            req.quantity > 0 && (
                              <div
                                key={`${req.name}-${index}`}
                                className="w-full px-4 py-2 flex justify-between items-center"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {req.name}
                                  </span>
                                  <span className="text-xs opacity-80">
                                    Price: {formatPHP(Number(req.price))} x{" "}
                                    {req.quantity}
                                  </span>
                                </div>

                                <span className="font-bold">
                                  {formatPHP(Number(req.price) * req.quantity)}
                                </span>
                              </div>
                            ),
                        )}
                      </div>
                    </div>

                    <Divider className="my-2" />
                  </>
                ) : null}

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      Total Add-ons
                    </span>
                    <span className="font-semibold">
                      {formatPHP(summary.totalAddOnsPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      Room Rate
                    </span>
                    <span className="font-semibold">
                      {formatPHP(summary.roomPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      Nights
                    </span>
                    <span className="font-semibold">
                      {summary.nights} x {formatPHP(summary.roomPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Room Total</span>
                    <span className="font-bold">
                      {formatPHP(summary.totalPerNights)}
                    </span>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Grand Total</span>
                  <span>{formatPHP(totalAmount)}</span>
                </div>

                <Divider />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      Current Status
                    </span>
                    <span className="font-semibold">
                      {formatStatus(summary.status)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      Current Paid
                    </span>
                    <span className="font-semibold">
                      {formatPHP(currentAmountPaid)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      Payment Method
                    </span>
                    <div>
                      <Select
                        isRequired
                        radius="none"
                        className="flex-1 w-full min-w-40"
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
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      Add Amount
                    </span>
                    <div className="flex">
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
                            amountPaid: Math.max(
                              totalAmount - currentAmountPaid,
                              0,
                            ),
                          })
                        }
                      >
                        <Check />
                      </Button>
                    </div>
                  </div>

                  <Divider />

                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      New Paid Total
                    </span>
                    <span className="font-semibold">
                      {formatPHP(nextAmountPaid)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-default-700 dark:text-default-400">
                      New Status
                    </span>
                    <span className="font-semibold">
                      {formatStatus(nextStatus)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="font-semibold">New Balance</span>
                    <span className="font-bold">{formatPHP(nextBalance)}</span>
                  </div>
                </div>

                <Divider />

                <div className="flex justify-end w-full mt-2 gap-2">
                  <Button
                    color="default"
                    variant="flat"
                    className="rounded-full px-6"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    className="rounded-full px-6"
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
