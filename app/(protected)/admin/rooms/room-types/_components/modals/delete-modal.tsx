import { Room } from "@/types/room";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { RoomType } from "@/types/room";
import { useRoomTypes } from "@/hooks/use-room-types";

interface DeleteModalProps {
  room: RoomType;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ room, isOpen, onClose }) => {
  const { isLoading, error, fetchRoomTypes, deleteRoomType } = useRoomTypes();

  async function handleDelete() {
    await deleteRoomType(room.id || "");
    if (!error) {
      fetchRoomTypes({});
    }
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        placement="top-center"
        radius="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this room type? This action
                  cannot be undone.
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
