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
import {
  Edit,
  EllipsisVertical,
  Eye,
  Menu,
  MenuIcon,
  Tags,
  Trash,
  UtensilsIcon,
} from "lucide-react";
import UpdateModal from "../modals/edit-modal";
import DeleteModal from "../modals/delete-modal";
import { formatPHP } from "@/lib/format-php";
import { BanquetPackage } from "@/types/banquet-package";
import { menuCategory, statusColorMap } from "@/app/constants/banquet-package";

interface RenderCellProps {
  items: BanquetPackage[];
  item: BanquetPackage;
  columnKey: string;
}

export const RenderCell: React.FC<RenderCellProps> = ({
  items,
  item,
  columnKey,
}) => {
  const cellValue = item[columnKey as keyof BanquetPackage];
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  switch (columnKey) {
    case "id":
      return items.indexOf(item) + 1;
    case "price":
      return formatPHP(item.price_per_cover);
    case "menus":
      return (
        <div className="flex gap-2">
          <Chip color="default" size="sm">
            <div className="flex items-center gap-1">
              <Tags size={14} className="opacity-70" />
              {item.categories?.length}
            </div>
          </Chip>
          <div className="flex flex-wrap space-x-4 space-y-2 max-w-96 ">
            {item.categories?.map((category, index) => {
              const menu = menuCategory.find((cat) => cat.uid === category);
              return (
                <Chip color="primary" variant="flat" key={index}>
                  <div className="flex gap-2 items-center text-sm">
                    <UtensilsIcon size={10} />{" "}
                    <span>{menu?.name || category}</span>
                  </div>
                </Chip>
              );
            })}
          </div>
        </div>
      );
    case "status":
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color={item.is_active ? "success" : "warning"}
          size="sm"
          variant="dot"
        >
          {item.is_active ? "Active" : "Inactive"}
        </Chip>
      );
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <UpdateModal
            banquetPackage={item}
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
          />
          <DeleteModal
            banquetPackage={item}
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
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
            <Button
              color="success"
              onPress={() => {
                setEditOpen(true);
              }}
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
        </div>
      );

    default:
      return cellValue;
  }
};
