import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Chip,
} from "@heroui/react";
import { Star, MessageSquare, User, BedDouble } from "lucide-react";
import { FeedbackPayload } from "@/types/feedback";
import { formatDate } from "@/utils/format-date";

interface ViewModalProps {
  feedback: FeedbackPayload;
  isOpen: boolean;
  onClose: () => void;
}

const ViewFeedbackModal: React.FC<ViewModalProps> = ({
  feedback,
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="2xl"
      radius="lg"
      className="bg-white dark:bg-gray-900"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 border-b pb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MessageSquare size={20} />
              Guest Feedback Details
            </div>
            <p className="text-sm text-gray-500">
              Review submitted by hotel guest
            </p>
          </ModalHeader>

          <ModalBody className="py-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Guest Information
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium capitalize">{feedback.full_name}</p>
                </div>

                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{feedback.email}</p>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Stay Details
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 capitalize">Room Type</p>
                  <p className="font-medium">{feedback.room_type}</p>
                </div>

                <div>
                  <p className="text-gray-500">Room Number</p>
                  <p className="font-medium">{feedback.room_number}</p>
                </div>

                <div>
                  <p className="text-gray-500">Check-In</p>
                  <p className="font-medium">
                    {formatDate(new Date(feedback.check_in))}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Check-Out</p>
                  <p className="font-medium">
                    {formatDate(new Date(feedback.check_out))}
                  </p>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Rating
              </h3>

              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={
                      index < Number(feedback.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  ({feedback.rating}/5)
                </span>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Guest Feedback
              </h3>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-700 max-h-40 overflow-y-auto">
                {feedback.comments || "No additional comments provided."}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                Recommendation
              </h3>

              <Chip
                size="sm"
                variant="flat"
                color={feedback.recommend === "yes" ? "success" : "danger"}
                className="capitalize"
              >
                {feedback.recommend === "yes"
                  ? "Recommended"
                  : "Not Recommended"}
              </Chip>
            </div>
          </ModalBody>

          <ModalFooter className="border-t">
            <Button variant="bordered" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ViewFeedbackModal;
