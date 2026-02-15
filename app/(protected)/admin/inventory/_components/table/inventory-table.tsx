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
import { Inventory } from "@/types/inventory";
import { ColumnType } from "@/types/column";

interface InventoryTableProps {
  items: Inventory[];
  inventory: Inventory[];

  headerColumns: ColumnType[];
  visibleColumns: Set<string>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Set<string>>>;

  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  hasSearchFilter: boolean;
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: any;
  setStatusFilter: React.Dispatch<React.SetStateAction<any | "all">>;

  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pages: number;

  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;

  isLoading: boolean;
}

export default function InventoryTable({
  items,
  inventory,
  headerColumns,
  visibleColumns,
  setVisibleColumns,
  onRowsPerPageChange,
  hasSearchFilter,
  filterValue,
  setFilterValue,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  pages,
  selectedKeys,
  setSelectedKeys,
  isLoading,
}: InventoryTableProps) {
  return (
    <Table
      isHeaderSticky
      classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
      aria-label="Rooms Table"
      bottomContent={
        <TableBottomContent
          hasSearchFilter={hasSearchFilter}
          page={page}
          setPage={setPage}
          pages={pages}
          selectedKeys={selectedKeys}
          itemsLength={items.length}
        />
      }
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      topContent={
        <TableTopContent
          filterValue={filterValue}
          onSearchChange={setFilterValue}
          setFilterValue={setFilterValue}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          onRowsPerPageChange={onRowsPerPageChange}
          itemsCount={inventory.length}
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
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent="No rooms found"
        items={items}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="capitalize">
                <RenderCell inventory={item} columnKey={columnKey as string} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
