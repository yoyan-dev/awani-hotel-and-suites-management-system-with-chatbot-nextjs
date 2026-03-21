import { formatPHP } from "@/lib/format-php";
import { Card, CardBody, Chip } from "@heroui/react";

interface BookingPaymentCardProps {
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentMethod?: string;
  paymentStatus: string;
}

export default function BookingPaymentCard({
  totalAmount,
  amountPaid,
  balance,
  paymentMethod,
  paymentStatus,
}: BookingPaymentCardProps) {
  return (
    <Card radius="sm" className="border border-gray-200 shadow-none">
      <CardBody className="space-y-3">
        <p className="text-xs text-gray-500">Payment Summary</p>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-medium">{formatPHP(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-medium">{formatPHP(amountPaid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Balance</span>
            <span className="font-medium">{formatPHP(balance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium">{paymentMethod || "Not set"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Status</span>
            <Chip size="sm" variant="flat" className="uppercase">
              {paymentStatus}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
