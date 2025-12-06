import React from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Search, ChevronDown, Plus, SlidersHorizontal } from "lucide-react";
import { columns, statusOptions } from "@/app/constants/rooms";
import { capitalize } from "@/app/utils/capitalize";
import { FetchRoomsParams, RoomType } from "@/types/room";

interface Props {
  roomTypes: RoomType[];
  query: FetchRoomsParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchRoomsParams>>;
  roomsCount: any;
}

export const TableTopContent: React.FC<Props> = ({
  roomTypes,
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
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                size="sm"
                variant="bordered"
                endContent={<SlidersHorizontal size={16} />}
              >
                Filters
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-4 w-64 flex flex-col gap-4">
              <Select
                label="Room Type"
                placeholder="Select Type"
                items={roomTypes}
                size="sm"
                selectedKeys={query.roomTypeID ? [query.roomTypeID] : []}
                onChange={(e) =>
                  setQuery({ ...query, roomTypeID: e.target.value })
                }
              >
                {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
              </Select>

              <Select
                label="Room Status"
                placeholder="Select Status"
                items={statusOptions}
                size="sm"
                selectedKeys={query.status ? [query.status] : []}
                onChange={(e) => setQuery({ ...query, status: e.target.value })}
              >
                {(item) => <SelectItem key={item.uid}>{item.name}</SelectItem>}
              </Select>
            </PopoverContent>
          </Popover>

          <Button
            size="sm"
            as={Link}
            color="primary"
            href="hotel-rooms/new-room"
            variant="solid"
          >
            Add New <Plus />
          </Button>
        </div>
      </div>

      {/* Footer */}
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
