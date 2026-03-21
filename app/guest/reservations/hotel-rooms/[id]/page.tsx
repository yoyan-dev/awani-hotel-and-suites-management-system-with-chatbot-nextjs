"use client";
import {
  Card,
  CardBody,
  Image,
  Spinner,
  Button,
  Link,
} from "@heroui/react";
import { formatPHP } from "@/lib/format-php";
import { useGuestRoomDetailsPage } from "@/hooks/guest/use-guest-room-details-page";

export default function RoomDetails() {
  const { roomType, isLoading, roomImages } = useGuestRoomDetailsPage();

  if (isLoading || !roomType) {
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
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-3/5">
              <div className="grid gap-3 sm:grid-cols-2">
                {roomImages.map((src, index) => (
                  <Image
                    key={`${src}-${index}`}
                    alt={`room image ${index + 1}`}
                    src={src}
                    radius="lg"
                    width="100%"
                    className="object-cover w-full h-[220px] sm:h-[260px] lg:h-[220px]"
                  />
                ))}
              </div>
            </div>
            <div className="w-full lg:w-2/5 space-y-4 px-2">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-xl font-bold capitalize">
                    {roomType.name}{" "}
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      {roomType.room_size}
                    </span>
                  </h1>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {roomType.description}
                  </span>
                </div>
                <span>{formatPHP(Number(roomType.price))}/night</span>
              </div>
              <div className="flex justify-end">
                <Button
                  color="primary"
                  as={Link}
                  href={`/guest/reservations/hotel-rooms/reservation/${roomType.id}`}
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
