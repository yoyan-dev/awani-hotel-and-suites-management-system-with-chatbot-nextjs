import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
} from "@heroui/react";
import React, { useState } from "react";

interface PolicyModalProps {
  onConfirm: (signature: string) => void;
}

export default function PolicyModal({ onConfirm }: PolicyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("");

  const handleConfirm = () => {
    onConfirm(signature);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        color="primary"
        variant="flat"
        size="sm"
        onPress={() => setIsOpen(true)}
      >
        Read & Sign Policy
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg">
        <ModalContent>
          <ModalHeader>Booking Cancellation Policy</ModalHeader>
          <ModalBody className="space-y-4">
            <p className="text-sm text-gray-600">
              Please read our declaration carefully and download our Booking
              Cancellation Policy.
            </p>
            <Button
              as="a"
              href="policy/cancellation-policy.pdf"
              color="secondary"
              download
            >
              Download Booking Cancellation Policy
            </Button>
            <Checkbox isSelected={agreed} onValueChange={setAgreed}>
              I have read and agree to the Booking Cancellation Policy
            </Checkbox>
            <Input
              label="Signature (type your full name)"
              placeholder="Type your name here"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!agreed || !signature}
              onPress={handleConfirm}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
