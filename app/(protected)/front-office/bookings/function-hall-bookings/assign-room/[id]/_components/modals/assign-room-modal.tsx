import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@heroui/react";
import { AlertCircle } from "lucide-react";
import {
  getOccupancyColor,
  OccupancyType,
} from "@/utils/function-room/occupancy";
import { FunctionRoom } from "@/types/function-room";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  room: FunctionRoom | null;
  occupancy: OccupancyType;
  isLoading: boolean;
  onConfirm: () => void;
}

export default function AssignRoomModal({
  isOpen,
  onClose,
  room,
  occupancy,
  isLoading,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader>Confirm Room Assignment</ModalHeader>

        <ModalBody className="flex flex-col gap-3">
          <p>
            Assign Room <strong>#{room?.room_number}</strong> for this booking?
          </p>

          <Chip
            color={getOccupancyColor(occupancy)}
            variant="flat"
            className="w-fit"
          >
            {occupancy}
          </Chip>

          {occupancy === "full occupied" && (
            <div className="flex items-center gap-2 text-warning text-sm">
              <AlertCircle className="w-4 h-4" />
              Room will be marked as fully occupied
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" isLoading={isLoading} onPress={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
