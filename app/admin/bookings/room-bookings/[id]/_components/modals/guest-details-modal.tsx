"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
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
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      size="lg"
      backdrop="blur"
      placement="center"
      scrollBehavior="outside"
      radius="sm"
    >
      <ModalContent className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
        <ModalHeader className="text-center text-lg font-semibold">
          Guest Details
        </ModalHeader>

        <ModalBody className="flex flex-col gap-6">
          {/* Guest Name */}
          <div className=" space-y-1 capitalize">
            <h2 className="text-xl font-semibold">
              {guest?.full_name || "Unknown Guest"}
            </h2>
            {guest?.nationality && (
              <p className="text-sm text-default-500">{guest.nationality}</p>
            )}
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guest?.email && (
              <div className="p-3 rounded-lg bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-600 dark:text-default-400">
                  Email
                </p>
                <p className="font-medium break-all">{guest.email}</p>
              </div>
            )}

            {guest?.contact_number && (
              <div className="p-3 rounded-lg bg-default-100 dark:bg-neutral-800">
                <p className="text-xs text-default-600 dark:text-default-400">
                  Contact
                </p>
                <p className="font-medium">{guest.contact_number}</p>
              </div>
            )}

            {guest?.address && (
              <div className="p-3 rounded-lg bg-default-100 dark:bg-neutral-800 sm:col-span-2">
                <p className="text-xs text-default-600 dark:text-default-400 ">
                  Address
                </p>
                <p className="font-medium capitalize">{guest.address}</p>
              </div>
            )}
          </div>

          {/* Valid ID Section */}
          {(guest?.valid_id?.front || guest?.valid_id?.back) && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-default-700 dark:text-default-300">
                Valid ID
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Front ID */}
                <div className="space-y-1">
                  <p className="text-xs text-default-600 dark:text-default-400">
                    Front
                  </p>
                  {guest?.valid_id?.front ? (
                    <Image
                      src={guest.valid_id.front}
                      alt="Valid ID Front"
                      className="w-full h-[140px] object-cover rounded-md border"
                    />
                  ) : (
                    <div className="h-[140px] flex items-center justify-center rounded-md border text-xs text-default-400">
                      No ID
                    </div>
                  )}
                </div>

                {/* Back ID */}
                <div className="space-y-1">
                  <p className="text-xs text-default-600 dark:text-default-400">
                    Back
                  </p>
                  {guest?.valid_id?.back ? (
                    <Image
                      src={guest.valid_id.back}
                      alt="Valid ID Back"
                      className="w-full h-[140px] object-cover rounded-md border"
                    />
                  ) : (
                    <div className="h-[140px] flex items-center justify-center rounded-md border text-xs text-default-400">
                      No ID
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="justify-center">
          <Button
            color="primary"
            className="rounded-full px-8"
            onPress={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
