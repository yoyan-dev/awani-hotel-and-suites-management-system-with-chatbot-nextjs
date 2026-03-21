"use client";

import React from "react";
import {
  User as UserUi,
  Chip,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Pagination,
  Divider,
} from "@heroui/react";
import { statusColorMap } from "@/app/constants/staff";
import { Eye, ListChecks, Pencil, Shield, Trash2 } from "lucide-react";
import DeleteModal from "../modals/delete-modal";
import EditModal from "../modals/edit-modal";
import ViewModal from "../modals/view-modal";
import { User } from "@/types/users";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateUser, fetchUsers } from "@/features/users/user-thunk";

type AuthLog = {
  id: string;
  user_id: string | null;
  email: string | null;
  role: string | null;
  event_type: "login" | "logout";
  event_at: string;
  device_name?: string | null;
};

type AuthLogResponse = {
  success?: boolean;
  data?: AuthLog[];
  pagination?: {
    total?: number;
  };
};

interface RenderCellProps {
  user: User;
  columnKey: string;
}

type RoleType = "admin" | "housekeeping" | "front_office";

const RenderCell: React.FC<RenderCellProps> = ({ user, columnKey }) => {
  const cellValue = user[columnKey as keyof User];
  // Modals state
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isLogsOpen, setIsLogsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<AuthLog[]>([]);
  const [logsPage, setLogsPage] = React.useState(1);
  const [logsTotal, setLogsTotal] = React.useState(0);
  const [isLogsLoading, setIsLogsLoading] = React.useState(false);
  const logsLimit = 10;

  React.useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      if (!isLogsOpen) return;
      setIsLogsLoading(true);
      try {
        const res = await fetch(
          `/api/auth-logs?userId=${user.id}&page=${logsPage}&limit=${logsLimit}`,
        );
        const json = (await res.json()) as AuthLogResponse;
        if (!isMounted) return;
        if (json?.success) {
          setLogs(json.data ?? []);
          setLogsTotal(json.pagination?.total ?? 0);
        } else {
          setLogs([]);
          setLogsTotal(0);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load user logs:", error);
        setLogs([]);
        setLogsTotal(0);
      } finally {
        if (isMounted) setIsLogsLoading(false);
      }
    }

    loadLogs();
    return () => {
      isMounted = false;
    };
  }, [isLogsOpen, logsPage, user.id]);

  switch (columnKey) {
    case "name":
      return (
        <UserUi
          avatarProps={{
            radius: "full",
            size: "sm",
            src: user.user_metadata.image,
          }}
          classNames={{ description: "text-default-500" }}
          description={user.email}
          name={user.user_metadata?.full_name || "Unknown User"}
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
                : user?.app_metadata?.roles?.[0] === "front_office"
                  ? "success"
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
      return user.app_metadata?.roles?.[0] !== "admin" ? (
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
            color="primary"
            onPress={() => {
              setLogsPage(1);
              setIsLogsOpen(true);
            }}
          >
            <ListChecks size={16} />
          </Button>
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
          <Modal
            isOpen={isLogsOpen}
            placement="top-center"
            size="2xl"
            onOpenChange={(open) => !open && setIsLogsOpen(false)}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    User Login Logs
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-default-500">User</span>
                        <span className="font-medium">
                          {user.user_metadata?.full_name || user.email}
                        </span>
                      </div>
                      <Divider />
                      {isLogsLoading ? (
                        <div className="py-6 flex justify-center">
                          <Spinner label="Loading logs..." />
                        </div>
                      ) : logs.length ? (
                        <div className="space-y-3">
                          {logs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center justify-between rounded border border-default-200 px-3 py-2"
                            >
                              <div>
                                <div className="font-medium capitalize">
                                  {log.event_type}
                                </div>
                                <div className="text-xs text-default-500">
                                  {new Date(log.event_at).toLocaleString(
                                    "en-US",
                                  )}
                                </div>
                                <div className="text-xs text-default-400">
                                  {log.device_name ?? "Unknown Device"}
                                </div>
                              </div>
                              <div className="text-right text-xs text-default-500">
                                {log.email ?? "Not set"}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-default-500">
                          No activity logs found.
                        </div>
                      )}
                    </div>
                  </ModalBody>
                  <ModalFooter className="flex justify-between items-center w-full">
                    <span className="text-default-500 text-xs">
                      Total {logsTotal} events
                    </span>
                    <div className="flex items-center gap-3">
                      <Pagination
                        page={logsPage}
                        total={Math.max(Math.ceil(logsTotal / logsLimit), 1)}
                        onChange={setLogsPage}
                        size="sm"
                      />
                      <Button
                        variant="bordered"
                        color="primary"
                        onPress={() => {
                          onClose();
                          setIsLogsOpen(false);
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      ) : null;
    default:
      // Convert objects to strings for rendering
      if (typeof cellValue === "object" && cellValue !== null) {
        return <pre>{JSON.stringify(cellValue, null, 2)}</pre>;
      }
      return <>{cellValue}</>;
  }
};

export default RenderCell;

