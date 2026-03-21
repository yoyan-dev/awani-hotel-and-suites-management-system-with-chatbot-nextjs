"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input, Button, Chip, Select, SelectItem } from "@heroui/react";
import { Plus } from "lucide-react";
import { formatPHP } from "@/lib/format-php";
import { useInventory } from "@/hooks/use-inventory";

export interface RoomTypeAddOnFormRow {
  id?: string;
  inventory_id?: string;
  add_on_id?: string;
  quantity_limit: number;
  add_on?: {
    id?: string;
    name?: string;
    price?: number;
  };
}

interface AddOnsProps {
  addOns: RoomTypeAddOnFormRow[];
  setAddOns: React.Dispatch<React.SetStateAction<RoomTypeAddOnFormRow[]>>;
}

export default function AddOns({ addOns, setAddOns }: AddOnsProps) {
  const { inventory, isLoading, error, fetchInventory } = useInventory();
  const [inventoryId, setInventoryId] = useState("");
  const [quantityLimit, setQuantityLimit] = useState("");

  useEffect(() => {
    fetchInventory();
  }, [error]);

  const inventoryMap = useMemo(() => {
    return inventory.reduce<Record<string, { name: string; price: number }>>(
      (acc, item) => {
        acc[String(item.id)] = {
          name: item.name,
          price: Number(item.price ?? 0),
        };
        return acc;
      },
      {},
    );
  }, [inventory]);

  const addItem = () => {
    if (!inventoryId) return;
    const selected = inventoryMap[inventoryId];
    setAddOns((prev) => [
      ...prev.filter((row) => (row.inventory_id ?? row.add_on_id) !== inventoryId),
      {
        inventory_id: inventoryId,
        add_on_id: inventoryId,
        quantity_limit: Number(quantityLimit || 0),
        add_on: {
          id: inventoryId,
          name: selected?.name,
          price: selected?.price,
        },
      },
    ]);
    setInventoryId("");
    setQuantityLimit("");
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-lg">Add-ons</h2>
      <p className="text-sm text-gray-500">
        Add-ons are inventory-linked entries with quantity limits.
      </p>

      <div className="flex gap-2 items-end">
        <Select
          isLoading={isLoading}
          radius="none"
          labelPlacement="outside"
          placeholder="Select inventory"
          variant="bordered"
          selectedKeys={inventoryId ? [inventoryId] : []}
          onChange={(e) => setInventoryId(e.target.value)}
        >
          {inventory.map((inv) => (
            <SelectItem key={inv.id} textValue={inv.name}>
              <span className="text-small">{inv.name}</span>
            </SelectItem>
          ))}
        </Select>
        <Input
          placeholder="Quantity limit"
          value={quantityLimit}
          type="number"
          onChange={(e) => setQuantityLimit(e.target.value)}
          variant="bordered"
          radius="none"
        />
        <Button color="primary" radius="none" onPress={addItem} endContent={<Plus />}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {addOns.map((row, index) => {
          const key = row.inventory_id ?? row.add_on_id ?? `row-${index}`;
          const inv = inventoryMap[String(key)];
          const label = row.add_on?.name ?? inv?.name ?? "Unknown";
          const price = row.add_on?.price ?? inv?.price ?? 0;
          return (
            <Chip
              key={String(key)}
              onClose={() => setAddOns(addOns.filter((_, i) => i !== index))}
            >
              {label} {formatPHP(Number(price || 0))} (limit: {row.quantity_limit || 0})
            </Chip>
          );
        })}
      </div>
    </div>
  );
}
