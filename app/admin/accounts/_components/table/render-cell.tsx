import React from "react";
import {
  User as UserUi,
  Chip,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  MenuItem,
  Select,
  SelectItem,
} from "@heroui/react";
import { statusColorMap } from "./constants";
import { EllipsisVertical, Eye, SquarePen, SquareX, Trash } from "lucide-react";
import DeleteModal from "../modals/delete-modal";
import EditModal from "../modals/edit-modal";
import { Staff } from "@/types/staff";
import { User } from "@/types/users";

interface RenderCellProps {
  user: User;
  columnKey: string;
}

const RenderCell: React.FC<RenderCellProps> = ({ user, columnKey }) => {
  const cellValue = user[columnKey as keyof User];
  const [isEditing, setIsEditing] = React.useState(false);
  const [role, setRole] = React.useState(
    user.app_metadata.roles?.[0] || "Guest",
  );

  const handleSaveRole = () => {
    setIsEditing(false);
    // TODO: call API to save the updated role
    console.log("Saved role:", role);
  };

  switch (columnKey) {
    case "name":
      return (
        <UserUi
          avatarProps={{ radius: "full", size: "sm", src: "" }}
          classNames={{ description: "text-default-500" }}
          description={user.email}
          name={
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            "Unknown User"
          }
        />
      );
    case "email":
      return user.email;
    case "role":
      <div className="flex gap-2 items-center">
        <Select
          radius="sm"
          label="System Role"
          name="role"
          variant="bordered"
          defaultSelectedKeys={[role]}
        >
          {["admin", "housekeeping"].map((role) => (
            <SelectItem className="capitalize" key={role}>
              {role}
            </SelectItem>
          ))}
        </Select>
        <Button
          size="sm"
          variant="flat"
          color="success"
          onPress={handleSaveRole}
        >
          Save
        </Button>
      </div>;
    case "status":
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color={statusColorMap["default"]}
          size="sm"
          variant="flat"
        >
          active
        </Chip>
      );
    case "actions":
      return (
        <>
          {/* <DeleteModal user={user} />
          <div className="flex justify-end items-center gap-2">
            <Button
              variant="flat"
              isIconOnly
              size="sm"
              color={isEditing ? "warning" : "success"}
              onPress={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <SquareX size={16} /> : <SquarePen size={16} />}
            </Button>
            <Button variant="flat" isIconOnly color="danger" size="sm">
              <Trash size={16} />
            </Button>
          </div> */}
        </>
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
