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
  Input,
  Select,
  SelectItem,
  Textarea,
  Chip,
  Avatar,
  Divider,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateUser, fetchUsers } from "@/features/users/user-thunk";
import { User } from "@/types/users";
import { Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

interface EditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ user, isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.users);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    full_name: user.user_metadata?.full_name || "",
    phone: user.user_metadata?.phone || "",
    gender: user.user_metadata?.gender || "",
    birthday: user.user_metadata?.birthday || "",
    address: user.user_metadata?.address || "",
    shift_type: user.user_metadata?.shift_type || "",
    role: user.app_metadata?.roles?.[0] || "guest",
  });

  // Update form data when user prop changes
  React.useEffect(() => {
    setFormData({
      full_name: user.user_metadata?.full_name || "",
      phone: user.user_metadata?.phone || "",
      gender: user.user_metadata?.gender || "",
      birthday: user.user_metadata?.birthday || "",
      address: user.user_metadata?.address || "",
      shift_type: user.user_metadata?.shift_type || "",
      role: user.app_metadata?.roles?.[0] || "guest",
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedUser: User = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          full_name: formData.full_name,
          phone: formData.phone,
          gender: formData.gender as "male" | "female",
          birthday: formData.birthday,
          address: formData.address,
          shift_type: formData.shift_type as "AM" | "MID" | "PM" | "GY",
        },
        app_metadata: {
          ...user.app_metadata,
          roles: [formData.role as "admin" | "housekeeping" | "guest"],
        },
      };

      await dispatch(updateUser(updatedUser)).unwrap();
      await dispatch(fetchUsers()).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update user", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChange = (
    name: string,
    value: string | "AM" | "MID" | "PM" | "GY",
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="top-center"
      size="2xl"
      onOpenChange={(open) => !open && onClose()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Avatar name={formData.full_name || user.email} size="md" />
                <div>
                  <h3 className="text-lg font-semibold">Edit User</h3>
                  <p className="text-small text-default-500">{user.email}</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <Form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onValueChange={(value) => handleChange("full_name", value)}
                    placeholder="Full name"
                    required
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onValueChange={(value) => handleChange("phone", value)}
                    placeholder="Phone number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Gender"
                    name="gender"
                    selectedKeys={formData.gender ? [formData.gender] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleChange("gender", value);
                    }}
                    placeholder="Select gender"
                  >
                    <SelectItem key="male">Male</SelectItem>
                    <SelectItem key="female">Female</SelectItem>
                  </Select>
                  <Input
                    label="Birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onValueChange={(value) => handleChange("birthday", value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Shift Type"
                    name="shift_type"
                    selectedKeys={
                      formData.shift_type ? [formData.shift_type] : []
                    }
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as
                        | "AM"
                        | "MID"
                        | "PM"
                        | "GY";
                      handleChange("shift_type", value);
                    }}
                    placeholder="Select shift"
                  >
                    <SelectItem key="AM">AM</SelectItem>
                    <SelectItem key="MID">MID</SelectItem>
                    <SelectItem key="PM">PM</SelectItem>
                    <SelectItem key="GY">GY</SelectItem>
                  </Select>
                  <Select
                    label="Role"
                    name="role"
                    selectedKeys={[formData.role]}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handleChange("role", value);
                    }}
                    placeholder="Select role"
                  >
                    <SelectItem key="admin">Admin</SelectItem>
                    <SelectItem key="front_office">Front Office</SelectItem>
                    <SelectItem key="housekeeping">Housekeeping</SelectItem>
                    <SelectItem key="guest">Guest</SelectItem>
                  </Select>
                </div>

                <Textarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  onValueChange={(value) => handleChange("address", value)}
                  placeholder="Address"
                />

                <ModalFooter className="flex justify-end gap-2 w-full px-0">
                  <Button onPress={onClose} variant="bordered">
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isLoading || isSubmitting}
                  >
                    Save Changes
                  </Button>
                </ModalFooter>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
