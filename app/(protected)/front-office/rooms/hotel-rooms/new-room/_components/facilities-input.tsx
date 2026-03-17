"use client";
import React, { useState } from "react";
import { Input, Button, Chip } from "@heroui/react";
import { Plus } from "lucide-react";

interface FacilitiesInputProps {
  facilities: string[];
  setFacilities: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FacilitiesInput({
  facilities,
  setFacilities,
}: FacilitiesInputProps) {
  const [facilityInput, setFacilityInput] = useState("");

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFacilities([...facilities, facilityInput.trim()]);
      setFacilityInput("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2>Facilities & Services</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Add facility..."
          value={facilityInput}
          onChange={(e) => setFacilityInput(e.target.value)}
          variant="bordered"
          radius="none"
        />
        <Button isIconOnly color="primary" onPress={addFacility}>
          <Plus />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {facilities.map((facility, index) => (
          <Chip
            key={index}
            onClose={() =>
              setFacilities(facilities.filter((_, i) => i !== index))
            }
          >
            {facility}
          </Chip>
        ))}
      </div>
    </div>
  );
}
