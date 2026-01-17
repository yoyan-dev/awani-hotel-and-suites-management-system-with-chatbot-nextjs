import { JSX, useState } from "react";
import {
  Card,
  Badge,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  BedDouble,
  Users,
  CheckCircle,
  Clock,
  Wrench,
  Archive,
  DoorOpen,
  CalendarCheck,
} from "lucide-react";
import type { Room } from "@/types/room";
import { statusOptions } from "@/app/constants/rooms";

interface Props {
  room: Room;
  onUpdateStatus?: (roomId?: string, status?: string, remarks?: string) => void;
}

export default function RoomStatusCard({ room, onUpdateStatus }: Props) {
  const [open, setOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<string>();
  const [remarks, setRemarks] = useState("");

  const STATUS_MAP: Record<
    string,
    { label: string; color: any; icon: JSX.Element }
  > = {
    "stock-room": {
      label: "Stock Room",
      color: "secondary",
      icon: <Archive size={16} />,
    },
    vacant: {
      label: "Vacant",
      color: "success",
      icon: <DoorOpen size={16} />,
    },
    booked: {
      label: "Booked",
      color: "primary",
      icon: <CalendarCheck size={16} />,
    },
    out_of_service: {
      label: "Out of Service",
      color: "danger",
      icon: <Wrench size={16} />,
    },
    occupied: {
      label: "Occupied",
      color: "warning",
      icon: <Users size={16} />,
    },
    maintenance: {
      label: "Maintenance",
      color: "danger",
      icon: <BedDouble size={16} />,
    },
    clean: {
      label: "Clean",
      color: "success",
      icon: <CheckCircle size={16} />,
    },
    dirty: {
      label: "Dirty",
      color: "danger",
      icon: <BedDouble size={16} />,
    },
    "in-progress": {
      label: "In Progress",
      color: "warning",
      icon: <Clock size={16} />,
    },
  };

  const status = room.status ?? "dirty";
  const config = STATUS_MAP[status];

  const openModal = (status: string) => {
    setNextStatus(status);
    setRemarks("");
    setOpen(true);
  };

  const handleSave = () => {
    onUpdateStatus?.(room.id, nextStatus, remarks);
    setOpen(false);
  };

  return (
    <>
      <Card className="rounded-md shadow-sm flex flex-col gap-4 border  border-primary">
        <div className="flex items-center justify-between bg-primary text-white p-4">
          <h3 className="text-lg font-semibold">Room {room.room_number}</h3>

          <Badge color={config.color} className="flex items-center gap-1">
            {config.icon}
            {config.label}
          </Badge>
        </div>

        {room.room_type && (
          <div className="text-sm text-gray-600 px-4">
            <div className="font-medium">{room.room_type.name}</div>
            <div className="flex items-center gap-1 text-xs">
              <Users size={14} />
              Max {room.room_type.max_guest} guests
            </div>
          </div>
        )}

        {room.remarks && (
          <p className="text-xs text-gray-500 italic px-4">“{room.remarks}”</p>
        )}

        <div className="flex gap-2 mt-auto pb-4 px-4">
          <Select
            items={statusOptions}
            defaultSelectedKeys={[status]}
            onChange={() => openModal("clean")}
            radius="sm"
          >
            {(item) => <SelectItem key={item.uid}>{item.name}</SelectItem>}
          </Select>
        </div>
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} size="sm">
        <ModalContent>
          <ModalHeader>Add Remarks</ModalHeader>

          <ModalBody>
            <Textarea
              label="Housekeeping Notes"
              placeholder="e.g. Changed linens, bathroom cleaned"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button size="sm" variant="light" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" color="primary" onPress={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
