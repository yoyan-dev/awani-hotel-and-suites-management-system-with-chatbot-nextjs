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
import { columns, INITIAL_VISIBLE_COLUMNS } from "./constants";
import RenderCell from "./render-cell";
import { TableTopContent } from "./top-content";
import { TableBottomContent } from "./bottom-content";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchUsers } from "@/features/users/user-thunk";
import { Staff } from "@/types/staff";
import { ColumnType } from "@/types/column";
import { User } from "@/types/users";

interface StaffTableProps {
  items: User[];
  users: User[];

  headerColumns: ColumnType[];
  visibleColumns: Set<string>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Set<string>>>;

  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  hasSearchFilter: boolean;
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
  rolesStatusFilter: any;
  setRolesStatusFilter: React.Dispatch<React.SetStateAction<any | "all">>;

  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pages: number;

  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;

  isLoading: boolean;
}

export default function StaffTable({
  items,
  users,
  headerColumns,
  visibleColumns,
  setVisibleColumns,
  onRowsPerPageChange,
  hasSearchFilter,
  filterValue,
  setFilterValue,
  rolesStatusFilter,
  setRolesStatusFilter,
  page,
  setPage,
  pages,
  selectedKeys,
  setSelectedKeys,
  isLoading,
}: StaffTableProps) {
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
      // selectedKeys={selectedKeys}
      // selectionMode="multiple"
      topContent={
        <TableTopContent
          filterValue={filterValue}
          onSearchChange={setFilterValue}
          setFilterValue={setFilterValue}
          rolesStatusFilter={rolesStatusFilter}
          setRolesStatusFilter={setRolesStatusFilter}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          onRowsPerPageChange={onRowsPerPageChange}
          usersCount={users.length}
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
        emptyContent="No user found"
        items={items}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="capitalize">
                <RenderCell user={item} columnKey={columnKey as string} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
