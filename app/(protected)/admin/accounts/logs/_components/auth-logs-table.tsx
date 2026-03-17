import {
  Button,
  Chip,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Eye } from "lucide-react";
import { AuthLog } from "@/types/auth-log";

interface AuthLogsTableProps {
  columns: { name: string; uid: string }[];
  logs: AuthLog[];
  isLoading: boolean;
  total: number;
  page: number;
  setPage: (page: number) => void;
  pages: number;
  onView: (log: AuthLog) => void;
}

export default function AuthLogsTable({
  columns,
  logs,
  isLoading,
  total,
  page,
  setPage,
  pages,
  onView,
}: AuthLogsTableProps) {
  return (
    <Table
      isHeaderSticky
      classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
      aria-label="Auth Logs Table"
      bottomContent={
        <div className="flex w-full items-center justify-between py-2">
          <span className="text-default-600 text-small">Total {total} events</span>
          <Pagination page={page} total={pages} onChange={setPage} size="sm" />
        </div>
      }
      bottomContentPlacement="outside"
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
          <TableRow key={item.id}>
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
