import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Image,
  ModalFooter,
} from "@heroui/react";
import { RoomType } from "@/types/room";
import { formatPHP } from "@/lib/format-php";
import { Copyright } from "lucide-react";
import RoomTypeAmenities from "@/components/room-type-amenities";
interface ViewModalProps {
  room: RoomType;
  isOpen: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<ViewModalProps> = ({ room, isOpen, onClose }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        placement="top-center"
        radius="sm"
        scrollBehavior="outside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 w-full bg-primary text-white">
                {room.name}
              </ModalHeader>
              <ModalBody>
                <div className="pb-4 space-y-8">
                  <div className="flex flex-col items-start gap-2">
                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                      {(room.images && room.images.length > 0
                        ? room.images
                        : room.image
                          ? [room.image]
                          : ["/bg-awani.jpg"]
                      ).map((src, index) => (
                        <Image
                          key={`${src}-${index}`}
                          src={src}
                          alt={`room image ${index + 1}`}
                          width="100%"
                          height={200}
                          radius="sm"
                        />
                      ))}
                    </div>
                    <p className="text-xl font-semibold text-primary">
                      {formatPHP(Number(room.price))}
                    </p>
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
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Amenities</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                        Included guest-facing amenities for {room.name}
                      </p>
                      <RoomTypeAmenities amenities={room.amenities} />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Room Add Ons</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Available add ons for {room.name}
                      </p>
                      <div className="flex gap-4 text-gray-700 flex-wrap">
                        {room.room_type_add_ons &&
                        room.room_type_add_ons.length > 0
                          ? room.room_type_add_ons.map((item: any) => (
                              <div
                                className="flex items-center gap-2"
                                key={item.id ?? item.add_on?.id}
                              >
                                {item.add_on?.name} -{" "}
                                {formatPHP(Number(item.add_on?.price || 0))}{" "}
                                (limit {item.quantity_limit})
                              </div>
                            ))
                          : "no add ons"}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin">
                <Copyright size={10} /> Alright reserved Ma. Awani.
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewModal;
