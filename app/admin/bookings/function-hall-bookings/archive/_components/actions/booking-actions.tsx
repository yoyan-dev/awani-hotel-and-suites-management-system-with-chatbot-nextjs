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
  CheckCircle,
  LogOut,
  XCircle,
  RotateCcw,
  FileText,
  BrushCleaning,
  MessageSquare,
  EllipsisVertical,
} from "lucide-react";

export default function BookingActionsDropdown({
  booking,
}: {
  booking: Booking;
}) {
  return (
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
          href={`booking/${booking.id}`}
          color="primary"
        >
          View Details
        </DropdownItem>
        <DropdownItem key="edit" startContent={<Pencil className="w-4 h-4" />}>
          Edit Booking
        </DropdownItem>

        <DropdownItem
          key="message"
          startContent={<MessageSquare className="w-4 h-4 text-gray-600" />}
        >
          View Messages
        </DropdownItem>

        <DropdownItem isReadOnly key="div">
          <div className="border-t border-gray-200 my-1"></div>
        </DropdownItem>

        <DropdownItem key="assign" startContent={<Bed className="w-4 h-4" />}>
          Assign Room
        </DropdownItem>
        <DropdownItem
          key="checkin"
          startContent={<CheckCircle className="w-4 h-4 text-green-600" />}
        >
          Check-In
        </DropdownItem>
        <DropdownItem
          key="checkout"
          startContent={<LogOut className="w-4 h-4 text-blue-600" />}
        >
          Check-Out
        </DropdownItem>
        <DropdownItem
          key="extend"
          startContent={<RotateCcw className="w-4 h-4 text-orange-500" />}
        >
          Extend Stay
        </DropdownItem>

        <DropdownItem isReadOnly key="div2">
          <div className="border-t border-gray-200 my-1"></div>
        </DropdownItem>

        <DropdownItem
          key="invoice"
          startContent={<FileText className="w-4 h-4 text-gray-700" />}
        >
          Download Invoice
        </DropdownItem>
        <DropdownItem
          key="clean"
          startContent={<BrushCleaning className="w-4 h-4 text-purple-600" />}
        >
          Request Cleaning
        </DropdownItem>

        <DropdownItem isReadOnly key="div3">
          <div className="border-t border-gray-200 my-1"></div>
        </DropdownItem>

        <DropdownItem
          key="cancel"
          color="danger"
          startContent={<XCircle className="w-4 h-4 text-red-600" />}
        >
          Cancel Booking
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
