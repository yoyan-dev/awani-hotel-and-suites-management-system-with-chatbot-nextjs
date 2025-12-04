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
  EllipsisVertical,
  Eye,
} from "lucide-react";
import { Booking } from "@/types/booking";
import { formatPHP } from "@/lib/format-php";
import { calculateBookingPrice, getNights } from "@/utils/pricing";
import { Room } from "@/types/room";
import AssignRoomModal from "../modals/assign-room-modal";

interface RenderCellProps {
  booking: Booking;
  columnKey: string;
  onAssign: (payload: Booking) => void;
  bookingLoading: boolean;
}

export const RenderCell = ({
  booking,
  columnKey,
  onAssign,
  bookingLoading,
}: RenderCellProps) => {
  const cellValue = booking[columnKey as keyof Booking];
  const nights = getNights(booking.check_in, booking.check_out);
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);

  switch (columnKey) {
    case "room":
      return booking.room?.room_number || "No yet assigned";
    case "guest_name":
      return booking.user?.full_name || "undefined";
    case "room_type":
      return booking.room_type?.name;
    case "nights":
      return nights;
    case "check_in":
      return (
        <div className="flex gap-2">
          <Chip
            startContent={<CalendarArrowDown size={18} />}
            color="success"
            variant="flat"
          >
            {booking.check_in}
          </Chip>
          -
          <Chip
            startContent={<CalendarArrowUp size={18} />}
            color="warning"
            variant="flat"
          >
            {booking.check_out}
          </Chip>
        </div>
      );
    case "total_price":
      return formatPHP(
        calculateBookingPrice(booking) + Number(booking.total_add_ons || 0)
      );
    case "status":
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${bookingStatusColorMap[booking.status]}`}
        >
          {booking.status}
        </span>
      );
    // case "actions":
    //   return (
    //     <div className="relative flex justify-end items-center gap-2">
    //       <AssignRoomModal
    //         isOpen={assignModalOpen}
    //         onClose={() => setAssignModalOpen(false)}
    //         onAssign={onAssign}
    //         booking={booking}
    //         bookingLoading={bookingLoading}
    //       />
    //       <Dropdown className="bg-background border-1 border-default-200">
    //         <DropdownTrigger>
    //           <Button isIconOnly radius="full" size="sm" variant="light">
    //             <EllipsisVertical className="text-default-400" />
    //           </Button>
    //         </DropdownTrigger>
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
    //           <DropdownItem
    //             key="assign"
    //             onPress={() => setAssignModalOpen(true)}
    //             className="text-blue-600"
    //           >
    //             <div className="flex items-center gap-2">
    //               <Bed size={15} /> Assign Room
    //             </div>
    //           </DropdownItem>
    //           <DropdownItem key="edit">Edit</DropdownItem>
    //           <DropdownItem key="delete">Delete</DropdownItem>
    //         </DropdownMenu>
    //       </Dropdown>
    //     </div>
    //   );
    default:
      return cellValue;
  }
};
