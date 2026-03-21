import React from "react";
import {
  User,
  Chip,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from "@heroui/react";
import type { Inventory } from "@/types/inventory";
import { statusColorMap } from "./constants";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import UpdateModal from "../modals/edit-modal";
import DeleteModal from "../modals/delete-modal";
import { formatPHP } from "@/lib/format-php";

interface RenderCellProps {
  inventory: Inventory;
  columnKey: string;
}

export const RenderCell: React.FC<RenderCellProps> = ({
  inventory,
  columnKey,
}) => {
  const cellValue = inventory[columnKey as keyof Inventory];
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  switch (columnKey) {
    case "price":
      return inventory.price ? formatPHP(inventory.price) : "free";
    case "status":
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color={
            statusColorMap[inventory.status as keyof typeof statusColorMap] ||
            "default"
          }
          size="sm"
          variant="dot"
        >
          {inventory.status}
        </Chip>
      );
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <UpdateModal
            inventory={inventory}
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
          />
          <DeleteModal
            inventory={inventory}
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
          <Dropdown className="bg-background border-1 border-default-200 z-10">
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                <EllipsisVertical className="text-default-400" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="view">View</DropdownItem>
              <DropdownItem
                key="edit"
                className="text-success"
                color="success"
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
      );
    default:
      return cellValue;
  }
};
