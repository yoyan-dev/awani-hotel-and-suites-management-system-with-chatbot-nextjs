"use client";

import { Card, CardBody, CardFooter, Button, Input, Form } from "@heroui/react";
import AccountAvatar from "./account-avatar";
import AccountForm from "./account-form";
import { CameraIcon } from "lucide-react";
import { User, UserFormData } from "@/types/users";
import React from "react";

export default function AccountCard({
  user,
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: {
  user: User;
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSubmit: (e: any, formData: UserFormData) => void;
  isLoading: boolean;
}) {
  const [previewImage, setPreviewImage] = React.useState<string>(
    user.user_metadata.image || "",
  );

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Card
      as={Form}
      onSubmit={(e) => onSubmit(e, formData)}
      className="max-w-xl p-4 mx-auto shadow-lg rounded-xl border border-gray-100 dark:border-gray-800"
    >
      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-col  items-center mb-4">
          <AccountAvatar
            image={
              previewImage ||
              "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
            }
            name={user.user_metadata.full_name || "Awani User"}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            name="image"
            id="file-upload"
          />
          <Button
            size="sm"
            variant="flat"
            className="mt-4"
            onPress={() => document.getElementById("file-upload")?.click()}
          >
            <CameraIcon /> Change Profile
          </Button>
        </div>
        <AccountForm formData={formData} setFormData={setFormData} />
      </CardBody>

      <CardFooter className="justify-end border-t border-gray-100 dark:border-gray-800 pt-3">
        <Button color="primary" size="sm" type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
