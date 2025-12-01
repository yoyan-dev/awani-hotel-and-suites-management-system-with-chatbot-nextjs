"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  User,
  Image,
} from "@heroui/react";
import { Guest } from "@/types/guest";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest;
}

export default function GuestModal({
  isOpen,
  onClose,
  guest,
}: GuestModalProps) {
  console.log(guest);
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      backdrop="blur"
      placement="center"
    >
      <ModalContent className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
        <ModalHeader className="flex flex-col gap-1 text-center">
          Guest Details
        </ModalHeader>
        <ModalBody className="flex flex-col items-center gap-4">
          <Image
            src={
              guest?.image || " https://i.pravatar.cc/150?u=a04258114e29026702d"
            }
            className="w-28 h-28 text-large border-4 border-primary rounded-full shadow-md"
          />
          <div className="w-full space-y-1 text-center">
            <h2 className="text-xl font-semibold">{guest?.full_name}</h2>
            {guest?.nationality && (
              <p className="text-sm text-default-500">{guest?.nationality}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {guest?.email && (
              <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-400">Email</p>
                <p className="font-medium">{guest?.email}</p>
              </div>
            )}
            {guest?.contact_number && (
              <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-400">Contact</p>
                <p className="font-medium">{guest?.contact_number}</p>
              </div>
            )}
            {guest?.address && (
              <div className="p-3 rounded-xl bg-default-100 dark:bg-neutral-800 sm:col-span-2">
                <p className="text-xs text-default-400">Address</p>
                <p className="font-medium">{guest?.address}</p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            color="primary"
            variant="solid"
            className="rounded-full px-6"
            onPress={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
