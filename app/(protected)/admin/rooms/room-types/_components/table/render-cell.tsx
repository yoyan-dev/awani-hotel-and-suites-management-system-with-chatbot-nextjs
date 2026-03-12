import React from "react";
import {
  User,
  Chip,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Image,
} from "@heroui/react";
import { Edit, EllipsisVertical, Eye, Trash } from "lucide-react";
import UpdateModal from "../modals/edit-modal";
import DeleteModal from "../modals/delete-modal";
import { RoomType } from "@/types/room";
import { formatPHP } from "@/lib/format-php";
import ViewAddOns from "../popover/view-add-ons";
import ViewModal from "../modals/view-modal";

interface RenderCellProps {
  room_type: RoomType;
  columnKey: string;
}

export const RenderCell: React.FC<RenderCellProps> = ({
  room_type,
  columnKey,
}) => {
  const cellValue = room_type[columnKey as keyof RoomType];
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  switch (columnKey) {
    case "images": {
      const images =
        room_type.images && room_type.images.length > 0
          ? room_type.images
          : room_type.image
            ? [room_type.image]
            : [];
      if (images.length === 0) {
        return "no image";
      }
      return (
        <div className="relative w-28">
          <Image src={images[0]} width={160} className="rounded-md" />
          {images.length > 1 ? (
            <span className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white">
              +{images.length - 1}
            </span>
          ) : null}
        </div>
      );
    }
    case "room_type_add_ons":
      return room_type.room_type_add_ons &&
        room_type.room_type_add_ons.length > 0 ? (
        <ViewAddOns addOns={room_type.room_type_add_ons ?? []} />
      ) : (
        "no add ons"
      );
    case "price":
      return formatPHP(Number(room_type.price));
    case "peak_season_price":
      return formatPHP(Number(room_type.peak_season_price));
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <ViewModal
            room={room_type}
            isOpen={viewOpen}
            onClose={() => setViewOpen(false)}
          />
          <UpdateModal
            room={room_type}
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
          />
          <DeleteModal
            room={room_type}
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
          <Dropdown className="bg-background border-1 border-default-200 ">
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                <EllipsisVertical />
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
                <div className="flex gap-2 items-center">
                  <Eye size={15} />
                  View
                </div>
              </DropdownItem>
              <DropdownItem
                key="edit"
                color="success"
                className="text-success"
                onClick={() => {
                  setEditOpen(true);
                }}
              >
                <div className="flex gap-2 items-center">
                  <Edit size={15} />
                  Edit
                </div>
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
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
      );
    default:
      return Array.isArray(cellValue) ? cellValue.length : (cellValue as any);
  }
};
