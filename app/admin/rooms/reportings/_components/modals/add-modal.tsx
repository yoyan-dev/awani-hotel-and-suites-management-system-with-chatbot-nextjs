"use client";

import React from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useRoomReports } from "@/hooks/use-room-reports";
import { useNotification } from "@/hooks/use-notification";
import { Notification } from "@/types/notification";

export default function AddRoomReportModal() {
  const { isLoading, error, addRoomReport } = useRoomReports();
  const { addNotification } = useNotification();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const room_number = data.get("room_number");
    const report_type = data.get("report_type");

    addRoomReport(data);
    await addNotification({
      title: `Room ${room_number} reported`,
      message: `Housekeeping reported room ${room_number} reported for ${report_type}`,
      type: "update",
    } as Notification);
  }

  return (
    <>
      <Button color="primary" endContent={<Plus />} size="sm" onPress={onOpen}>
        Add Report
      </Button>

      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        radius="lg"
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="bg-primary text-white text-lg font-semibold">
                Add Room Report
              </ModalHeader>
              <ModalBody>
                <Form className="w-full space-y-4" onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <Input
                      fullWidth
                      label="Room Number"
                      name="room_number"
                      placeholder="e.g. 101A"
                      variant="bordered"
                      radius="sm"
                      labelPlacement="outside"
                      required
                    />

                    <Input
                      fullWidth
                      label="Guest Name"
                      name="guest_name"
                      placeholder="Guest full name"
                      variant="bordered"
                      radius="sm"
                      labelPlacement="outside"
                    />

                    <Select
                      fullWidth
                      label="Report Type"
                      name="report_type"
                      placeholder="Select type"
                      variant="bordered"
                      radius="sm"
                      defaultSelectedKeys={["lost"]}
                    >
                      <SelectItem key="lost">Lost</SelectItem>
                      <SelectItem key="damaged">Damaged</SelectItem>
                      <SelectItem key="audit">Audit</SelectItem>
                      <SelectItem key="incident">Incident</SelectItem>
                    </Select>

                    <Select
                      fullWidth
                      label="Reported By"
                      name="reported_by"
                      placeholder="Guest or Staff"
                      variant="bordered"
                      radius="sm"
                      defaultSelectedKeys={["staff"]}
                    >
                      <SelectItem key="guest">Guest</SelectItem>
                      <SelectItem key="staff">Staff</SelectItem>
                    </Select>

                    <Input
                      fullWidth
                      label="Item Name"
                      name="item_name"
                      placeholder="e.g. Hairdryer"
                      variant="bordered"
                      radius="sm"
                      labelPlacement="outside"
                      required
                    />

                    <Select
                      fullWidth
                      label="Item Category"
                      name="item_category"
                      placeholder="Select category"
                      variant="bordered"
                      radius="sm"
                      defaultSelectedKeys={["other"]}
                    >
                      <SelectItem key="furniture">Furniture</SelectItem>
                      <SelectItem key="electronics">Electronics</SelectItem>
                      <SelectItem key="linen">Linen</SelectItem>
                      <SelectItem key="decor">Decor</SelectItem>
                      <SelectItem key="other">Other</SelectItem>
                    </Select>

                    <Input
                      fullWidth
                      label="Quantity"
                      name="quantity"
                      type="number"
                      placeholder="1"
                      variant="bordered"
                      radius="sm"
                      min={1}
                    />

                    <Select
                      fullWidth
                      label="Damage Type"
                      name="damage_type"
                      placeholder="Select damage type"
                      variant="bordered"
                      radius="sm"
                      defaultSelectedKeys={["none"]}
                    >
                      <SelectItem key="none">None</SelectItem>
                      <SelectItem key="broken">Broken</SelectItem>
                      <SelectItem key="stained">Stained</SelectItem>
                      <SelectItem key="scratched">Scratched</SelectItem>
                      <SelectItem key="missing">Missing</SelectItem>
                    </Select>

                    <Select
                      fullWidth
                      label="Status"
                      name="status"
                      placeholder="Select status"
                      variant="bordered"
                      radius="sm"
                      defaultSelectedKeys={["pending"]}
                    >
                      <SelectItem key="pending">Pending</SelectItem>
                      <SelectItem key="in_progress">In Progress</SelectItem>
                      <SelectItem key="resolved">Resolved</SelectItem>
                      <SelectItem key="returned">Returned</SelectItem>
                    </Select>
                  </div>

                  <Textarea
                    label="Notes / Remarks"
                    name="notes"
                    placeholder="Additional details"
                    variant="bordered"
                    radius="sm"
                  />

                  <div className="flex justify-end gap-3 pt-4 w-full">
                    <Button onPress={onClose} variant="bordered" radius="sm">
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      isLoading={isLoading}
                      radius="sm"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
