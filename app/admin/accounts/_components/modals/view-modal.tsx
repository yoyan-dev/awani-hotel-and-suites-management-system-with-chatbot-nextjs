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
import { User } from "@/types/users";

interface ViewModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ user, isOpen, onClose }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={(open) => !open && onClose()}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit User</ModalHeader>
              <ModalBody></ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewModal;
