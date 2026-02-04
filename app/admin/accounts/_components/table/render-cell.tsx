"use client";

import React from "react";
import {
  User as UserUi,
  Chip,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { statusColorMap } from "./constants";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
  const [isEditing, setIsEditing] = React.useState(false);
  const [role, setRole] = React.useState<RoleType>(
    (user.app_metadata?.roles?.[0] as RoleType) || "guest",
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Modals state
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  const handleSaveRole = async () => {
    setIsSaving(true);
    try {
      const updatedUser: User = {
        ...user,
        app_metadata: {
          ...user.app_metadata,
          roles: [role],
        },
      };
      await dispatch(updateUser(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
  };

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
      return user.email;
    case "role":
      if (isEditing) {
        return (
          <div className="flex gap-2 items-center">
            <Select
              radius="sm"
              size="sm"
              variant="bordered"
              selectedKeys={[role]}
              onSelectionChange={(keys) => {
                const selectedRole = Array.from(keys)[0] as RoleType;
                handleRoleChange(selectedRole);
              }}
              className="w-32"
            >
              <SelectItem key="admin">Admin</SelectItem>
              <SelectItem key="housekeeping">Housekeeping</SelectItem>
              <SelectItem key="guest">Guest</SelectItem>
            </Select>
            <Button
              size="sm"
              variant="flat"
              color="success"
              onPress={handleSaveRole}
              isLoading={isSaving}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => {
                setIsEditing(false);
                setRole((user.app_metadata?.roles?.[0] as RoleType) || "guest");
              }}
            >
              Cancel
            </Button>
          </div>
        );
      }
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color={
            role === "admin"
              ? "primary"
              : role === "housekeeping"
                ? "warning"
                : "default"
          }
          size="sm"
          variant="flat"
        >
          {role}
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
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            color="primary"
            onPress={() => setIsViewOpen(true)}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="flat"
            isIconOnly
            size="sm"
            color={isEditing ? "warning" : "success"}
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
              setIsEditing(false);
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
