"use client";

import React, { useState } from "react";
import { Button, Chip, Input } from "@heroui/react";
import { Plus } from "lucide-react";
import { normalizeRoomTypeAmenityName } from "@/lib/room-types/amenities";

export interface RoomTypeAmenityFormRow {
  name: string;
}

interface AmenitiesInputProps {
  amenities: RoomTypeAmenityFormRow[];
  setAmenities: React.Dispatch<React.SetStateAction<RoomTypeAmenityFormRow[]>>;
}

export default function AmenitiesInput({
  amenities,
  setAmenities,
}: AmenitiesInputProps) {
  const [value, setValue] = useState("");

  const addAmenity = () => {
    const name = normalizeRoomTypeAmenityName(value);
    if (!name) return;

    setAmenities((prev) => {
      const exists = prev.some(
        (item) => item.name.trim().toLowerCase() === name.toLowerCase(),
      );

      if (exists) {
        return prev;
      }

      return [...prev, { name }];
    });

    setValue("");
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-lg">Amenities</h2>
      <p className="text-sm text-gray-500">
        Add the amenities guests should see for this room type.
      </p>

      <div className="flex gap-2 items-end">
        <Input
          label="Amenity"
          labelPlacement="outside"
          placeholder="e.g. Free WiFi"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addAmenity();
            }
          }}
          variant="bordered"
          radius="none"
        />
        <Button color="primary" radius="none" onPress={addAmenity} endContent={<Plus />}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {amenities.map((item, index) => (
          <Chip
            key={`${item.name}-${index}`}
            onClose={() =>
              setAmenities((prev) => prev.filter((_, current) => current !== index))
            }
          >
            {item.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}
