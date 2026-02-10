import { Room, RoomStatus } from "@/types/room";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useRooms } from "@/hooks/use-rooms";
import { statusOptions } from "@/app/constants/rooms";
import React from "react";
import { useNotification } from "@/hooks/use-notification";
import { Notification } from "@/types/notification";

interface UpdateRoomProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateRoomProps> = ({ room, isOpen, onClose }) => {
  const { isLoading, updateRoom, fetchRooms } = useRooms();
  const { addNotification } = useNotification();
  const [formData, setFormData] = React.useState<Room>(room);

  async function handleSubmit() {
    await updateRoom({
      id: room.id,
      status: formData.status || room.status,
      remarks: formData.remarks,
    });
    await addNotification({
      title: `Room ${room.room_number} Status Updated`,
      message: `Housekeeping updated room status for room ${room.room_number} to ${formData.status}`,
      type: "update",
    } as Notification);
    fetchRooms(null);
  }
  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Status
              </ModalHeader>
              <ModalBody>
                <Select
                  label="Room Status"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Select room status"
                  fullWidth
                  isLoading={isLoading}
                  size="sm"
                  radius="sm"
                  defaultSelectedKeys={[formData.status || ""]}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as RoomStatus,
                    })
                  }
                  items={statusOptions}
                >
                  {(item) => (
                    <SelectItem key={item.uid}>{item.name}</SelectItem>
                  )}
                </Select>
                <Textarea
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remarks: e.target.value,
                    })
                  }
                  value={formData.remarks}
                  radius="sm"
                  fullWidth
                  label="Remarks"
                  placeholder="Enter your remarks"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateModal;
