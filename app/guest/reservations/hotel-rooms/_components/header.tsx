import { FetchRoomTypesParams } from "@/types/room";
import { Input } from "@heroui/input";
import { Button, DatePicker } from "@heroui/react";
import { UsersRound } from "lucide-react";
import React from "react";

const inputClassNames = {
  label: "text-[#6b6153] font-medium",
  input: "text-[#1f1e1b] placeholder:text-[#8a7f71]",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] group-data-[focus=true]:border-[#b08a53]",
};

const datePickerClassNames = {
  base: "text-[#1f1e1b]",
  label: "text-[#6b6153] font-medium",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] text-[#1f1e1b] group-data-[focus=true]:border-[#b08a53]",
  input: "!text-[#1f1e1b]",
  segment: "!text-[#1f1e1b] data-[placeholder=true]:!text-[#8a7f71]",
  selectorIcon: "!text-[#7a6f62]",
  selectorButton: "!text-[#7a6f62]",
};

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
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7647]">
          Reservations
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[#211f1b] sm:text-4xl">
          Rooms & Suites for your perfect stay
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-[#675c4f] sm:text-base">
          Select your preferred dates and guest count to view available rooms
          and premium suites tailored to your travel plans.
        </p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-[#e5dacb] bg-[#fcf8f2] p-4 sm:p-6 lg:grid-cols-[1fr_1fr_0.7fr_0.8fr]">
        <DatePicker
          label="Check in"
          radius="lg"
          variant="bordered"
          labelPlacement="outside"
          value={query.checkIn}
          onChange={(e) => setQuery({ ...query, checkIn: e })}
          classNames={datePickerClassNames}
        />
        <DatePicker
          label="Check out"
          radius="lg"
          variant="bordered"
          labelPlacement="outside"
          isDisabled={!query.checkIn}
          minValue={query.checkIn}
          value={query.checkOut}
          onChange={(e) => setQuery({ ...query, checkOut: e })}
          classNames={datePickerClassNames}
        />
        <Input
          type="number"
          variant="bordered"
          label="Guests"
          labelPlacement="outside"
          startContent={<UsersRound size={16} />}
          radius="lg"
          min={1}
          value={desiredGuest.toString()}
          onChange={(e) => setDesiredGuest(Number(e.target.value))}
          classNames={inputClassNames}
        />
        <div className="flex items-end">
          <Button
            radius="full"
            className="h-11 w-full bg-[#b08a53] text-base font-semibold text-white hover:bg-[#9d7948]"
            onPress={checkAvailability}
          >
            Check Availability
          </Button>
        </div>
      </div>
    </div>
  );
}
