"use client";

import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { Flag, Home, MailIcon, Transgender, User } from "lucide-react";
import React from "react";
import PhoneInput from "@/components/input/phone-input";
import DiditVerification from "@/app/guest/reservations/_components/valid-id/didit-verification";

export default function GuestForm({
  guestId,
  onIdVerificationChange,
}: {
  guestId: string;
  onIdVerificationChange?: (isVerified: boolean) => void;
}) {
  const [phone, setPhone] = React.useState("");
  const [isDiditVerified, setIsDiditVerified] = React.useState(false);

  React.useEffect(() => {
    onIdVerificationChange?.(isDiditVerified);
  }, [isDiditVerified, onIdVerificationChange]);

  return (
    <div className="w-full space-y-4">
      <h1 className="font-serif text-2xl text-[#281f14]">Guest Information</h1>

      <h3 className="text-sm font-medium text-[#675d50]">
        Personal Information
      </h3>
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <Input
          isRequired
          fullWidth
          startContent={<User className="shrink-0 text-default-600" />}
          name="full_name"
          id="full_name"
          label="Full Name"
          labelPlacement="outside"
          placeholder="Enter your full name"
          variant="bordered"
          radius="lg"
          className="flex-1"
        />
        <PhoneInput
          value={phone}
          onChange={setPhone}
          placeholder="Enter guest contact number"
          labelClassName="text-[#6b6153] font-medium"
        />
      </div>

      <Textarea
        isRequired
        startContent={<Home className="shrink-0 text-default-600" />}
        name="address"
        id="address"
        label="Home Address"
        labelPlacement="outside"
        placeholder="Enter your current home address"
        variant="bordered"
        radius="lg"
      />

      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <Input
          fullWidth
          isRequired
          startContent={<Flag className="shrink-0 text-default-600" />}
          name="nationality"
          id="nationality"
          label="Nationality"
          labelPlacement="outside"
          placeholder="e.g. Filipino"
          variant="bordered"
          radius="lg"
          className="flex-1"
        />

        <Select
          fullWidth
          name="gender"
          id="gender"
          label="Gender"
          labelPlacement="outside"
          radius="lg"
          startContent={<Transgender className="shrink-0 text-default-600" />}
          placeholder="Select gender"
          isRequired
          variant="bordered"
          className="flex-1"
        >
          <SelectItem key="male">Male</SelectItem>
          <SelectItem key="female">Female</SelectItem>
        </Select>
      </div>

      <Input
        isRequired
        startContent={<MailIcon className="shrink-0 text-default-600" />}
        name="email"
        id="email"
        autoComplete="email"
        label="Email"
        labelPlacement="outside"
        placeholder="Enter your email"
        variant="bordered"
        radius="lg"
      />

      <DiditVerification
        guestId={guestId}
        bookingType="function_room"
        onStatusChange={setIsDiditVerified}
      />

      <input type="hidden" name="didit_required" value="true" />

      <p className="text-xs text-[#9f6c1e]">
        Please complete verification before continuing.
      </p>
    </div>
  );
}
