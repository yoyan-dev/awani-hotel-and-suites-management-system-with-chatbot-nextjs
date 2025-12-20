"use client";
import React from "react";
import {
  Card,
  CardBody,
  Chip,
  Image,
  Divider,
  Spinner,
  Button,
  Link,
} from "@heroui/react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { formatPHP } from "@/lib/format-php";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { fetchRoomType } from "@/features/room-types/room-types-thunk";

export default function RoomDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { room_type, isLoading } = useSelector(
    (state: RootState) => state.room_type
  );

  React.useEffect(() => {
    if (id) {
      dispatch(fetchRoomType(id as string));
    }
  }, [dispatch, id]);

  if (isLoading || !room_type) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" label="Loading room details..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <Card className="border-none shadow-none">
        <CardBody className="space-y-6">
          <div className="flex">
            <div className="flex-1">
              <Image
                alt="room image"
                src={room_type.image || "/bg.jpg"}
                radius="lg"
                width="100%"
                className="object-cover w-full h-[500px] md:h-[400px]"
              />
            </div>
            <div className="flex-1 space-y-4 px-2">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-xl font-bold capitalize">
                    {room_type.name}{" "}
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {room_type.room_size}
                    </span>
                  </h1>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {room_type.description}
                  </span>
                </div>
                <span>{formatPHP(Number(room_type.price))}/night</span>
              </div>
              <div className="flex justify-end">
                <Button
                  color="primary"
                  as={Link}
                  href={`/guest/rooms/reservation/${room_type.id}`}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
