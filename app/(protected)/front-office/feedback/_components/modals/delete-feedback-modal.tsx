import { useGuestFeedback } from "@/hooks/use-feedback";
import { FeedbackFetchParams } from "@/types/feedback";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { FeedbackPayload } from "@/types/feedback";

interface DeleteModalProps {
  feedback: FeedbackPayload;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteFeedbackModal: React.FC<DeleteModalProps> = ({
  feedback,
  isOpen,
  onClose,
}) => {
  const { isLoading, error, deleteGuestFeedback, fetchGuestFeedbacks } =
    useGuestFeedback();

  function handleDelete() {
    deleteGuestFeedback(feedback.id || "");
    if (!error) {
      fetchGuestFeedbacks({} as FeedbackFetchParams);
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
                  Are you sure you want to delete this feedback? This action
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

export default DeleteFeedbackModal;
