"use client";

import { handleFileChange } from "@/app/utils/image-file-handler";
import { useGuests } from "@/hooks/use-guests";
import { Input, Textarea } from "@heroui/input";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Image,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Camera,
  CloudDownloadIcon,
  Contact,
  Flag,
  MailIcon,
  Transgender,
  User,
  Home,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import FrontIDUpload from "../../../../_componets/valid-id/front-id-upload";
import BackIDUpload from "../../../../_componets/valid-id/back-id-upload";
import { isValidPhoneNumber } from "@/utils/mobile-number-validator";
import PhoneInput from "@/components/input/phone-input";

export default function GuestForm({
  guestId,
  setGuestId,
}: {
  guestId: string | null;
  setGuestId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { isLoading, addGuest } = useGuests();
  const [isBackId, setIsBackId] = useState<boolean>(false);
  const [isFrontId, setIsFrontId] = useState<boolean | null>(false);
  const [phone, setPhone] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let id = crypto.randomUUID();
    formData.append("id", id);

    await addGuest(formData);
    setGuestId(id);
    console.log(id);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl border border-gray-100 dark:border-gray-700">
      <CardHeader className="text-xl font-semibold">
        📝 Guest Information
      </CardHeader>
      <CardBody className="dark:bg-gray-900">
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Personal Info */}
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

          {/* Upload ID */}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Upload your valid ID
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            We respect your privacy. Your ID will be used only for identity
            verification, stored securely, and will not be shared without your
            consent.
          </p>

          {/* Front ID upload */}
          <FrontIDUpload setIsFrontId={setIsFrontId} />

          {/* Back ID upload */}
          <BackIDUpload setIsBackId={setIsBackId} />

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

          {guestId}
          <Button
            isDisabled={!isBackId || !isFrontId}
            type="submit"
            color="primary"
            radius="sm"
            fullWidth
            isLoading={isLoading}
          >
            Next
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
