import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Selection,
} from "@heroui/react";
import { RenderCell } from "./render-cell";
import { TableTopContent } from "./top-content";
import { TableBottomContent } from "./bottom-content";
import { ColumnType } from "@/types/column";
import {
  FeedbackFetchParams,
  FeedbackPagination,
  FeedbackPayload,
} from "@/types/feedback";

interface FeedbackTableProps {
  guestFeedbacks: FeedbackPayload[];
  pagination: FeedbackPagination | null;
  query: FeedbackFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<FeedbackFetchParams>>;
  selectedKeys: any;
  setSelectedKeys: React.Dispatch<React.SetStateAction<any>>;
  visibleColumns: any;
  setVisibleColumns: React.Dispatch<React.SetStateAction<any>>;
  headerColumns: ColumnType[];
  isLoading: boolean;
}

export default function FeedbackTable({
  guestFeedbacks,
  pagination,
  query,
  setQuery,
  selectedKeys,
  setSelectedKeys,
  visibleColumns,
  setVisibleColumns,
  headerColumns,
  isLoading,
}: FeedbackTableProps) {
  return (
    <Table
      isHeaderSticky
      classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
      aria-label="Rooms Table"
      bottomContent={
        (pagination?.total_pages || 0) > 0 && (
          <TableBottomContent
            query={query}
            setQuery={setQuery}
            pages={pagination?.total_pages || 0}
            totalItems={pagination?.total}
          />
        )
      }
      bottomContentPlacement="outside"
      // selectedKeys={selectedKeys}
      // selectionMode="multiple"
      topContent={
        <TableTopContent
          query={query}
          setQuery={setQuery}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          totalItems={pagination?.total}
          selectedKeys={selectedKeys}
        />
      }
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              column.uid === "actions" || column.uid === "menus"
                ? "center"
                : "start"
            }
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent="No banquet package found"
        items={guestFeedbacks}
      >
        {(item) => (
          <TableRow
            key={item.id}
            className={
              guestFeedbacks.indexOf(item) % 2 === 0
                ? "bg-white dark:bg-gray-800"
                : "bg-gray-100 dark:bg-gray-900"
            }
          >
            {(columnKey) => (
              <TableCell className="capitalize ">
                <RenderCell
                  items={guestFeedbacks}
                  item={item}
                  columnKey={columnKey as string}
                />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
