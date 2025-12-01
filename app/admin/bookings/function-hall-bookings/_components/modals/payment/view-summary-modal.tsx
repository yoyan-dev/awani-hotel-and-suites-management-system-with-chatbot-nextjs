import { formatPHP } from "@/lib/format-php";
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
} from "@heroui/react";
import React from "react";
export default function ViewSummary({
  isOpen,
  onClose,
  summary,
}: {
  isOpen: boolean;
  onClose: () => void;
  summary: any;
}) {
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
                Summary
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
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

                  {/* Grand Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Grand Total</span>
                    <span>
                      {formatPHP(
                        summary.totalAddOnsPrice + summary.totalPerNights
                      )}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-default-700 dark:text-default-400">
                        Status
                      </span>
                      <span className="font-semibold">
                        {summary.balance > 0 ? summary.status : "Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-default-700 dark:text-default-400">
                        Payment Method
                      </span>
                      <span className="font-semibold">
                        {summary.paymentMethod || "Pending"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-default-700 dark:text-default-400">
                        Amount Paid
                      </span>
                      <span className="font-semibold">
                        {formatPHP(summary.ammountPaid)}
                      </span>
                    </div>

                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Balance</span>
                      <span className="font-bold">
                        {formatPHP(summary.balance > 0 ? summary.balance : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-end w-full">
                <Button
                  color="default"
                  variant="flat"
                  className="rounded-full px-6"
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
