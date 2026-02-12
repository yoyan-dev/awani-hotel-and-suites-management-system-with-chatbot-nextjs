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
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/room-types";
import { RenderCell } from "./render-cell";
import { TableTopContent } from "./top-content";
import { TableBottomContent } from "./bottom-content";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchRoomTypes } from "@/features/room-types/room-types-thunk";
import { RoomType } from "@/types/room";
import { ColumnType } from "@/types/column";

interface RoomTypesTableProps {
  items: RoomType[];
  room_types: RoomType[];

  headerColumns: ColumnType[];
  visibleColumns: Set<string>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Set<string>>>;

  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  hasSearchFilter: boolean;
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;

  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pages: number;

  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;

  isLoading: boolean;
}
export default function RoomTypesTable({
  items,
  room_types,
  headerColumns,
  visibleColumns,
  setVisibleColumns,
  onRowsPerPageChange,
  hasSearchFilter,
  filterValue,
  setFilterValue,
  page,
  setPage,
  pages,
  selectedKeys,
  setSelectedKeys,
  isLoading,
}: RoomTypesTableProps) {
  return (
    <Table
      isHeaderSticky
      classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
      aria-label="Rooms Table"
      rowHeight={40}
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
      topContent={
        <TableTopContent
          filterValue={filterValue}
          onSearchChange={setFilterValue}
          setFilterValue={setFilterValue}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          onRowsPerPageChange={onRowsPerPageChange}
          itemsCount={room_types.length}
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
        emptyContent="No room types found"
        items={items}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="capitalize">
                <RenderCell room_type={item} columnKey={columnKey as string} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
