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
import { FunctionHallBooking } from "@/types/function-room-booking";
import { BanquetPackage } from "@/types/banquet";

export default function BookingActionsDropdown({
  booking,
  disabled,
}: {
  booking: FunctionHallBooking;
  disabled: boolean;
}) {
  const [extendOpen, setExtendOpen] = React.useState(false);
  const [isViewSummaryOpen, setIsViewSummaryOpen] = React.useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = React.useState(false);

  const summary = React.useMemo(() => {
    return {
      banquet_package: booking.banquet_package as BanquetPackage,
      number_of_guest: booking.number_of_guest,
      total_amount: booking.total_amount,
      balance: booking.balance,
      status: booking.payment_status,
      payment_method: booking.payment_method,
      amount_paid: booking.amount_paid,
    } as {
      banquet_package: BanquetPackage;
      package_price: number;
      number_of_guest: number;
      total_amount: number;
      balance: number;
      status: string;
      payment_method: string;
      amount_paid: any;
    };
  }, [booking, isViewSummaryOpen]);
  return (
    <>
      {/* <ExtendModal
        booking={booking}
        isOpen={extendOpen}
        onClose={() => setExtendOpen(false)}
      /> */}
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
            href={`/admin/bookings/function-hall-bookings/${booking.id}`}
            color="primary"
          >
            View Details
          </DropdownItem>
          {/* {booking.status === "pending" ? (
            <DropdownItem
              key="edit"
              startContent={<Pencil className="w-4 h-4" />}
              href={`/admin/bookings/function-hall-bookings/edit-booking/${booking.id}`}
            >
              Edit Booking
            </DropdownItem>
          ) : null} */}

          {/* <DropdownItem
            key="message"
            startContent={<MessageSquare className="w-4 h-4 text-gray-600" />}
          >
            View Messages
          </DropdownItem> */}
          <DropdownItem
            key="assign"
            href={`/admin/bookings/function-hall-bookings/assign-room/${booking.id}`}
            startContent={<Bed className="w-4 h-4" />}
          >
            Assign Room
          </DropdownItem>

          {/* {!["check-in", "pending"].includes(booking.status || "default") ? (
            <DropdownItem key="checkin">
              <CheckInButton booking={booking} />
            </DropdownItem>
          ) : null} */}

          {/* {booking.status === "check-in" ? (
            <DropdownItem key="checkout">
              <CheckOutButton booking={booking} />
            </DropdownItem>
          ) : null} */}
          <DropdownItem
            key="summary"
            startContent={<FileText className="w-4 h-4 text-gray-700" />}
            onClick={() => setIsViewSummaryOpen(true)}
          >
            Summary
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
