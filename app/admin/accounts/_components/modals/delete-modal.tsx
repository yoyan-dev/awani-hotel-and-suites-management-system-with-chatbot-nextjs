import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { deleteUser } from "@/features/users/user-thunk";
import { User } from "@/types/users";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  user: User;
  trigger?: React.ReactNode;
}

export default function DeleteModal({ user, trigger }: DeleteModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.users.isLoading);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleDelete() {
    dispatch(deleteUser(user.id));
    onOpenChange();
  }

  return (
    <>
      {trigger ? (
        <div onClick={onOpen} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <Button
          onPress={onOpen}
          variant="flat"
          isIconOnly
          color="danger"
          size="sm"
        >
          <Trash2 size={16} />
        </Button>
      )}
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-danger">
                  <AlertTriangle size={24} />
                  <span>Confirm Delete</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Are you sure you want to delete user{" "}
                  <strong>{user.user_metadata?.full_name || user.email}</strong>
                  ? This action cannot be undone.
                </p>
                <div className="bg-danger-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-danger">
                    <strong>Warning:</strong> This will permanently delete the
                    user account and all associated data.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isLoading}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
