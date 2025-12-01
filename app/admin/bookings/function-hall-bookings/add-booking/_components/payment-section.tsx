import { formatPHP } from "@/lib/format-php";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Check } from "lucide-react";
import React from "react";

export default function PaymentSection({
  paymentDetail,
  setPaymentDetail,
  summary,
}: {
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
  summary: any;
}) {
  return (
    <div className="space-y-4 w-full">
      <h1 className="w-full bg-primary px-2 py-1 text-white">
        Payment Details
      </h1>
      <div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Grand Total</span>
          <span>{formatPHP(summary.total)}</span>
        </div>
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
                  setPaymentDetail({ ...paymentDetail, method: e.target.value })
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

          <div className="flex justify-between text-base">
            <span className="font-semibold">Balance</span>
            <span className="font-bold">{formatPHP(summary.balance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
