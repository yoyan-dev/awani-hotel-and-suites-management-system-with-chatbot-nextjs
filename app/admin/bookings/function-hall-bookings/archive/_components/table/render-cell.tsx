import React from "react";
import {
  User,
  Chip,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Link,
} from "@heroui/react";
import { bookingStatusColorMap } from "@/app/constants/booking";
import {
  Bed,
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  CircleCheckBig,
  EllipsisVertical,
  Eye,
  LogIn,
  XCircle,
  FileText,
} from "lucide-react";
import { Booking } from "@/types/booking";
import { formatPHP } from "@/lib/format-php";
import { calculateBookingPrice, getNights } from "@/utils/pricing";
import { Room } from "@/types/room";
import CheckInButton from "../actions/mark-check-in";
import CheckOutButton from "../actions/mark-check-out";
import MarkCancelled from "@/app/housekeeping/guests/_components/actions/mark-cancelled";
import BookingActionsDropdown from "../actions/booking-actions";

interface RenderCellProps {
  booking: Booking;
  columnKey: string;
  onAssign: (booking: Booking, room: Room) => void;
  bookingLoading: boolean;
}

export const RenderCell = ({ booking, columnKey }: RenderCellProps) => {
  const cellValue = booking[columnKey as keyof Booking];
  const nights = getNights(booking.check_in, booking.check_out);

  switch (columnKey) {
    case "room":
      return booking.room?.room_number || "N/A";
    case "guest_name":
      return (
        <div className="flex flex-col w-48">
          <p className="text-bold text-small capitalize">
            {booking.user?.full_name || "undefined"}
          </p>
          <p className="text-bold text-tiny capitalize text-default-600 dark:text-default-300 flex ">
            {booking.check_in} to {booking.check_out}
          </p>
        </div>
      );

    case "room_type":
      return <Chip>{booking.room_type?.name}</Chip>;
    case "nights":
      return nights;

    case "total_price":
      return formatPHP(
        calculateBookingPrice(booking) + Number(booking.total_add_ons || 0)
      );
    case "status":
      return (
        <Chip
          size="sm"
          className={`px-2 rounded-full  font-medium ${bookingStatusColorMap[booking.status]}`}
        >
          {booking.status}
        </Chip>
      );
    case "actions":
      return (
        <BookingActionsDropdown booking={booking} />
        // <div className="flex gap-2">
        //   {booking.status === "pending" ? (
        //     <MarkCancelled id={booking.id} />
        //   ) : null}
        //   <div className="relative flex justify-end items-center gap-2">
        //     {booking.status === "confirmed" ? (
        //       <CheckInButton booking={booking} />
        //     ) : booking.status === "check-in" ? (
        //       <CheckOutButton booking={booking} />
        //     ) : null}
        //     <Dropdown className="bg-background border-1 border-default-200">
        //       <DropdownTrigger>
        //         <Button isIconOnly radius="full" size="sm" variant="light">
        //           <EllipsisVertical className="text-default-400" />
        //         </Button>
        //       </DropdownTrigger>
        //       {booking.status !== "cancelled" ? (
        //         <DropdownMenu>
        //           <DropdownItem
        //             key="view"
        //             as={Link}
        //             href={`booking/${booking.id}`}
        //             color="primary"
        //           >
        //             <div className="flex items-center gap-2">
        //               <Eye size={15} /> View
        //             </div>
        //           </DropdownItem>
        //           <DropdownItem key="edit">Edit</DropdownItem>
        //           <DropdownItem key="delete">Delete</DropdownItem>
        //         </DropdownMenu>
        //       ) : (
        //         <DropdownMenu>
        //           <DropdownItem key="delete">Delete</DropdownItem>
        //         </DropdownMenu>
        //       )}
        //     </Dropdown>
        //   </div>
        // </div>
      );
    default:
      return cellValue;
  }
};
