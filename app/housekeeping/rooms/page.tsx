"use client";

import RoomStatusCard from "./_components/room-status-card";
import { useRooms } from "@/hooks/use-rooms";
import React from "react";
import Loader from "./_components/loader";
import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { Button, Pagination, Select, SelectItem } from "@heroui/react";
import { statusOptions } from "@/app/constants/rooms";
import { FetchRoomsParams } from "@/types/room";
import RoomStats from "./_components/room-stats";

export default function HousekeepingRoomsPage() {
  const {
    rooms,
    isLoading,
    pagination,
    analytics,
    fetchRooms,
    fetchAnalytics,
  } = useRooms();
  const [query, setQuery] = React.useState<FetchRoomsParams>({});
  const handleUpdateStatus = (
    roomId?: string,
    status?: string,
    remarks?: string
  ) => {
    console.log("Update room:", roomId, status);
  };

  React.useEffect(() => {
    fetchRooms(query);
  }, [query]);

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-800 pb-10 px-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Housekeeping – Room Status
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor and update room cleanliness across all floors
          </p>
        </header>
        <RoomStats analytics={analytics} />
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white dark:bg-gray-900">
          <Input
            variant="bordered"
            radius="sm"
            startContent={<Search size={16} />}
            placeholder="Search room, type, remarks..."
            value={query.query}
            onChange={(e) => setQuery({ ...query, query: e.target.value })}
          />

          <Select
            placeholder="Filter Status"
            selectedKeys={[query.status || "all"]}
            className="sm:max-w-xs"
            onChange={(e) => setQuery({ ...query, status: e.target.value })}
          >
            {statusOptions.map((opt) => (
              <SelectItem key={opt.uid}>{opt.name}</SelectItem>
            ))}
          </Select>
        </div>

        {pagination?.total_pages === 0 ? (
          <div className="text-sm text-gray-500 text-center py-10">
            No rooms found
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 content-center">
            {isLoading
              ? [1, 2, 3].map((i) => <Loader />)
              : rooms.map((room) => (
                  <RoomStatusCard
                    key={room.id}
                    room={room}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <span className="text-xs text-gray-500">
            Page {pagination?.page} of {pagination?.total_pages || 1}
          </span>

          <Pagination
            showControls
            color="primary"
            page={query.page}
            total={pagination?.total_pages ?? 0}
            variant="light"
            onChange={(page: number) => setQuery({ ...query, page: page })}
          />
        </div>
      </div>
    </main>
  );
}

// "use client";
// import { useRooms } from "@/hooks/use-rooms";
// import Header from "./_components/header";
// import RoomTable from "./_components/table/room-table";
// import React from "react";
// import { FetchRoomsParams } from "@/types/room";
// import {
//   columns,
//   HOUSEKEEPING_INITIAL_VISIBLE_COLUMNS,
// } from "@/app/constants/rooms";
// import RoomStats from "./_components/room-stats";
// import { formatDate } from "@/utils/format-date";
// import { useRoomTypes } from "@/hooks/use-room-types";

// export default function RoomList() {
//   const {
//     rooms,
//     analytics,
//     pagination,
//     isLoading,
//     fetchRooms,
//     fetchAnalytics,
//   } = useRooms();
//   const { room_types, fetchRoomTypes } = useRoomTypes();
//   const [query, setQuery] = React.useState<FetchRoomsParams>({});
//   const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
//   const [visibleColumns, setVisibleColumns] = React.useState<any>(
//     new Set(HOUSEKEEPING_INITIAL_VISIBLE_COLUMNS)
//   );
//   const [selectedDate, setSelectedDate] = React.useState(
//     formatDate(new Date())
//   );

//   const headerColumns = React.useMemo(() => {
//     if (visibleColumns === "all") return columns;
//     return columns.filter((column) =>
//       Array.from(visibleColumns).includes(column.uid)
//     );
//   }, [visibleColumns]);

//   React.useEffect(() => {
//     fetchRooms(query);
//   }, [query]);

//   React.useEffect(() => {
//     fetchAnalytics();
//   }, [selectedDate]);

//   React.useEffect(() => {
//     fetchRoomTypes({});
//   }, []);

//   return (
//     <div className="p-2 md:p-4 bg-white dark:bg-gray-900 rounded ">
//       <Header />
//       <RoomStats analytics={analytics} />
//       <RoomTable
//         rooms={rooms}
//         roomTypes={room_types}
//         pagination={pagination}
//         query={query}
//         setQuery={setQuery}
//         selectedKeys={selectedKeys}
//         setSelectedKeys={setSelectedKeys}
//         visibleColumns={visibleColumns}
//         setVisibleColumns={setVisibleColumns}
//         headerColumns={headerColumns}
//         isLoading={isLoading}
//       />
//     </div>
//   );
// }
