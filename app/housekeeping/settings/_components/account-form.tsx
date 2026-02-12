"use client";

import { User, UserFormData } from "@/types/users";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React from "react";

export default function AccountForm({
  formData,
  setFormData,
}: {
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
}) {
  const [isChangedPassword, setIsChangedPassword] = React.useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <div className="grid gap-4 mt-4">
      <Input
        variant="bordered"
        labelPlacement="outside"
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Enter full name"
        size="md"
      />

      <Input
        variant="bordered"
        labelPlacement="outside"
        label="Email"
        value={formData.email}
        name="email"
        onChange={handleChange}
        placeholder="Enter email"
        size="md"
      />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Change Password
          </h3>
          <Button
            color="primary"
            size="sm"
            variant="light"
            onPress={() => setIsChangedPassword(!isChangedPassword)}
          >
            {isChangedPassword ? "Cancel" : "Change Pasword?"}
          </Button>
        </div>
        {isChangedPassword ? (
          <div className="mt-4">
            <Input
              label="Current Password"
              type="password"
              className="pt-4"
              labelPlacement="outside"
              placeholder="Enter current password"
              size="md"
              variant="bordered"
              value={formData.current_password}
              name="current_password"
              onChange={handleChange}
            />
            <Input
              label="New Password"
              type="password"
              className="pt-4"
              labelPlacement="outside"
              placeholder="Enter new password"
              size="md"
              variant="bordered"
              value={formData.new_password}
              name="new_password"
              onChange={handleChange}
            />
            <Input
              label="Confirm New Password"
              type="password"
              className="pt-4"
              labelPlacement="outside"
              placeholder="Confirm new password"
              size="md"
              variant="bordered"
              value={formData.confirm_password}
              name="confirm_password"
              onChange={handleChange}
              isInvalid={formData.confirm_password !== formData.new_password}
              errorMessage={
                formData.confirm_password !== formData.new_password
                  ? "Passwords do not match"
                  : undefined
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
