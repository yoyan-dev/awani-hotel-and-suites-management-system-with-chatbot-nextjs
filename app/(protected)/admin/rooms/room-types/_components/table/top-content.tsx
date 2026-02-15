import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Selection,
} from "@heroui/react";
import { Search, ChevronDown } from "lucide-react";
import AddModal from "../modals/add-modal";

interface Props {
  filterValue: string;
  onSearchChange: (value: string) => void;
  setFilterValue: (val: string) => void;
  visibleColumns: any;
  setVisibleColumns: (val: any) => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  itemsCount: number;
  selectedKeys: Selection;
}

export const TableTopContent: React.FC<Props> = ({
  filterValue,
  onSearchChange,
  setFilterValue,
  visibleColumns,
  setVisibleColumns,
  onRowsPerPageChange,
  itemsCount,
  selectedKeys,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search by name..."
          size="sm"
          startContent={<Search className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => setFilterValue("")}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          {/* <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDown className="text-small" />}
                size="sm"
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown> */}
          <AddModal />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {itemsCount} room types
        </span>
        <label className="flex items-center text-default-600 dark:text-default-300 text-small">
          Rows per page: 5
        </label>
      </div>
    </div>
  );
};
