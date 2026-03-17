"use client";

import { Room, RoomType } from "@/types/room";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Listbox,
  ListboxItem,
  Divider,
  Spinner,
} from "@heroui/react";
import { Filter } from "lucide-react";
import { NavigateAction, View } from "react-big-calendar";

interface CalendarHeaderProps {
  selectedView: View;
  label: string;
  onNavigate: (action: NavigateAction) => void;
  onView: (view: View) => void;
  views: View[];
  selectedRoomType: string;
  setSelectedRoomType: React.Dispatch<React.SetStateAction<string>>;
  roomTypeLoading: boolean;
  roomTypes: RoomType[];
  roomLoading: boolean;
  rooms: Room[];
  selectedRoom: string;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedView,
  label,
  onNavigate,
  onView,
  views,
  selectedRoomType,
  setSelectedRoomType,
  roomTypeLoading,
  roomTypes,
  roomLoading,
  rooms,
  selectedRoom,
  setSelectedRoom,
}) => {
  return (
    <div className="space-y-3 w-full">
      {/* TOP CONTROLS */}
      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-gray-200">
        {/* NAVIGATION */}
        <div className="flex flex-wrap gap-2">
          {["PREV", "TODAY", "NEXT"].map((action) => (
            <button
              type="button"
              key={action}
              className="h-8 rounded-md border border-default-200 px-3 text-sm transition-colors hover:bg-default-100"
              onClick={() => onNavigate(action as NavigateAction)}
            >
              {action}
            </button>
          ))}
        </div>

        {/* VIEW + FILTER */}
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          {views.map((view) => (
            <button
              type="button"
              key={view}
              className={`h-8 rounded-md border px-3 text-sm transition-colors ${
                selectedView === view
                  ? "border-primary bg-primary text-white"
                  : "border-default-200 hover:bg-default-100"
              }`}
              onClick={() => onView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}

          {/* FILTER POPOVER */}
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                size="sm"
                radius="sm"
                variant="bordered"
                startContent={<Filter size={14} />}
              >
                Filters
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-3 bg-white border border-gray-200 rounded-md shadow-sm w-[250px] sm:w-[300px]">
              <div className="space-y-4 text-sm">
                {/* ROOM TYPE FILTER */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 flex items-center justify-between">
                    Room Type{" "}
                    {roomTypeLoading && <Spinner className="h-4 w-4" />}
                  </p>
                  <Listbox
                    selectionMode="single"
                    selectedKeys={[selectedRoomType]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0];
                      setSelectedRoomType(String(key || ""));
                    }}
                    className="max-h-[140px] overflow-auto"
                  >
                    {roomTypes.map((rt) => (
                      <ListboxItem key={rt.id}>{rt.name}</ListboxItem>
                    ))}
                  </Listbox>
                </div>

                <Divider />

                {/* ROOM FILTER */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 flex items-center justify-between">
                    Room {roomLoading && <Spinner className="h-4 w-4" />}
                  </p>
                  <Listbox
                    selectionMode="single"
                    selectedKeys={[selectedRoom]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0];
                      setSelectedRoom(String(key || ""));
                    }}
                    className="max-h-[140px] overflow-auto"
                  >
                    {[
                      ...rooms,
                      { id: "no assigned", room_number: "No assigned" },
                    ].map((room) => (
                      <ListboxItem key={room.id}>
                        {room.room_number}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* LABEL */}
      <div className="text-center text-lg font-semibold text-gray-800">
        {label}
      </div>
    </div>
  );
};

export default CalendarHeader;
