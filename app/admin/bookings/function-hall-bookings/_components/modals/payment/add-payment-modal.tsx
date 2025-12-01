import { useBookings } from "@/hooks/use-bookings";
import { formatPHP } from "@/lib/format-php";
import { Booking } from "@/types/booking";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Form,
  Chip,
  Divider,
  Select,
  SelectItem,
  Input,
  addToast,
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
  summary: any;
  id: string;
}) {
  const { isLoading, error, fetchBookings, updateBooking } = useBookings();
  const [paymentDetail, setPaymentDetail] = React.useState<{
    method: string;
    amountPaid: number;
  }>({ method: "pending", amountPaid: 0 });

  async function updatePayment() {
    try {
      await updateBooking({
        id: id,
        payment_method: paymentDetail.method,
        amount_paid: paymentDetail.amountPaid,
        payment_status: summary.status,
      } as Booking);
    } catch (e) {
      addToast({
        title: "Error!",
        description: "Unknown Error, Please Try Again",
        color: "warning",
      });
    } finally {
      if (!error) {
        addToast({
          title: "Error!",
          description: "Unknown Error, Please Try Again",
          color: "warning",
        });
        fetchBookings({});
        onClose();
      }
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose}
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
                <Form onSubmit={updatePayment}>
                  <div className="w-full space-y-4">
                    {/* Add-Ons / Special Requests */}
                    {summary.totalAddOnsPrice > 0 ? (
                      <>
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold">
                            Special Requests
                          </h3>

                          <div className="space-y-2">
                            {summary?.specialRequests.map(
                              (
                                req: {
                                  name: string;
                                  price: string;
                                  quantity: number;
                                },
                                index: number
                              ) =>
                                req.quantity > 0 && (
                                  <div
                                    key={index}
                                    className="w-full px-4 py-2 flex justify-between items-center"
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {req.name}
                                      </span>
                                      <span className="text-xs opacity-80">
                                        Price: {formatPHP(Number(req.price))} ×{" "}
                                        {req.quantity}
                                      </span>
                                    </div>

                                    <span className="font-bold">
                                      {formatPHP(
                                        Number(req.price) * req.quantity
                                      )}
                                    </span>
                                  </div>
                                )
                            )}
                          </div>
                        </div>

                        <Divider className="my-2" />
                      </>
                    ) : null}

                    {/* Summary Section */}
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
                          Room Price
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
                        <span className="font-semibold">Total Per Night</span>
                        <span className="font-bold">
                          {formatPHP(summary.totalPerNights)}
                        </span>
                      </div>
                    </div>

                    <Divider />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Grand Total</span>
                      <span>{formatPHP(summary.total)}</span>
                    </div>
                    <Divider />
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-default-700 dark:text-default-400">
                          Status
                        </span>
                        <span className="font-semibold">
                          {summary.balance >= 0 ? summary.status : "Pending"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-default-700 dark:text-default-400">
                          Payment Method
                        </span>
                        <div>
                          <Select
                            isRequired={paymentDetail.amountPaid > 0}
                            radius="none"
                            className="flex-1 w-full min-w-40"
                            name="payment_method"
                            placeholder="Select payment method"
                            variant="bordered"
                            value={paymentDetail.method}
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
                          Amount Paid
                        </span>
                        <div className="flex">
                          <Input
                            variant="bordered"
                            radius="none"
                            type="number"
                            name="amount_paid"
                            placeholder="00.00"
                            isInvalid={
                              paymentDetail.amountPaid > summary.total ||
                              paymentDetail.amountPaid < 0
                            }
                            errorMessage="Amount must not exceed to the total amount"
                            startContent={"₱"}
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
                                amountPaid: summary.total,
                              })
                            }
                          >
                            <Check />
                          </Button>
                        </div>
                      </div>
                      <Divider />
                      <div className="flex justify-between text-base">
                        <span className="font-semibold">Balance</span>
                        <span className="font-bold">
                          {formatPHP(summary.balance)}
                        </span>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex justify-end w-full mt-2">
                      <Button
                        color="default"
                        variant="flat"
                        className="rounded-full px-6"
                        onPress={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        variant="flat"
                        className="rounded-full px-6"
                        isLoading={isLoading}
                      >
                        Save Payment
                      </Button>
                    </div>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
