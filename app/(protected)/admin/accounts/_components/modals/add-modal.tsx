"use client";

import React from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { Copyright, Plus } from "lucide-react";
import { useUsers } from "@/hooks/use-users";

export default function AddModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { addUser, fetchUsers, isLoading } = useUsers();
  const [confirmPassword, setConfirmPassword] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") || "");

    if (password !== confirmPassword) {
      addToast({
        title: "Validation Error",
        description: "Password and confirm password do not match.",
        color: "warning",
      });
      return;
    }

    try {
      const resultAction = await addUser(formData);
      if (resultAction.meta.requestStatus !== "fulfilled") {
        return;
      }
      await fetchUsers();
      onClose();
      form.reset();
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to add user", err);
    }
  }

  return (
    <>
      <Button color="primary" endContent={<Plus />} size="sm" onPress={onOpen}>
        Add New User
      </Button>

      <Modal
        scrollBehavior="outside"
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="w-full bg-primary text-white">
                Add New User
              </ModalHeader>
              <ModalBody>
                <Form className="space-y-4" onSubmit={onSubmit}>
                  <Input
                    radius="sm"
                    variant="bordered"
                    label="Full Name"
                    name="full_name"
                    required
                  />

                  <Select
                    radius="sm"
                    label="System Role"
                    name="roles"
                    variant="bordered"
                    defaultSelectedKeys={["housekeeping"]}
                    isRequired
                  >
                    {["admin", "housekeeping", "front_office"].map((role) => (
                      <SelectItem className="capitalize" key={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    radius="sm"
                    variant="bordered"
                    type="email"
                    label="Email"
                    name="email"
                    isRequired
                  />

                  <Input
                    radius="sm"
                    variant="bordered"
                    type="password"
                    label="Password"
                    name="password"
                    isRequired
                  />
                  <Input
                    radius="sm"
                    variant="bordered"
                    type="password"
                    label="Confirm Password"
                    isRequired
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                  />
                  <div className="flex justify-end w-full gap-4">
                    <Button
                      radius="sm"
                      onPress={onClose}
                      variant="bordered"
                      isDisabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      radius="sm"
                      color="primary"
                      type="submit"
                      isLoading={isLoading}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin">
                <Copyright size={10} /> Alright reserved Ma. Awani.
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
