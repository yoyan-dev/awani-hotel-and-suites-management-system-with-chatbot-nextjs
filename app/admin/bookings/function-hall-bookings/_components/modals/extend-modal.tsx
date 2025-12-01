import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Booking } from "@/types/booking";
import React from "react";

interface ExtendModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

const ExtendModal: React.FC<ExtendModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [extendedDate, setExtendedDate] = React.useState<string>(
    booking.check_out
  );

  React.useEffect(() => {
    setExtendedDate(booking.check_out);
  }, [booking.check_out]);

  const isInvalid = React.useMemo(() => {
    if (!extendedDate) return false;
    return booking.check_out > extendedDate;
  }, [booking.check_out, extendedDate]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Extend Stay</ModalHeader>
              <ModalBody>
                {isInvalid && (
                  <span className="text-warning">
                    Date must be ahead on the check out date
                  </span>
                )}
                <Input
                  isInvalid={isInvalid}
                  fullWidth
                  value={extendedDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setExtendedDate(e.target.value)
                  }
                  variant="bordered"
                  radius="none"
                  isRequired
                  type="date"
                  label="Check-out Date"
                  name="check_out"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  cancel
                </Button>
                <Button variant="light" color="primary" isDisabled={isInvalid}>
                  submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExtendModal;
