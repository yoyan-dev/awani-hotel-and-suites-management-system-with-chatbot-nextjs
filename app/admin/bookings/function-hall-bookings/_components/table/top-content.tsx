import React from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  DateRangePicker,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Search, Plus, Filter, RefreshCw } from "lucide-react";
import { bookingStatusOptions } from "@/app/constants/booking";
import { CalendarDate } from "@heroui/system/dist/types";
import Link from "next/link";
import { useBookings } from "@/hooks/use-bookings";
import {
  FetchFunctionHallBookingParams,
  FunctionHallBooking,
  FunctionHallBookingPagination,
} from "@/types/function-room-booking";

interface Props {
  bookings: FunctionHallBooking[];
  pagination: FunctionHallBookingPagination;
  query: FetchFunctionHallBookingParams;
  setQuery: React.Dispatch<
    React.SetStateAction<FetchFunctionHallBookingParams>
  >;
  selectedKeys: any;
  setSelectedKeys: React.Dispatch<React.SetStateAction<any>>;
  bookingLoading: boolean;
  bookingsCount: number;
}

export const TableTopContent: React.FC<Props> = ({
  query,
  setQuery,
  bookingsCount,
}) => {
  const { fetchBookings } = useBookings();

  const formatDate = (date: CalendarDate | null) =>
    date
      ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(
          date.day
        ).padStart(2, "0")}`
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end gap-3 flex-wrap">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:w-[45%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search bookings..."
          size="sm"
          startContent={<Search className="text-default-300" />}
          value={query.query || ""}
          variant="bordered"
          onClear={() => setQuery({ ...query, query: "" })}
          onValueChange={(value) => setQuery({ ...query, query: value })}
        />
        <div className="flex gap-4">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                size="sm"
                radius="sm"
                variant="bordered"
                startContent={<Filter size={16} />}
              >
                Filters
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-4 w-72 space-y-4">
              <h4 className="text-sm font-medium text-default-700">
                Filter Options
              </h4>

              <div className="space-y-1">
                <label className="text-xs text-default-500">Date Range</label>
                <DateRangePicker
                  variant="bordered"
                  size="sm"
                  radius="sm"
                  onChange={(e) =>
                    setQuery({
                      ...query,
                      date_range: {
                        start: formatDate(e?.start ?? null),
                        end: formatDate(e?.end ?? null),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-1 w-full">
                <label className="text-xs text-default-500">Status</label>
                <Select
                  size="sm"
                  radius="sm"
                  fullWidth
                  placeholder="Select status"
                  items={bookingStatusOptions}
                  onChange={(e) =>
                    setQuery({ ...query, status: e.target.value })
                  }
                >
                  {(item) => (
                    <SelectItem key={item.uid}>{item.name}</SelectItem>
                  )}
                </Select>
              </div>

              <Button
                size="sm"
                fullWidth
                color="primary"
                onPress={() => fetchBookings(query)}
              >
                Apply Filters
              </Button>
            </PopoverContent>
          </Popover>

          <Button
            as={Link}
            href="/admin/bookings/function-hall-bookings/add-booking"
            color="primary"
            size="sm"
            startContent={<Plus size={16} />}
          >
            Booking
          </Button>
        </div>
      </div>

      {/* FOOTER: total + refresh */}
      <div className="flex justify-between items-center">
        <span className="text-default-600 dark:text-default-300 text-small">
          Total {bookingsCount} bookings
        </span>

        <div className="flex items-center gap-3 text-small">
          <div>Rows per page: 10</div>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => fetchBookings(query)}
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
