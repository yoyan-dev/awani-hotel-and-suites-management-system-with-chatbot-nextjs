import { RoomType } from "@/types/room";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { Filter } from "lucide-react";
import { NavigateAction, View } from "react-big-calendar";

interface CalendarHeaderProps {
  label: string;
  onNavigate: (action: NavigateAction) => void;
  onView: (view: View) => void;
  views: View[];
  selectedName: string;
  selectedRoomType: string;
  setSelectedRoomType: React.Dispatch<React.SetStateAction<string>>;
  roomType: RoomType[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  label,
  onNavigate,
  onView,
  views,
  selectedName,
  selectedRoomType,
  setSelectedRoomType,
  roomType,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center pb-4 border-b border-gray-400">
        <div className="flex gap-2 ">
          <Button size="sm" radius="none" onPress={() => onNavigate("PREV")}>
            Prev
          </Button>
          <Button size="sm" radius="none" onPress={() => onNavigate("TODAY")}>
            Today
          </Button>
          <Button size="sm" radius="none" onPress={() => onNavigate("NEXT")}>
            Next
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          {views.map((view) => (
            <Button
              key={view}
              variant="bordered"
              size="sm"
              radius="none"
              onPress={() => onView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}

          <Popover placement="bottom-start">
            <PopoverTrigger>
              <Button
                variant="bordered"
                size="sm"
                radius="none"
                startContent={<Filter size={16} />}
              >
                {selectedName}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-2 shadow-lg rounded-lg bg-white max-h-[260px] overflow-auto border border-gray-200">
              <Listbox
                selectionMode="single"
                selectedKeys={[selectedRoomType]}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)?.[0];
                  if (key) setSelectedRoomType(String(key));
                }}
              >
                {roomType.map((rt) => (
                  <ListboxItem
                    key={rt.id}
                    className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                  >
                    {rt.name}
                  </ListboxItem>
                ))}
              </Listbox>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-800 pb-2 mb-2 text-center">
        {label}
      </div>
    </div>
  );
};

export default CalendarHeader;
