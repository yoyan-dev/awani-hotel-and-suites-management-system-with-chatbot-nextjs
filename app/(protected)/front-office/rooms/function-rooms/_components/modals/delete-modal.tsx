import { Room } from "@/types/room";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useRooms } from "@/hooks/use-rooms";
import { FunctionRoom } from "@/types/function-room";
import { useFunctionRooms } from "@/hooks/use-function-rooms";

interface DeleteModalProps {
  room: FunctionRoom;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ room, isOpen, onClose }) => {
  const { isLoading, deleteFunctionRoom, fetchFunctionRooms } =
    useFunctionRooms();

  async function handleDelete() {
    await deleteFunctionRoom(room.id || "");
    fetchFunctionRooms(null);
  }
  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Room
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this room? This action cannot
                  be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  No
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isLoading}
                >
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
