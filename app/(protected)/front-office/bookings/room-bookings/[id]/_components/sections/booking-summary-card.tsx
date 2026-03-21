"use client";

import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import { formatPHP } from "@/lib/format-php";
import { Booking } from "@/types/booking";
import { calculateBookingPrice, getNights } from "@/utils/pricing";

interface BookingSummaryCardProps {
  booking: Booking;
  totalAmount: number;
}

export default function BookingSummaryCard({
  booking,
  totalAmount,
}: BookingSummaryCardProps) {
  const baseTotal = calculateBookingPrice(booking);

  return (
    <Card radius="none">
      <CardHeader>
        <h3 className="font-semibold">Summary ({booking.payment_status})</h3>
      </CardHeader>
      <CardBody className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Payment Method</span>
          <span className="text-gray-500">
            {booking.payment_method ? booking.payment_method : "Not set"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">
            Total in {getNights(booking.checked_in, booking.checked_out)} nights
          </span>
          <strong>{formatPHP(baseTotal)}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Add-ons</span>
          <strong>{formatPHP(Number(booking.total_add_ons))}</strong>
        </div>
        <Divider />
        <div className="flex justify-between items-center">
          <span className="text-sm">Total</span>
          <div className="text-lg font-bold text-green-600">
            {formatPHP(totalAmount)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Amount Paid</span>
          <div className="text-lg font-bold text-green-600">
            {formatPHP(Number(booking.amount_paid) || 0)}
          </div>
        </div>
      </CardBody>
      <CardFooter className="p-4">
        <div className="text-xs text-gray-500">Payment handled on arrival.</div>
      </CardFooter>
    </Card>
  );
}
