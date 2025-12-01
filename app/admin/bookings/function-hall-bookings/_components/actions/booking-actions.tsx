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
  BrushCleaning,
  MessageSquare,
  EllipsisVertical,
  Wallet,
} from "lucide-react";
import CheckOutButton from "./mark-check-out";
import CheckInButton from "./mark-check-in";
import MarkCancelled from "./mark-cancelled";
import React from "react";
import ExtendModal from "../modals/extend-modal";
import { generateSummary } from "@/utils/generate-summary";
import ViewSummary from "../modals/payment/view-summary-modal";
import AddPaymentModal from "../modals/payment/add-payment-modal";

export default function BookingActionsDropdown({
  booking,
}: {
  booking: Booking;
}) {
  const [extendOpen, setExtendOpen] = React.useState(false);
  const [isViewSummaryOpen, setIsViewSummaryOpen] = React.useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = React.useState(false);

  const summary = React.useMemo(() => {
    return generateSummary(booking, booking.special_requests);
  }, [booking, isViewSummaryOpen]);
  return (
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
        summary={summary}
        id={booking.id}
      />
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light" size="sm">
            <EllipsisVertical className="w-5 h-5 text-gray-600" />
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Booking Actions" variant="faded">
          <DropdownItem
            key="view"
            startContent={<Eye className="w-4 h-4" />}
            href={`/admin/bookings/room-bookings/${booking.id}`}
            color="primary"
          >
            View Details
          </DropdownItem>
          {booking.status === "pending" ? (
            <DropdownItem
              key="edit"
              startContent={<Pencil className="w-4 h-4" />}
              href={`/admin/bookings/room-bookings/edit-booking/${booking.id}`}
            >
              Edit Booking
            </DropdownItem>
          ) : null}

          <DropdownItem
            key="message"
            startContent={<MessageSquare className="w-4 h-4 text-gray-600" />}
          >
            View Messages
          </DropdownItem>

          <DropdownItem isReadOnly key="div">
            <div className="border-t border-gray-200 my-1"></div>
          </DropdownItem>

          {!booking.room_id ? (
            <DropdownItem
              key="assign"
              href={`/admin/bookings/room-bookings/assign-room/${booking.id}`}
              startContent={<Bed className="w-4 h-4" />}
            >
              Assign Room
            </DropdownItem>
          ) : (
            <DropdownItem
              key="assign"
              startContent={<Bed className="w-4 h-4" />}
            >
              Transfer Room
            </DropdownItem>
          )}
          {!["check-in", "pending"].includes(booking.status) ? (
            <DropdownItem key="checkin">
              <CheckInButton booking={booking} />
            </DropdownItem>
          ) : null}

          {booking.status === "check-in" ? (
            <DropdownItem key="checkout">
              <CheckOutButton booking={booking} />
            </DropdownItem>
          ) : null}
          <DropdownItem
            key="extend"
            startContent={<RotateCcw className="w-4 h-4 text-orange-500" />}
            onClick={() => setExtendOpen(true)}
          >
            Extend Stay
          </DropdownItem>

          <DropdownItem isReadOnly key="div2">
            <div className="border-t border-gray-200 my-1"></div>
          </DropdownItem>

          <DropdownItem
            key="invoice"
            startContent={<FileText className="w-4 h-4 text-gray-700" />}
            onClick={() => setIsViewSummaryOpen(true)}
          >
            Download Invoice
          </DropdownItem>
          {booking.payment_status !== "paid" ? (
            <DropdownItem
              key="payment"
              startContent={<Wallet className="w-4 h-4 text-gray-700" />}
              onClick={() => setAddPaymentOpen(true)}
            >
              Add Payment
            </DropdownItem>
          ) : null}
          <DropdownItem
            key="clean"
            startContent={<BrushCleaning className="w-4 h-4 text-purple-600" />}
          >
            Request Cleaning
          </DropdownItem>

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
