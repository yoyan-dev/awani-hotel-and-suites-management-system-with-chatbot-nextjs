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
  Textarea,
} from "@heroui/react";
import { addUser } from "@/features/users/user-thunk";
import { Copyright, Plus } from "lucide-react";
import { useStaff } from "@/hooks/use-staff";

export default function AddModal() {
  const { isLoading, addStaff, error } = useStaff();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await addStaff(formData);
      onClose();
      e.currentTarget.reset();
    } catch (err) {
      console.error("Failed to add user", err);
    } finally {
      if (!error) {
        onClose();
      }
    }
  }

  return (
    <>
      <Button color="primary" endContent={<Plus />} size="sm" onPress={onOpen}>
        Add New Staff
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
                Add New Staff
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

                  <Select radius="sm" label="Role" name="role">
                    {["admin", "housekeeping"].map((role) => (
                      <SelectItem className="capitalize" key={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    radius="sm"
                    variant="bordered"
                    label="Position"
                    name="position"
                  />

                  <Input
                    radius="sm"
                    variant="bordered"
                    type="email"
                    label="Email"
                    name="email"
                  />

                  <Input
                    radius="sm"
                    variant="bordered"
                    type="tel"
                    label="Phone"
                    name="phone"
                  />

                  <Select radius="sm" label="Shift Type" name="shift_type">
                    {["AM", "MID", "PM", "GY"].map((shift) => (
                      <SelectItem key={shift}>{shift}</SelectItem>
                    ))}
                  </Select>

                  <Input
                    radius="sm"
                    variant="bordered"
                    type="password"
                    label="Password"
                    name="password"
                    isRequired
                  />
                  <div className="flex justify-end w-full gap-4">
                    <Button radius="sm" onPress={onClose} variant="bordered">
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
