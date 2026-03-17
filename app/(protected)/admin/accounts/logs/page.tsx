"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Input,
} from "@heroui/react";
import { Eye, Search } from "lucide-react";

type AuthLog = {
  id: string;
  user_id: string | null;
  email: string | null;
  role: string | null;
  event_type: "login" | "logout";
  event_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
  device_name?: string | null;
};

type ApiResponse = {
  success: boolean;
  data?: {
    items: AuthLog[];
    total: number;
    page: number;
    limit: number;
  };
};

const columns = [
  { name: "Time", uid: "event_at" },
  { name: "Email", uid: "email" },
  { name: "Role", uid: "role" },
  { name: "Event", uid: "event_type" },
  { name: "Device", uid: "device_name" },
  { name: "User ID", uid: "user_id" },
  { name: "Actions", uid: "actions" },
];

export default function AuthLogsPage() {
  const [logs, setLogs] = React.useState<AuthLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [selectedLog, setSelectedLog] = React.useState<AuthLog | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const limit = 20;

  const pages = Math.max(Math.ceil(total / limit), 1);

  React.useEffect(() => {
    let isMounted = true;

    async function loadLogs() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (query.trim()) {
          params.set("q", query.trim());
        }
        const res = await fetch(`/api/auth-logs?${params.toString()}`);
        const json = (await res.json()) as ApiResponse;
        if (!isMounted) return;
        if (json.success && json.data) {
          setLogs(json.data.items);
          setTotal(json.data.total);
        } else {
          setLogs([]);
          setTotal(0);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load auth logs:", error);
        setLogs([]);
        setTotal(0);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLogs();
    return () => {
      isMounted = false;
    };
  }, [page, query]);

  return (
    <div className="p-2 bg-white dark:bg-gray-900 rounded space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Login Activity Logs</h1>
        <p className="text-gray-600">
          Monitor user logins and logouts across the system.
        </p>
      </div>
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search email, role, device, or user id..."
          size="sm"
          startContent={<Search className="text-default-300" />}
          value={query}
          variant="bordered"
          onClear={() => {
            setQuery("");
            setPage(1);
          }}
          onValueChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
      </div>
      <Table
        isHeaderSticky
        classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
        aria-label="Auth Logs Table"
        bottomContent={
          <div className="flex justify-between items-center w-full py-2">
            <span className="text-default-600 text-small">
              Total {total} events
            </span>
            <Pagination
              page={page}
              total={pages}
              onChange={setPage}
              size="sm"
            />
          </div>
        }
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent="No activity logs found"
          items={logs}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="capitalize">
                  {columnKey === "event_at"
                    ? new Date(item.event_at).toLocaleString("en-US")
                    : columnKey === "event_type"
                      ? (
                          <Chip
                            size="sm"
                            variant="flat"
                            color={
                              item.event_type === "login"
                                ? "success"
                                : "warning"
                            }
                          >
                            {item.event_type}
                          </Chip>
                        )
                      : columnKey === "actions"
                        ? (
                            <Button
                              variant="flat"
                              isIconOnly
                              size="sm"
                              color="primary"
                              onPress={() => {
                                setSelectedLog(item);
                                setIsViewOpen(true);
                              }}
                            >
                              <Eye size={16} />
                            </Button>
                          )
                      : (item as Record<string, string | null>)[
                          columnKey as string
                        ] ?? "Not set"}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isViewOpen}
        placement="top-center"
        onOpenChange={(open) => !open && setIsViewOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Log Details
              </ModalHeader>
              <ModalBody>
                {selectedLog ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-default-500">Event</span>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          selectedLog.event_type === "login"
                            ? "success"
                            : "warning"
                        }
                      >
                        {selectedLog.event_type}
                      </Chip>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-500">Time</span>
                      <span>
                        {new Date(selectedLog.event_at).toLocaleString("en-US")}
                      </span>
                    </div>
                    <Divider />
                    <div className="flex justify-between">
                      <span className="text-default-500">Email</span>
                      <span>{selectedLog.email ?? "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-500">Role</span>
                      <span className="capitalize">
                        {selectedLog.role ?? "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-500">User ID</span>
                      <span className="font-mono break-all">
                        {selectedLog.user_id ?? "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-default-500">Device</span>
                      <span>{selectedLog.device_name ?? "Not set"}</span>
                    </div>
                    <Divider />
                    <div className="flex justify-between gap-4">
                      <span className="text-default-500">IP Address</span>
                      <span className="text-right">
                        {selectedLog.ip_address ?? "Not set"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-default-500">User Agent</span>
                      <span className="text-xs break-all">
                        {selectedLog.user_agent ?? "Not set"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-default-500">No log selected.</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  color="primary"
                  onPress={() => {
                    onClose();
                    setIsViewOpen(false);
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
