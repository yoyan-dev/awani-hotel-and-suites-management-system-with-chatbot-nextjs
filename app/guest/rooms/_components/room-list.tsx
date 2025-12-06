import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { formatPHP } from "@/lib/format-php";
import { RoomType } from "@/types/room";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Link,
  Tab,
  Tabs,
  Spinner,
  Input,
  Button,
} from "@heroui/react";
import React from "react";
import SkeletonLoader from "../../_components/skeleton-loader";
import { User, UserSquare } from "lucide-react";

interface RoomProps {
  rooms: RoomType[];
  typesLoading: boolean;
}

export const RoomsList: React.FC<RoomProps> = ({ rooms, typesLoading }) => {
  return (
    <div className="md:p-4">
      {typesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 md:p-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : rooms.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 md:p-4">
            {rooms.map((room) => (
              <Card
                isPressable
                shadow="sm"
                radius="md"
                key={room.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardBody className="overflow-hidden p-0 dark:bg-gray-900">
                  <Image
                    alt="room image"
                    className="w-full object-cover h-[140px]"
                    radius="sm"
                    src={room.image || "/bg.jpg"}
                    width="100%"
                  />
                </CardBody>

                <CardFooter className="text-sm text-left dark:bg-gray-900 p-3">
                  <div className="flex flex-col justify-start gap-2 w-full h-full">
                    <div>
                      <b className="capitalize text-base">{room.name}</b>
                      <span className="text-gray-500 ">({room.room_size})</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-gray-500 line-clamp-2">
                        {room.description}
                      </span>
                      <span className="text-gray-500 flex gap-4 line-clamp-2">
                        <UserSquare size={18} /> {room.max_guest}
                      </span>
                      <p className="font-semibold text-primary">
                        {formatPHP(Number(room.price))} / night
                      </p>
                    </div>
                    <Button
                      as={Link}
                      href={`/guest/rooms/reservation/${room.id}`}
                      fullWidth
                      color="primary"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-600 dark:text-gray-300">
            No available rooms found.
          </span>
        </div>
      )}
    </div>
  );
};
