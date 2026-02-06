import { FetchRoomsParams, FetchRoomTypesParams } from "@/types/room";
import { Input } from "@heroui/input";
import { Button, DatePicker } from "@heroui/react";
import { User } from "lucide-react";
import React from "react";

export default function Header({
  query,
  setQuery,
  desiredGuest,
  setDesiredGuest,
  checkAvailability,
}: {
  query: FetchRoomTypesParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchRoomTypesParams>>;
  desiredGuest: number;
  setDesiredGuest: React.Dispatch<React.SetStateAction<number>>;
  checkAvailability: () => void;
}) {
  return (
    <div>
      <h1 className="font-semibold">
        Rooms & Suites – Your Perfect Stay at Awani
      </h1>
      <p className="text-gray-500 dark:text-gray-200 text-sm">
        Browse our selection of stylish rooms and spacious suites. Enjoy modern
        amenities, cozy comfort, and great value for your next getaway.
      </p>
      <div className="pt-4">
        <div className="flex w-full items-end flex-wrap md:flex-nowrap gap-4">
          <DatePicker
            label="Check in"
            radius="none"
            variant="bordered"
            labelPlacement="outside"
            value={query.checkIn}
            onChange={(e) => setQuery({ ...query, checkIn: e })}
          />
          <DatePicker
            label="Check out"
            radius="none"
            variant="bordered"
            labelPlacement="outside"
            value={query.checkOut}
            onChange={(e) => setQuery({ ...query, checkOut: e })}
          />
          <Input
            type="number"
            variant="bordered"
            width={20}
            startContent={<User />}
            radius="none"
            value={desiredGuest.toString()}
            onChange={(e) => setDesiredGuest(Number(e.target.value))}
          />
          <Button
            radius="none"
            color="primary"
            fullWidth
            onPress={checkAvailability}
          >
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );
}
