"use client";
import React, { useState } from "react";
import { Input, Button, Chip } from "@heroui/react";
import { Plus } from "lucide-react";

interface BedsInputProps {
  beds: string[];
  setBeds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function BedsInput({ beds, setBeds }: BedsInputProps) {
  const [bedInput, setBedInput] = useState("");

  const addBed = () => {
    if (bedInput.trim()) {
      setBeds([...beds, bedInput.trim()]);
      setBedInput("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2>Beds</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Add bed"
          value={bedInput}
          onChange={(e) => setBedInput(e.target.value)}
          variant="bordered"
          radius="none"
        />
        <Button isIconOnly color="primary" radius="none" onPress={addBed}>
          <Plus />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {beds.map((bed, index) => (
          <Chip
            key={index}
            onClose={() => setBeds(beds.filter((_, i) => i !== index))}
          >
            {bed}
          </Chip>
        ))}
      </div>
    </div>
  );
}
