import React from "react";
import {
  Button,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Eye } from "lucide-react";
import {
  AuthLog,
  AuthLogFetchParams,
  AuthLogPagination,
} from "@/types/auth-log";
import AuthLogsTableTopContent from "./top-content";
import AuthLogsTableBottomContent from "./bottom-content";

interface AuthLogsTableProps {
  columns: { name: string; uid: string }[];
  logs: AuthLog[];
  pagination: AuthLogPagination;
  isLoading: boolean;
  query: AuthLogFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<AuthLogFetchParams>>;
  onView: (log: AuthLog) => void;
}

export default function AuthLogsTable({
  columns,
  logs,
  pagination,
  isLoading,
  query,
  setQuery,
  onView,
}: AuthLogsTableProps) {
  return (
    <Table
      isHeaderSticky
      classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
      aria-label="Auth Logs Table"
      bottomContent={
        (pagination.total_pages || 0) > 0 ? (
          <AuthLogsTableBottomContent
            pagination={pagination}
            query={query}
            setQuery={setQuery}
          />
        ) : null
      }
      bottomContentPlacement="outside"
      topContent={
        <AuthLogsTableTopContent
          query={query}
          total={pagination.total}
          setQuery={setQuery}
        />
      }
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent="No activity logs found"
        items={logs}
      >
        {(item) => (
          <TableRow
            key={item.id}
            className={
              logs.indexOf(item) % 2 === 0
                ? "bg-white dark:bg-gray-800"
                : "bg-gray-100 dark:bg-gray-900"
            }
          >
            {(columnKey) => (
              <TableCell className="capitalize">
                {columnKey === "event_at" ? (
                  new Date(item.event_at).toLocaleString("en-US")
                ) : columnKey === "event_type" ? (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={item.event_type === "login" ? "success" : "warning"}
                  >
                    {item.event_type}
                  </Chip>
                ) : columnKey === "actions" ? (
                  <Button
                    variant="flat"
                    isIconOnly
                    size="sm"
                    color="primary"
                    aria-label={`View log details for ${item.email ?? item.user_id ?? "this activity"}`}
                    onPress={() => onView(item)}
                  >
                    <Eye size={16} />
                  </Button>
                ) : (
                  (item as Record<string, string | null>)[columnKey as string] ??
                  "Not set"
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
