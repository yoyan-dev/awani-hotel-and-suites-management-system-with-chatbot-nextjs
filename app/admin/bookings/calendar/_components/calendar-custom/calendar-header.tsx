"use client";

import { Room, RoomType } from "@/types/room";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
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
    <div className="space-y-3">
      {/* TOP CONTROLS */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-200">
        {/* NAVIGATION */}
        <div className="flex gap-2">
          {["PREV", "TODAY", "NEXT"].map((action) => (
            <Button
              key={action}
              size="sm"
              radius="sm"
              variant="bordered"
              onPress={() => onNavigate(action as NavigateAction)}
            >
              {action}
            </Button>
          ))}
        </div>

        {/* VIEW + FILTER */}
        <div className="flex items-center gap-2">
          {views.map((view) => (
            <Button
              key={view}
              size="sm"
              radius="sm"
              variant={selectedView === view ? "solid" : "bordered"}
              color={selectedView === view ? "primary" : "default"}
              onPress={() => onView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
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

            <PopoverContent className=" p-3 bg-white border border-gray-200 rounded-md shadow-sm">
              <div className="space-y-4 text-sm">
                {/* ROOM TYPE FILTER */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">
                    Room Type{" "}
                    {roomTypeLoading ? <Spinner className="h-10" /> : ""}
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
                  <p className="text-xs font-medium text-gray-500">
                    Room {roomLoading ? <Spinner className="h-10" /> : ""}
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
