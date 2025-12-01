"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Selection,
} from "@heroui/react";
import { Copyright, Maximize, Minimize } from "lucide-react";
import {
  Booking,
  BookingPagination,
  FetchBookingParams,
} from "@/types/booking";
import { ColumnType } from "@/types/column";
import { Room } from "@/types/room";
import BookingTable from "../table/booking-table";
import { columns, VISIBLE_COLUMNS } from "@/app/constants/booking";

interface ExpandedTableProps {
  bookings: Booking[];
  pagination: BookingPagination;
  query: FetchBookingParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchBookingParams>>;
  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;
  bookingLoading: boolean;
  handleSubmit: (booking: Booking, room: Room) => void;
}

export default function ExpandedBookingTable({
  bookings,
  pagination,
  query,
  setQuery,
  selectedKeys,
  setSelectedKeys,
  bookingLoading,
  handleSubmit,
}: ExpandedTableProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visibleColumns, setVisibleColumns] = React.useState<any>(
    new Set(VISIBLE_COLUMNS)
  );

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  return (
    <>
      <Button onPress={() => onOpen()} isIconOnly variant="light" size="sm">
        {isOpen ? <Minimize /> : <Maximize />}
      </Button>
      <Modal isOpen={isOpen} size="full" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div>
                  <h1 className="text-2xl font-bold">Hotel Bookings</h1>
                  <p className="text-sm text-gray-600">
                    View and manage room reservations, guest details, and
                    check-in/check-out statuses for the hotel.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                <BookingTable
                  bookings={bookings}
                  pagination={pagination}
                  query={query}
                  setQuery={setQuery}
                  headerColumns={headerColumns}
                  visibleColumns={visibleColumns}
                  setVisibleColumns={setVisibleColumns}
                  selectedKeys={selectedKeys}
                  setSelectedKeys={setSelectedKeys}
                  bookingLoading={bookingLoading}
                  handleSubmit={handleSubmit}
                />
              </ModalBody>
              <ModalFooter className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin">
                <Copyright size={10} /> Alright reserved Ma. Awani.
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
