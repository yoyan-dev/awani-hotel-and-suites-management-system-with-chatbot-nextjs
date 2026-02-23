import { formatPHP } from "@/lib/format-php";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
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
  summary: {
    total_amount?: number;
    balance?: number;
    status?: string;
    payment_method?: string;
    amount_paid?: number;
  };
}) {
  const totalAmount = Number(summary.total_amount || 0);
  const amountPaid = Number(summary.amount_paid || 0);
  const balance = Number(summary.balance || Math.max(totalAmount - amountPaid, 0));

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
              Payment Summary
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-default-600">Payment Status</span>
                  <span className="font-semibold uppercase">
                    {summary.status || "pending"}
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between text-sm">
                  <span className="text-default-600">Total Amount</span>
                  <span className="font-semibold">{formatPHP(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-600">Amount Paid</span>
                  <span className="font-semibold">{formatPHP(amountPaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-600">Balance</span>
                  <span className="font-semibold">{formatPHP(balance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-600">Payment Method</span>
                  <span className="font-semibold">
                    {summary.payment_method || "Not set"}
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-end w-full">
              <Button color="default" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
