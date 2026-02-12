"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Chip, Select, SelectItem } from "@heroui/react";
import { Plus } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import { useInventory } from "@/hooks/use-inventory";

interface AddOn {
  item_id: string;
  name: string;
  price: number;
  max_quantity: number;
}

interface AddOnsProps {
  addOns: AddOn[];
  setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>;
}

export default function AddOns({ addOns, setAddOns }: AddOnsProps) {
  const { inventory, isLoading, error, fetchInventory } = useInventory();
  const [itemID, setItemID] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  useEffect(() => {
    fetchInventory();
  }, [error]);

  const addItem = () => {
    if (!itemID) return;
    const item = inventory.find((inv) => inv.id === itemID);
    setAddOns([
      ...addOns,
      {
        item_id: itemID,
        name: item?.name ?? "",
        price: item?.price ?? 0,
        max_quantity: Number(maxQuantity) || 0,
      },
    ]);
    setItemID("");
    setMaxQuantity("");
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-lg">Add-ons</h2>
      <p className="text-sm text-gray-500">
        Click the <span className="font-bold">➕</span> icon to add an item to
        your room.
      </p>

      <div className="flex gap-2">
        <Select
          isLoading={isLoading}
          radius="none"
          labelPlacement="outside"
          placeholder="Select Item"
          variant="bordered"
          value={itemID}
          onChange={(e) => setItemID(e.target.value)}
        >
          {inventory.map((inv) => (
            <SelectItem key={inv.id} textValue={inv.name}>
              <span className="text-small">{inv.name}</span>
            </SelectItem>
          ))}
        </Select>

        <Input
          placeholder="Item Max quantity"
          value={maxQuantity}
          type="number"
          onChange={(e) => setMaxQuantity(e.target.value)}
          variant="bordered"
          radius="none"
        />
        <Button isIconOnly color="primary" radius="none" onPress={addItem}>
          <Plus />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {addOns.map((row, index) => (
          <Chip
            key={index}
            onClose={() => setAddOns(addOns.filter((_, i) => i !== index))}
          >
            {row.name} {formatPHP(row.price ?? 0)}
            {row.max_quantity ? ` (x${row.max_quantity})` : null}
          </Chip>
        ))}
      </div>
    </div>
  );
}
