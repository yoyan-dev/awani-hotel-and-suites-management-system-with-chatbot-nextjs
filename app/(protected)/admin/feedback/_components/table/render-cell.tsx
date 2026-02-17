import React from "react";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Chip,
} from "@heroui/react";
import { Edit, EllipsisVertical, Eye, Trash } from "lucide-react";
import ViewFeedbackModal from "../modals/view-feedback-modal";
import DeleteFeedbackModal from "../modals/delete-feedback-modal";

interface Props {
  items: any[];
  item: any;
  columnKey: string;
}

export const RenderCell: React.FC<Props> = ({ items, item, columnKey }) => {
  const cellValue = item[columnKey];
  const [viewOpen, setViewOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  switch (columnKey) {
    case "id":
      return (
        <span className="text-default-500 text-sm font-medium">
          {items.indexOf(item) + 1}
        </span>
      );

    case "rating":
      return (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={
                index < Number(item.rating)
                  ? "text-yellow-500 text-base"
                  : "text-gray-300 text-base"
              }
            >
              ★
            </span>
          ))}
        </div>
      );

    case "comments":
      return (
        <p className="max-w-xs truncate text-gray-600">
          {item.comments || "—"}
        </p>
      );

    case "recommend":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={item.recommend === "yes" ? "success" : "danger"}
          className="capitalize"
        >
          {item.recommend}
        </Chip>
      );

    case "actions":
      return (
        <>
          <ViewFeedbackModal
            feedback={item}
            isOpen={viewOpen}
            onClose={() => setViewOpen(false)}
          />
          <DeleteFeedbackModal
            feedback={item}
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
          <div className="flex justify-end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  radius="full"
                  className="text-default-500 hover:bg-default-100"
                >
                  <EllipsisVertical size={18} />
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Actions">
                <DropdownItem
                  key="view"
                  startContent={<Eye size={16} />}
                  onClick={() => setViewOpen(true)}
                >
                  View Details
                </DropdownItem>

                {/* <DropdownItem
                  key="edit"
                  color="success"
                  className="text-success"
                  startContent={<Edit size={16} />}
                  onClick={() => setEditOpen(true)}
                >
                  Edit
                </DropdownItem> */}

                <DropdownItem
                  key="delete"
                  color="danger"
                  className="text-danger"
                  startContent={<Trash size={16} />}
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </>
      );

    default:
      return <span className="text-sm text-gray-700">{cellValue || "—"}</span>;
  }
};
