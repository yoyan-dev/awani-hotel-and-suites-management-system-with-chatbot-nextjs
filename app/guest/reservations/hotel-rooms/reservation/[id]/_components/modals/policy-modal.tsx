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
import { saveAs } from "file-saver";

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

  const downloadPolicy = async () => {
    try {
      const response = await fetch("/policy/cancellation-policy.pdf");
      const blob = await response.blob();

      saveAs(blob, "Booking-Cancellation-Policy.pdf");
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <>
      <Button
        variant="flat"
        size="sm"
        onPress={() => setIsOpen(true)}
        className="rounded-full bg-[#f2e8d9] text-[#5e5447]"
      >
        Read & Sign Policy
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg">
        <ModalContent className="rounded-3xl border border-[#e3d8c8] bg-[#fffdf8]">
          <ModalHeader className="font-serif text-2xl text-[#281f14]">
            Booking Cancellation Policy
          </ModalHeader>
          <ModalBody className="space-y-4">
            <p className="text-sm text-[#665d50]">
              Please read our declaration carefully and download our Booking
              Cancellation Policy.
            </p>
            <Button
              onPress={downloadPolicy}
              className="rounded-full bg-[#1f1d19] font-semibold text-white hover:bg-[#343028]"
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
              variant="bordered"
              radius="lg"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => setIsOpen(false)}
              className="rounded-full bg-[#f2e8d9] text-[#5e5447]"
            >
              Cancel
            </Button>
            <Button
              isDisabled={!agreed || !signature}
              onPress={handleConfirm}
              className="rounded-full bg-[#b08a53] font-semibold text-white hover:bg-[#9d7948]"
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
