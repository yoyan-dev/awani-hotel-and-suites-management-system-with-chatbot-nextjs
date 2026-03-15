"use client";

import React from "react";
import { Booking } from "@/types/booking";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import {
  Eye,
  Pencil,
  Bed,
  RotateCcw,
  FileText,
  EllipsisVertical,
  Wallet,
  Undo2,
} from "lucide-react";

import { canBookingAction } from "@/utils/booking/can-booking-action";

import CheckOutButton from "./mark-check-out";
import CheckInButton from "./mark-check-in";
import MarkCancelled from "./mark-cancelled";
import ExtendModal from "../modals/extend-modal";
import ViewSummary from "../modals/payment/view-summary-modal";
import AddPaymentModal from "../modals/payment/add-payment-modal";
import UndoCheckInModal from "../modals/undo-check-in-modal";
import { generateSummary } from "@/utils/generate-summary";

export default function BookingActionsDropdown({
  booking,
}: {
  booking: Booking;
}) {
  const [extendOpen, setExtendOpen] = React.useState(false);
  const [isViewSummaryOpen, setIsViewSummaryOpen] = React.useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = React.useState(false);
  const [undoCheckInOpen, setUndoCheckInOpen] = React.useState(false);

  const [paymentDetail, setPaymentDetail] = React.useState({
    method: "pending",
    amountPaid: 0,
  });

  const summary = React.useMemo(() => {
    return generateSummary(
      {
        ...booking,
        payment_method: paymentDetail.method,
        amount_paid: paymentDetail.amountPaid,
      },
      booking.special_requests,
    );
  }, [booking, paymentDetail]);

  return booking.status !== "checked_out" ||
    booking.payment_status !== "paid" ? (
    <>
      <ExtendModal
        booking={booking}
        isOpen={extendOpen}
        onClose={() => setExtendOpen(false)}
      />

      <ViewSummary
        isOpen={isViewSummaryOpen}
        onClose={() => setIsViewSummaryOpen(false)}
        summary={summary}
      />

      <AddPaymentModal
        isOpen={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        paymentDetail={paymentDetail}
        setPaymentDetail={setPaymentDetail}
        summary={summary}
        id={booking.id}
      />

      <UndoCheckInModal
        isOpen={undoCheckInOpen}
        onClose={() => setUndoCheckInOpen(false)}
        booking={booking}
      />

      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light" size="sm">
            <EllipsisVertical className="w-5 h-5 text-gray-600" />
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Booking Actions" variant="faded">
          {canBookingAction(booking.status, "view") ? (
            <DropdownItem
              key="view"
              startContent={<Eye className="w-4 h-4" />}
              href={`/admin/bookings/room-bookings/${booking.id}`}
            >
              View Details
            </DropdownItem>
          ) : null}

          {canBookingAction(booking.status, "edit") ? (
            <DropdownItem
              key="edit"
              startContent={<Pencil className="w-4 h-4" />}
              href={`/admin/bookings/room-bookings/edit-booking/${booking.id}`}
            >
              Edit Booking
            </DropdownItem>
          ) : null}

          {canBookingAction(booking.status, "assign") ? (
            !booking.room_id ? (
              <DropdownItem
                key="assign"
                href={`/admin/bookings/room-bookings/assign-room/${booking.id}`}
                startContent={<Bed className="w-4 h-4" />}
              >
                Assign Room
              </DropdownItem>
            ) : (
              <DropdownItem
                key="transfer"
                startContent={<Bed className="w-4 h-4" />}
              >
                Transfer Room
              </DropdownItem>
            )
          ) : null}

          {canBookingAction(booking.status, "checked_in") ? (
            <DropdownItem key="checkin">
              <CheckInButton booking={booking} />
            </DropdownItem>
          ) : null}

          {canBookingAction(booking.status, "checked_out") ? (
            <DropdownItem key="checkout">
              <CheckOutButton booking={booking} />
            </DropdownItem>
          ) : null}

          {canBookingAction(booking.status, "undo_check_in") ? (
            <DropdownItem
              key="undo_check_in"
              startContent={<Undo2 className="w-4 h-4 text-warning" />}
              onPress={() => setUndoCheckInOpen(true)}
            >
              Undo check-in
            </DropdownItem>
          ) : null}

          {canBookingAction(booking.status, "extend") ? (
            <DropdownItem
              key="extend"
              startContent={<RotateCcw className="w-4 h-4 text-orange-500" />}
              onClick={() => setExtendOpen(true)}
            >
              Extend Stay
            </DropdownItem>
          ) : null}

          {/* <DropdownItem key="div2" isReadOnly>
            <div className="border-t my-1" />
          </DropdownItem> */}

          {canBookingAction(booking.status, "summary") ? (
            <DropdownItem
              key="summary"
              startContent={<FileText className="w-4 h-4" />}
              onClick={() => setIsViewSummaryOpen(true)}
            >
              Summary
            </DropdownItem>
          ) : null}

          {canBookingAction(booking.status, "add_payment") ? (
            <DropdownItem
              key="payment"
              startContent={<Wallet className="w-4 h-4" />}
              onClick={() => setAddPaymentOpen(true)}
            >
              Add Payment
            </DropdownItem>
          ) : null}

          {/* <DropdownItem key="div3" isReadOnly>
            <div className="border-t my-1" />
          </DropdownItem> */}

          {canBookingAction(booking.status, "cancel") ? (
            <DropdownItem key="cancel" color="danger">
              <MarkCancelled booking={booking} />
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>
    </>
  ) : null;
}
