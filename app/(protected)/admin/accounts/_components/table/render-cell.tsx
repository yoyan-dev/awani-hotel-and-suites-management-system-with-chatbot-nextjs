"use client";

import React from "react";
import {
  User as UserUi,
  Chip,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { statusColorMap } from "@/app/constants/staff";
import { Eye, Pencil, Shield, Trash2 } from "lucide-react";
import DeleteModal from "../modals/delete-modal";
import EditModal from "../modals/edit-modal";
import ViewModal from "../modals/view-modal";
import { User } from "@/types/users";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateUser, fetchUsers } from "@/features/users/user-thunk";

interface RenderCellProps {
  user: User;
  columnKey: string;
}

type RoleType = "admin" | "housekeeping" | "guest" | "front_office";

const RenderCell: React.FC<RenderCellProps> = ({ user, columnKey }) => {
  const cellValue = user[columnKey as keyof User];
  // Modals state
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  switch (columnKey) {
    case "name":
      return (
        <UserUi
          avatarProps={{ radius: "full", size: "sm", src: "" }}
          classNames={{ description: "text-default-500" }}
          description={user.email}
          name={
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "Unknown User"
          }
        />
      );
    case "email":
      return <div className="lowercase">{user.email}</div>;
    case "role":
      return (
        <Chip
          className="capitalize"
          color={
            user?.app_metadata?.roles?.[0] === "admin"
              ? "primary"
              : user?.app_metadata?.roles?.[0] === "housekeeping"
                ? "warning"
                : "default"
          }
          size="sm"
          variant="flat"
          startContent={<Shield size={14} />}
        >
          {user?.app_metadata?.roles?.[0]}
        </Chip>
      );
    case "shift_type":
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color="default"
          size="sm"
          variant="flat"
        >
          {user.user_metadata?.shift_type || "Not set"}
        </Chip>
      );
    case "phone":
      return user.user_metadata?.phone || "Not set";
    case "status":
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color={statusColorMap["active"]}
          size="sm"
          variant="flat"
        >
          active
        </Chip>
      );
    case "actions":
      return (
        <div className="flex justify-end items-center gap-2">
          {/* <Button
            variant="flat"
            isIconOnly
            size="sm"
            color="primary"
            onPress={() => setIsViewOpen(true)}
          >
            <Eye size={16} />
          </Button> */}
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            color="success"
            onPress={() => setIsEditOpen(true)}
          >
            <Pencil size={16} />
          </Button>
          <DeleteModal
            user={user}
            trigger={
              <Button variant="flat" isIconOnly color="danger" size="sm">
                <Trash2 size={16} />
              </Button>
            }
          />

          {/* Modals */}
          <EditModal
            user={user}
            isOpen={isEditOpen}
            onClose={() => {
              setIsEditOpen(false);
            }}
          />
          <ViewModal
            user={user}
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
          />
        </div>
      );
    default:
      // Convert objects to strings for rendering
      if (typeof cellValue === "object" && cellValue !== null) {
        return <pre>{JSON.stringify(cellValue, null, 2)}</pre>;
      }
      return <>{cellValue}</>;
  }
};

export default RenderCell;
