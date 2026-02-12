"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Inventory } from "@/types/inventory";
import { useInventory } from "@/hooks/use-inventory";
import { RoomReport } from "@/types/room-report";
import { useRoomReports } from "@/hooks/use-room-reports";

interface DeleteModalProps {
  roomReport: RoomReport;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  roomReport,
  isOpen,
  onClose,
}) => {
  const { isLoading, fetchRoomReports, deleteRoomReport } = useRoomReports();

  async function handleDelete() {
    await deleteRoomReport(roomReport.id!);
    await fetchRoomReports({});
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Delete
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this reports? This action
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
