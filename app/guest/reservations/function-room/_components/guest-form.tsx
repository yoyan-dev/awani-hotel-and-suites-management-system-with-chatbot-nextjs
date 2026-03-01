"use client";

import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { Flag, Home, MailIcon, Transgender, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import BackIdUpload from "@/app/guest/reservations/_componets/valid-id/back-id-upload";
import FrontIDUpload from "@/app/guest/reservations/_componets/valid-id/front-id-upload";
import PhoneInput from "@/components/input/phone-input";

export default function GuestForm({
  onIdVerificationChange,
}: {
  onIdVerificationChange?: (isVerified: boolean) => void;
}) {
  const [isBackId, setIsBackId] = useState(false);
  const [isFrontId, setIsFrontId] = useState<boolean | null>(false);
  const [phone, setPhone] = React.useState("");

  useEffect(() => {
    onIdVerificationChange?.(isBackId && Boolean(isFrontId));
  }, [isBackId, isFrontId, onIdVerificationChange]);

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-xl font-semibold">Guest Information</h1>

      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Personal Information
      </h3>
      <div className="flex flex-col gap-4 md:flex-row justify-between w-full">
        <Input
          isRequired
          fullWidth
          color="primary"
          startContent={
            <User className="text-default-600 dark:text-default-300 shrink-0" />
          }
          name="full_name"
          id="full_name"
          label="Full Name"
          labelPlacement="outside"
          placeholder="Enter your full name"
          variant="bordered"
          className="flex-1"
        />
        <PhoneInput
          value={phone}
          onChange={setPhone}
          placeholder="Enter guest contact number"
        />
      </div>

      <Textarea
        isRequired
        color="primary"
        startContent={
          <Home className="text-default-600 dark:text-default-300 shrink-0" />
        }
        name="address"
        id="address"
        label="Home Address"
        labelPlacement="outside"
        placeholder="Enter your current home address"
        variant="bordered"
      />

      <div className="flex flex-col gap-4 md:flex-row justify-between w-full">
        <Input
          fullWidth
          isRequired
          color="primary"
          startContent={
            <Flag className="text-default-600 dark:text-default-300 shrink-0" />
          }
          name="nationality"
          id="nationality"
          label="Nationality"
          labelPlacement="outside"
          placeholder="e.g. Filipino"
          variant="bordered"
          className="flex-1"
        />

        <Select
          fullWidth
          name="gender"
          id="gender"
          color="primary"
          label="Gender"
          labelPlacement="outside"
          radius="sm"
          startContent={
            <Transgender className="text-default-600 dark:text-default-300 shrink-0" />
          }
          placeholder="Select gender"
          isRequired
          variant="bordered"
          className="flex-1"
        >
          <SelectItem key="male">Male</SelectItem>
          <SelectItem key="female">Female</SelectItem>
        </Select>
      </div>

      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        Upload your valid ID
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        We respect your privacy. Your ID will be used only for identity
        verification, stored securely, and will not be shared without your
        consent.
      </p>

      <FrontIDUpload setIsFrontId={setIsFrontId} />
      <BackIdUpload setIsBackId={setIsBackId} />

      <Input
        isRequired
        color="primary"
        startContent={
          <MailIcon className="text-default-600 dark:text-default-300 shrink-0" />
        }
        name="email"
        id="email"
        autoComplete="email"
        label="Email"
        labelPlacement="outside"
        placeholder="Enter your email"
        variant="bordered"
      />

      {!isBackId || !Boolean(isFrontId) ? (
        <p className="text-xs text-warning">
          Please upload and verify both front and back ID images to continue.
        </p>
      ) : null}
    </div>
  );
}
