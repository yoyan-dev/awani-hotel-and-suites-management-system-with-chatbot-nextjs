import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { columns, INITIAL_VISIBLE_COLUMNS } from "@/app/constants/rooms";
import { RenderCell } from "./render-cell";
import { TableTopContent } from "./top-content";
import { TableBottomContent } from "./bottom-content";
import { ColumnType } from "@/types/column";
import {
  BanquetMenu,
  BanquetMenuFetchParams,
  BanquetMenuPagination,
} from "@/types/banquet";

interface RoomTableProps {
  menus: BanquetMenu[];
  pagination: BanquetMenuPagination | null;
  query: BanquetMenuFetchParams;
  setQuery: React.Dispatch<React.SetStateAction<BanquetMenuFetchParams>>;
  selectedKeys: any;
  setSelectedKeys: React.Dispatch<React.SetStateAction<any>>;
  visibleColumns: any;
  setVisibleColumns: React.Dispatch<React.SetStateAction<any>>;
  headerColumns: ColumnType[];
  isLoading: boolean;
}

export default function MenuTable({
  menus,
  pagination,
  query,
  setQuery,
  selectedKeys,
  setSelectedKeys,
  visibleColumns,
  setVisibleColumns,
  headerColumns,
  isLoading,
}: RoomTableProps) {
  return (
    <Table
      aria-label="Menus Table"
      isHeaderSticky
      classNames={{ wrapper: ["shadow-none", "dark:bg-gray-900", "p-0"] }}
      bottomContent={
        <TableBottomContent
          query={query}
          setQuery={setQuery}
          pages={pagination?.total_pages ?? 0}
          selectedKeys={selectedKeys}
          totalMenus={pagination?.total}
        />
      }
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      topContent={
        <TableTopContent
          query={query}
          setQuery={setQuery}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          totalMenus={pagination?.total}
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
        emptyContent="No banquet menus found"
        items={menus}
        className="overflow-x-auto"
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="capitalize min-w-40">
                <RenderCell menu={item} columnKey={columnKey as string} />
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
