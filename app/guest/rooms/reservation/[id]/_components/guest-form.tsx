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
import React from "react";

export default function GuestForm({
  guestId,
  setGuestId,
}: {
  guestId: string | null;
  setGuestId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { guest, isLoading, fetchGuest, addGuest, updateGuest } = useGuests();
  const [previewFront, setPreviewFront] = React.useState<string | null>(null);
  const [previewBack, setPreviewBack] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let id = crypto.randomUUID();
    formData.append("id", id);

    await addGuest(formData);
    if (guest) {
      setGuestId(guest.id);
    }
    console.log(guest);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl border border-gray-100 dark:border-gray-700">
      <CardHeader className="text-xl font-semibold">
        📝 Guest Information
      </CardHeader>
      <CardBody className=" dark:bg-gray-900">
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <Input
              fullWidth
              isRequired
              color="primary"
              startContent={
                <Contact className="text-default-600 dark:text-default-300 shrink-0" />
              }
              name="contact_number"
              id="contact_number"
              label="Contact Number"
              labelPlacement="outside"
              placeholder="e.g. +63 912 345 6789"
              variant="bordered"
              className="flex-1"
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

          {/*Front */}
          <div className="w-full">
            <span>Front</span>
            <label
              htmlFor="image-upload-front"
              className="p-2 w-full min-h-40 sm:h-32 rounded-md border-2 border-dashed border-gray-300 flex justify-center items-center bg-gray-50 cursor-pointer hover:border-primary transition"
            >
              {previewFront ? (
                <Image
                  src={previewFront}
                  radius="none"
                  className="h-40 sm:h-32 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <CloudDownloadIcon size={28} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Click or drag to upload photo
                  </span>
                </div>
              )}
            </label>

            <input
              id="image-upload-front"
              type="file"
              accept="image/*"
              className="hidden"
              name="front"
              onChange={(e) => setPreviewFront(handleFileChange(e))}
            />
          </div>

          {/*Back */}
          <div className="w-full">
            <span>Back</span>
            <label
              htmlFor="image-upload-back"
              className="p-2 w-full min-h-40 sm:h-32 rounded-md border-2 border-dashed border-gray-300 flex justify-center items-center bg-gray-50 cursor-pointer hover:border-primary transition"
            >
              {previewBack ? (
                <Image
                  src={previewBack}
                  radius="none"
                  className="h-40 sm:h-32 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <CloudDownloadIcon size={28} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Click or drag to upload photo
                  </span>
                </div>
              )}
            </label>

            <input
              id="image-upload-back"
              type="file"
              accept="image/*"
              className="hidden"
              name="back"
              onChange={(e) => setPreviewBack(handleFileChange(e))}
            />
          </div>

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

          <Button
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
