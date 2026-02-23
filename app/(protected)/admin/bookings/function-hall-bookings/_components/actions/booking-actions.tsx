import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import {
  Eye,
  Bed,
  EllipsisVertical,
  Wallet,
  FileText,
  CircleDollarSign,
} from "lucide-react";
import MarkCancelled from "./mark-cancelled";
import React from "react";
import ViewSummary from "../modals/payment/view-summary-modal";
import AddPaymentModal from "../modals/payment/add-payment-modal";
import { FunctionHallBooking } from "@/types/function-room-booking";
import SetTotalAmountModal from "../modals/payment/set-total-amount-modal";

export default function BookingActionsDropdown({
  booking,
  disabled,
}: {
  booking: FunctionHallBooking;
  disabled: boolean;
}) {
  const [isViewSummaryOpen, setIsViewSummaryOpen] = React.useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = React.useState(false);
  const [setTotalAmountOpen, setSetTotalAmountOpen] = React.useState(false);

  const totalAmount = Number(booking.total_amount || 0);
  const amountPaid = Number(booking.amount_paid || 0);
  const balance = Number(booking.balance || Math.max(totalAmount - amountPaid, 0));

  const summary = React.useMemo(
    () => ({
      total_amount: totalAmount,
      balance,
      status: booking.payment_status,
      payment_method: booking.payment_method,
      amount_paid: amountPaid,
    }),
    [totalAmount, balance, booking.payment_status, booking.payment_method, amountPaid],
  );

  const canShowPaymentActions = totalAmount > 0;
  const canAddPayment =
    canShowPaymentActions &&
    (booking.payment_status || "pending") !== "paid" &&
    booking.status !== "cancelled";

  return (
    <>
      <SetTotalAmountModal
        isOpen={setTotalAmountOpen}
        onClose={() => setSetTotalAmountOpen(false)}
        bookingId={booking.id}
        currentTotalAmount={totalAmount}
      />
      <ViewSummary
        isOpen={isViewSummaryOpen}
        onClose={() => setIsViewSummaryOpen(false)}
        summary={summary}
      />
      <AddPaymentModal
        isOpen={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        summary={summary}
        id={booking.id}
      />

      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light" size="sm" isDisabled={disabled}>
            <EllipsisVertical className="w-5 h-5 text-gray-600" />
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Booking Actions" variant="faded">
          <DropdownItem
            key="view"
            startContent={<Eye className="w-4 h-4" />}
            href={`/admin/bookings/function-hall-bookings/${booking.id}`}
            color="primary"
          >
            View Details
          </DropdownItem>

          <DropdownItem
            key="assign"
            href={`/admin/bookings/function-hall-bookings/assign-room/${booking.id}`}
            startContent={<Bed className="w-4 h-4" />}
          >
            Assign Room
          </DropdownItem>

          <DropdownItem
            key="set_total_amount"
            startContent={<CircleDollarSign className="w-4 h-4 text-gray-700" />}
            onPress={() => setSetTotalAmountOpen(true)}
          >
            Set Total Amount
          </DropdownItem>

          {canShowPaymentActions ? (
            <DropdownItem
              key="summary"
              startContent={<FileText className="w-4 h-4 text-gray-700" />}
              onPress={() => setIsViewSummaryOpen(true)}
            >
              Summary
            </DropdownItem>
          ) : null}

          {canAddPayment ? (
            <DropdownItem
              key="payment"
              startContent={<Wallet className="w-4 h-4 text-gray-700" />}
              onPress={() => setAddPaymentOpen(true)}
            >
              Add Payment
            </DropdownItem>
          ) : null}

          <DropdownItem isReadOnly key="div3">
            <div className="border-t border-gray-200 my-1"></div>
          </DropdownItem>

          {booking.status === "confirmed" || booking.status === "pending" ? (
            <DropdownItem key="cancel" color="danger">
              <MarkCancelled id={booking.id} />
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
