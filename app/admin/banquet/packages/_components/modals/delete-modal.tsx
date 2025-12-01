import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { BanquetPackage } from "@/types/banquet";
import { useBanquetPackages } from "@/hooks/use-banquet-packages";

interface DeleteModalProps {
  banquetPackage: BanquetPackage;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  banquetPackage,
  isOpen,
  onClose,
}) => {
  const { isLoading, error, deleteBanquetPackage, fetchBanquetPackages } =
    useBanquetPackages();

  function handleDelete() {
    deleteBanquetPackage(banquetPackage.id || "");
    if (!error) {
      fetchBanquetPackages();
    }
  }

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
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
                  Are you sure you want to delete this item? This action cannot
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
