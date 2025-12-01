import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Search, ChevronDown } from "lucide-react";
import { columns, bookingStatusOptions } from "@/app/constants/booking";
import { capitalize } from "@/app/utils/capitalize";
import AddModal from "../modals/add-modal/index";
import { FetchBookingParams } from "@/types/booking";

interface Props {
  query: FetchBookingParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchBookingParams>>;
  bookingsCount: number;
}

export const TableTopContent: React.FC<Props> = ({
  query,
  setQuery,
  bookingsCount,
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
          value={query.query}
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
              selectedKeys={query.status}
              selectionMode="single"
            >
              {bookingStatusOptions.map((status) => (
                <DropdownItem key={status.uid} className="capitalize">
                  {capitalize(status.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <AddModal />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {bookingsCount} bookings
        </span>
        <label className="flex items-center text-default-600 dark:text-default-300 text-small">
          Rows per page: 10
        </label>
      </div>
    </div>
  );
};
