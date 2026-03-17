"use client";

import React from "react";
import { Chip, Input } from "@heroui/react";
import {
  GuestBreakdown,
  HOTEL_GUEST_BREAKDOWN_FIELDS,
  getGuestBreakdownTotal,
  serializeGuestBreakdown,
} from "@/lib/booking/guest-breakdown";

interface GuestBreakdownFieldsProps {
  value: GuestBreakdown;
  onChange:
    | React.Dispatch<React.SetStateAction<GuestBreakdown>>
    | ((value: GuestBreakdown) => void);
  maxGuests?: number | string | null;
  breakdownFieldName?: string;
  totalFieldName?: string;
  label?: string;
  helperText?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  isDisabled?: boolean;
}

function parseInputCount(value: string) {
  if (!value.trim()) return 0;

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0;
  }

  return Math.floor(numericValue);
}

export default function GuestBreakdownFields({
  value,
  onChange,
  maxGuests,
  breakdownFieldName = "guest_breakdown",
  totalFieldName = "number_of_guests",
  label = "Guest",
  helperText = "Specify the guest mix for this booking. The total updates automatically.",
  radius = "lg",
  variant = "bordered",
  isDisabled = false,
}: GuestBreakdownFieldsProps) {
  const totalGuests = React.useMemo(
    () => getGuestBreakdownTotal(value),
    [value],
  );
  const maxGuestLimit = Number(maxGuests || 0);
  const exceedsMaxGuests =
    Boolean(maxGuestLimit) && totalGuests > maxGuestLimit;

  function updateField(key: keyof GuestBreakdown, rawValue: string) {
    const nextValue = parseInputCount(rawValue);
    const nextBreakdown = {
      ...value,
      [key]: nextValue,
    };

    onChange(nextBreakdown);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-default-500">{helperText}</p>
        </div>
        <Chip
          color={
            exceedsMaxGuests
              ? "danger"
              : totalGuests > 0
                ? "success"
                : "default"
          }
          variant="flat"
        >
          Total: {totalGuests}
          {maxGuestLimit ? ` / ${maxGuestLimit}` : ""}
        </Chip>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {HOTEL_GUEST_BREAKDOWN_FIELDS.map((field) => (
          <Input
            key={field.key}
            type="number"
            min={0}
            isDisabled={isDisabled}
            label={field.label}
            labelPlacement="outside"
            radius={radius}
            variant={variant}
            value={String(value[field.key] ?? 0)}
            onChange={(e) => updateField(field.key, e.target.value)}
          />
        ))}
      </div>

      <input
        type="hidden"
        name={breakdownFieldName}
        value={serializeGuestBreakdown(value)}
      />
      <input type="hidden" name={totalFieldName} value={String(totalGuests)} />

      {exceedsMaxGuests ? (
        <p className="text-xs text-danger">
          Total guests exceed the allowed limit for this room.
        </p>
      ) : null}
    </div>
  );
}
