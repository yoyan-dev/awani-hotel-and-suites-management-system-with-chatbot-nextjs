import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@heroui/react";
import { RoomType } from "@/types/room";
import { formatPHP } from "@/lib/format-php";
import { Bed, Tv, UserCircle, Wifi } from "lucide-react";
interface ViewModalProps {
  room: RoomType;
}

const ViewModal: React.FC<ViewModalProps> = ({ room }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <div onClick={onOpen}>View room details.</div>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {room.name}
              </ModalHeader>
              <ModalBody>
                <div className="pb-4 space-y-8">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex gap-2 overflow-x-auto">
                      <Image src={room.image} alt="room image" width="100%" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Max guest {room.max_guest || 1}
                    </span>
                    <div className="flex justify-between items-center flex-wrap  w-full">
                      <div className="flex gap-2">
                        <h2 className="text-2xl font-semibold capitalize">
                          {room.name}
                        </h2>
                        <span className="text-gray-500 dark:text-gray-300 ">
                          ({room.room_size})
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">
                      {room.description}
                    </p>
                    <p className="text-xl font-semibold text-primary">
                      {formatPHP(Number(room.price))}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Room Add Ons</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Available add ons for {room.name}
                      </p>
                      <div className="flex gap-4 text-gray-700 flex-wrap">
                        {room.add_ons && room.add_ons.length > 0
                          ? room.add_ons.map((item: any) => (
                              <div
                                className="flex items-center gap-2"
                                key={item.name}
                              >
                                {item.name} - {formatPHP(Number(item.price))}
                              </div>
                            ))
                          : "no add ons"}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewModal;
