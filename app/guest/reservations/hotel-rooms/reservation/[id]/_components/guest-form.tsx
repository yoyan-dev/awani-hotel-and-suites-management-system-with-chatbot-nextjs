"use client";

import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { Flag, Home, MailIcon, Transgender, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import FrontIDUpload from "../../../../_componets/valid-id/front-id-upload";
import BackIDUpload from "../../../../_componets/valid-id/back-id-upload";
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

      <h3 className="text-sm font-medium text-[#675d50]">
        Upload your valid ID
      </h3>
      <p className="text-xs text-[#6a6052]">
        We respect your privacy. Your ID will be used only for identity
        verification, stored securely, and will not be shared without your
        consent.
      </p>

      <FrontIDUpload setIsFrontId={setIsFrontId} />
      <BackIDUpload setIsBackId={setIsBackId} />

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

      {!isBackId || !Boolean(isFrontId) ? (
        <p className="text-xs text-[#9f6c1e]">
          Please upload and verify both front and back ID images to continue.
        </p>
      ) : null}
    </div>
  );
}
