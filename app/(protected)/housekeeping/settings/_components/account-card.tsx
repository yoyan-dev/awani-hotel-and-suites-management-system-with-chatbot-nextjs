"use client";

import { Card, CardBody, CardFooter, Button, Input, Form } from "@heroui/react";
import AccountAvatar from "./account-avatar";
import AccountForm from "./account-form";
import { CameraIcon } from "lucide-react";
import { User, UserFormData } from "@/types/users";

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
              user.user_metadata.image ||
              "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
            }
            name={user.user_metadata.full_name || "Awani User"}
          />
          <Button size="sm" variant="flat" className="mt-4">
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
