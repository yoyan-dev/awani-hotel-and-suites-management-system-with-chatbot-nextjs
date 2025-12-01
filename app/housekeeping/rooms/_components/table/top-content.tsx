import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
} from "@heroui/react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { columns, statusOptions } from "@/app/constants/rooms";
import { capitalize } from "@/app/utils/capitalize";
import { FetchRoomsParams } from "@/types/room";

interface Props {
  query: FetchRoomsParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchRoomsParams>>;
  roomsCount: any;
}

export const TableTopContent: React.FC<Props> = ({
  query,
  setQuery,
  roomsCount,
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
          placeholder="Search something..."
          size="sm"
          startContent={<Search className="text-default-300" />}
          value={query.query || ""}
          variant="bordered"
          onClear={() => setQuery({ ...query, query: "" })}
          onValueChange={(value) => setQuery({ ...query, query: value })}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDown className="text-small" />}
                size="sm"
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectionMode="single"
              selectedKeys={query.status || "all"}
              onSelectionChange={(val) => console.log(val)}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {capitalize(status.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {roomsCount} rooms
        </span>
        <label className="flex items-center text-default-600 dark:text-default-300 text-small">
          Rows per page: 10
        </label>
      </div>
    </div>
  );
};
