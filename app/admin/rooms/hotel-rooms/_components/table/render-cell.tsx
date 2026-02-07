import {
  Image,
  Chip,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Select,
  SelectItem,
  Link,
} from "@heroui/react";
import type { Room } from "@/types/room";
import { statusColorMap } from "@/app/constants/rooms";
import { Edit, EllipsisVertical, Eye, Trash } from "lucide-react";
import RoomDetails from "../modals/view-modal";
import DeleteModal from "../modals/delete-modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateRoom } from "@/features/room/room-thunk";
import React from "react";

interface RenderCellProps {
  room: Room;
  columnKey: string;
}

export const RenderCell: React.FC<RenderCellProps> = ({ room, columnKey }) => {
  const cellValue = room[columnKey as keyof Room];
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.room);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  function handleStatusChange(e: any) {
    dispatch(updateRoom({ ...room, status: e.target.value }));
  }

  switch (columnKey) {
    case "room_type":
      return <Chip>{room.room_type?.name}</Chip>;
    case "status":
      return (
        <div>
          <Chip
            size="sm"
            color={
              statusColorMap[room.status as keyof typeof statusColorMap] ||
              "default"
            }
          >
            {room.status}
          </Chip>
          {/* <Select
            isLoading={isLoading}
            size="sm"
            defaultSelectedKeys={[room.status || ""]}
            value={room.status}
            onChange={handleStatusChange}
            color={
              statusColorMap[room.status as keyof typeof statusColorMap] ||
              "default"
            }
          >
            <SelectItem key="available">Available</SelectItem>
            <SelectItem key="cleaning">Cleaning</SelectItem>
            <SelectItem key="reserved">Reserved</SelectItem>
            <SelectItem key="occupied">Occupied</SelectItem>
            <SelectItem key="maintenance">Maintenance</SelectItem>
          </Select> */}
        </div>
      );
    case "actions":
      return (
        <>
          <DeleteModal
            room={room}
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
          <RoomDetails
            room={room}
            isOpen={viewOpen}
            onClose={() => setViewOpen(false)}
          />

          <div className="relative flex justify-end items-center gap-2 md:hidden">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <EllipsisVertical className="text-default-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="view"
                  color="primary"
                  className="text-primary"
                  onClick={() => {
                    setViewOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Eye size={15} /> View
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  as={Link}
                  href={`hotel-rooms/update-room/${room.id}`}
                  color="success"
                  className="text-success"
                >
                  <div className="flex items-center gap-2" color="success">
                    <Edit size={15} /> Edit
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => {
                    setDeleteOpen(true);
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <Trash size={15} />
                    Delete
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex gap-2">
            <Button
              color="default"
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => {
                setViewOpen(true);
              }}
            >
              <Eye size={15} />
            </Button>
            <Button
              as={Link}
              href={`hotel-rooms/update-room/${room.id}`}
              color="success"
              isIconOnly
              variant="light"
              size="sm"
            >
              <Edit size={15} />
            </Button>
            <Button
              color="danger"
              onPress={() => {
                setDeleteOpen(true);
              }}
              isIconOnly
              variant="light"
              size="sm"
            >
              <Trash size={15} />
            </Button>
          </div>
        </>
      );
    default:
      return cellValue;
  }
};
