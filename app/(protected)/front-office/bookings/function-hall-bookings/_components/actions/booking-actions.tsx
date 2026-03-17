import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import {
  Eye,
  CheckCircle2,
  CircleCheckBig,
  Clock3,
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
import MarkConfirmedModal from "../modals/mark-confirmed-modal";
import { useFunctionHallBookings } from "@/hooks/use-function-hall-bookings";

export default function BookingActionsDropdown({
  booking,
  disabled,
}: {
  booking: FunctionHallBooking;
  disabled: boolean;
}) {
  const { fetchBookings, updateBooking } = useFunctionHallBookings();
  const [isViewSummaryOpen, setIsViewSummaryOpen] = React.useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = React.useState(false);
  const [setTotalAmountOpen, setSetTotalAmountOpen] = React.useState(false);
  const [markConfirmedOpen, setMarkConfirmedOpen] = React.useState(false);

  const totalAmount = Number(booking.total_amount || 0);
  const amountPaid = Number(booking.amount_paid || 0);
  const balance = Number(
    booking.balance || Math.max(totalAmount - amountPaid, 0),
  );

  const summary = React.useMemo(
    () => ({
      total_amount: totalAmount,
      balance,
      status: booking.payment_status,
      payment_method: booking.payment_method,
      amount_paid: amountPaid,
    }),
    [
      totalAmount,
      balance,
      booking.payment_status,
      booking.payment_method,
      amountPaid,
    ],
  );

  const canShowPaymentActions = totalAmount > 0;
  const canAddPayment =
    canShowPaymentActions &&
    (booking.payment_status || "pending") !== "paid" &&
    booking.status !== "cancelled";

  const updateBookingStatus = async (status: string) => {
    await updateBooking({
      id: booking.id,
      status,
    } as FunctionHallBooking);
    await fetchBookings({});
  };

  return (
    <>
      <SetTotalAmountModal
        isOpen={setTotalAmountOpen}
        onClose={() => setSetTotalAmountOpen(false)}
        bookingId={booking.id}
        currentTotalAmount={totalAmount}
      />
      <MarkConfirmedModal
        isOpen={markConfirmedOpen}
        onClose={() => setMarkConfirmedOpen(false)}
        booking={booking}
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

          {booking.status === "pending" ? (
            <DropdownItem
              key="mark_confirmed"
              startContent={<CheckCircle2 className="w-4 h-4 text-success" />}
              onPress={() => setMarkConfirmedOpen(true)}
            >
              Mark Confirmed
            </DropdownItem>
          ) : null}

          {booking.status === "confirmed" ? (
            <DropdownItem
              key="mark_ongoing"
              startContent={<Clock3 className="w-4 h-4 text-warning" />}
              onPress={() => updateBookingStatus("ongoing")}
            >
              Mark Ongoing
            </DropdownItem>
          ) : null}

          {booking.status === "ongoing" ? (
            <DropdownItem
              key="mark_completed"
              startContent={<CircleCheckBig className="w-4 h-4 text-success" />}
              onPress={() => updateBookingStatus("completed")}
            >
              Mark Complete
            </DropdownItem>
          ) : null}

          <DropdownItem
            key="set_total_amount"
            startContent={
              <CircleDollarSign className="w-4 h-4 text-gray-700" />
            }
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

          {booking.status === "confirmed" ||
          booking.status === "pending" ||
          booking.status === "ongoing" ? (
            <DropdownItem key="cancel" color="danger">
              <MarkCancelled id={booking.id} />
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
