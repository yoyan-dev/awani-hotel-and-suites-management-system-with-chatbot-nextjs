"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Chip,
  Divider,
  Card,
  CardBody,
} from "@heroui/react";
import { User } from "@/types/users";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  User as UserIcon,
} from "lucide-react";

interface ViewModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ user, isOpen, onClose }) => {
  const role = user.app_metadata?.roles?.[0] || "guest";
  const roleColor =
    role === "admin"
      ? "primary"
      : role === "housekeeping"
        ? "warning"
        : "default";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              <h3 className="text-lg font-semibold">User Details</h3>
              <p className="text-small text-default-500">
                View complete user information
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6">
                {/* User Header Card */}
                <Card>
                  <CardBody className="flex flex-row items-center gap-4">
                    <Avatar
                      name={
                        user.user_metadata?.full_name ||
                        user.email?.charAt(0).toUpperCase()
                      }
                      size="lg"
                      className="text-2xl"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold">
                        {user.user_metadata?.full_name || "Unknown User"}
                      </h4>
                      <div className="flex items-center gap-2 text-default-500 mt-1">
                        <Mail size={16} />
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <Chip
                      className="capitalize"
                      color={roleColor}
                      variant="flat"
                      size="md"
                    >
                      <div className="flex items-center gap-1">
                        <Shield size={14} />
                        {role}
                      </div>
                    </Chip>
                  </CardBody>
                </Card>

                <Divider />

                {/* Contact Information */}
                <div>
                  <h5 className="text-sm font-medium text-default-500 mb-3 flex items-center gap-2">
                    <UserIcon size={16} />
                    Contact Information
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-default-50 rounded-lg">
                      <Phone size={18} className="text-primary" />
                      <div>
                        <p className="text-xs text-default-500">Phone</p>
                        <p className="text-sm font-medium">
                          {user.user_metadata?.phone || "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-default-50 rounded-lg">
                      <MapPin size={18} className="text-primary" />
                      <div>
                        <p className="text-xs text-default-500">Address</p>
                        <p className="text-sm font-medium">
                          {user.user_metadata?.address || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h5 className="text-sm font-medium text-default-500 mb-3 flex items-center gap-2">
                    <Calendar size={16} />
                    Personal Information
                  </h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-default-50 rounded-lg">
                      <p className="text-xs text-default-500 mb-1">Gender</p>
                      <Chip
                        className="capitalize"
                        variant="flat"
                        size="sm"
                        color={
                          user.user_metadata?.gender === "male"
                            ? "primary"
                            : user.user_metadata?.gender === "female"
                              ? "danger"
                              : "default"
                        }
                      >
                        {user.user_metadata?.gender || "Not set"}
                      </Chip>
                    </div>
                    <div className="p-3 bg-default-50 rounded-lg">
                      <p className="text-xs text-default-500 mb-1">Birthday</p>
                      <p className="text-sm font-medium">
                        {formatDate(user.user_metadata?.birthday || "")}
                      </p>
                    </div>
                    <div className="p-3 bg-default-50 rounded-lg">
                      <p className="text-xs text-default-500 mb-1">Shift</p>
                      <Chip variant="flat" size="sm">
                        {user.user_metadata?.shift_type || "Not set"}
                      </Chip>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div>
                  <h5 className="text-sm font-medium text-default-500 mb-3 flex items-center gap-2">
                    <Briefcase size={16} />
                    System Information
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-default-50 rounded-lg">
                      <p className="text-xs text-default-500 mb-1">User ID</p>
                      <p className="text-sm font-mono text-default-600 break-all">
                        {user.id}
                      </p>
                    </div>
                    <div className="p-3 bg-default-50 rounded-lg">
                      <p className="text-xs text-default-500 mb-1">Provider</p>
                      <p className="text-sm font-medium">
                        {user.app_metadata?.provider || "email"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose} variant="bordered" color="primary">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewModal;
