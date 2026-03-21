import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Image,
  Chip,
} from "@heroui/react";
import { Users, Users2, CalendarDays, CheckCircle } from "lucide-react";
import { FunctionRoom } from "@/types/function-room";
import {
  getOccupancyColor,
  OccupancyType,
} from "@/utils/function-room/occupancy";

interface Props {
  room: FunctionRoom;
  booking: any;
  isLoading: boolean;
  onAssign: (room: FunctionRoom, occupancy: OccupancyType) => void;
}

export default function FunctionRoomCard({
  room,
  booking,
  isLoading,
  onAssign,
}: Props) {
  const isSelected = booking.room_id === room.id;

  return (
    <Card
      isPressable
      className="hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all"
    >
      <Image
        src={room.image}
        alt={room.id}
        className="rounded-t-xl h-40 w-full object-cover"
      />

      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-lg font-semibold">Room #{room.room_number}</h3>
        <p className="text-sm text-gray-500">{room.type}</p>
      </CardHeader>

      <CardBody className="flex flex-col gap-2 text-sm">
        <div className="flex gap-4">
          <span className="flex gap-2 font-semibold">
            <Users /> {room.max_guest}
          </span>
          <span className="flex gap-2 font-semibold">
            <Users2 /> {room.remaining_slots} (remaining)
          </span>
        </div>

        <p className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {isSelected ? "Already selected" : room.availability}
        </p>

        <Chip
          size="sm"
          color={getOccupancyColor(room.status as OccupancyType)}
          variant="flat"
          className="w-fit"
        >
          {room.status}
        </Chip>
      </CardBody>

      {!isSelected && (
        <>
          <Divider />
          <CardFooter className="flex flex-col gap-2">
            <Button
              fullWidth
              isLoading={isLoading}
              variant="flat"
              color="primary"
              startContent={<CheckCircle className="w-4 h-4" />}
              onPress={() => onAssign(room, "half occupied")}
            >
              Half Room
            </Button>

            <Button
              fullWidth
              isLoading={isLoading}
              startContent={<CheckCircle className="w-4 h-4" />}
              onPress={() => onAssign(room, "full occupied")}
            >
              Full Room
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
