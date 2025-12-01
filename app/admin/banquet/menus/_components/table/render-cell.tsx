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
import { Edit, EllipsisVertical, Eye, Trash } from "lucide-react";
import React from "react";
import { BanquetMenu } from "@/types/banquet";
import DeleteModal from "../modals/delete-modal";

interface RenderCellProps {
  menu: BanquetMenu;
  columnKey: string;
}

export const RenderCell: React.FC<RenderCellProps> = ({ menu, columnKey }) => {
  const cellValue = menu[columnKey as keyof BanquetMenu];
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  switch (columnKey) {
    case "actions":
      return (
        <>
          <DeleteModal
            menu={menu}
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
          {/* <ViewModal
            menu={menu}
            isOpen={viewOpen}
            onClose={() => setViewOpen(false)}
          /> */}

          <div className="relative flex justify-end items-center gap-2 md:hidden">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <EllipsisVertical className="text-default-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {/* <DropdownItem
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
                </DropdownItem> */}
                <DropdownItem
                  key="edit"
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
            <Button color="success" isIconOnly variant="light" size="sm">
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
