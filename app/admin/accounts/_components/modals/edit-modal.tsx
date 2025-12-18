"use client";

import React from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addUser } from "@/features/users/user-thunk";
import { Plus } from "lucide-react";
import { User } from "@/types/users";

interface EditModalProps {
  user: User;
}

const EditModal: React.FC<EditModalProps> = ({ user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.users);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      //   await dispatch(addUser(formData));
      onClose();
      e.currentTarget.reset();
    } catch (err) {
      console.error("Failed to add user", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div onClick={onOpen} className="text-success">
        Edit
      </div>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit User</ModalHeader>
              <ModalBody>
                <Form className="space-y-4" onSubmit={onSubmit}>
                  {/* <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="User email"
                      required
                    />
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                    />
                  </div> */}

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      value={user.user_metadata.full_name}
                      name="name"
                      placeholder="Full name"
                      required
                    />
                    <Input
                      label="Phone"
                      name="phone"
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Gender"
                      name="gender"
                      placeholder="Select gender"
                    >
                      <SelectItem key="male">Male</SelectItem>
                      <SelectItem key="female">Female</SelectItem>
                    </Select>
                    <Input label="Birthday" name="birthday" type="date" />
                  </div>

                  <Textarea
                    label="Address"
                    name="address"
                    placeholder="Address"
                  />

                  {/* <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Emergency Contact Name"
                      name="emergency_name"
                      placeholder="Emergency contact name"
                    />
                    <Input
                      label="Emergency Contact Phone"
                      name="emergency_phone"
                      placeholder="Emergency contact phone"
                    />
                  </div> */}

                  <Select label="Role" name="roles" placeholder="Select role">
                    <SelectItem key="admin">Admin</SelectItem>
                    <SelectItem key="front_office">Front Office</SelectItem>
                    <SelectItem key="housekeeping">Housekeeping</SelectItem>
                    <SelectItem key="guest">Guest</SelectItem>
                  </Select>

                  <ModalFooter className="flex justify-end gap-2 w-full">
                    <Button onPress={onClose} variant="bordered">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" isLoading={isLoading}>
                      Save
                    </Button>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditModal;
