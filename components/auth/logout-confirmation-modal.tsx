"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { signOut } from "next-auth/react";
import React from "react";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
}: LogoutConfirmationModalProps) {
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/auth" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader>Logout</ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-600">
            Continue logging out of your account?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isSigningOut}>
            Cancel
          </Button>
          <Button color="danger" onPress={handleLogout} isLoading={isSigningOut}>
            Logout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
