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
import { Ruler, UsersRound } from "lucide-react";

interface ViewModalProps {
  room: RoomType;
}

const ViewModal: React.FC<ViewModalProps> = ({ room }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        variant="flat"
        size="sm"
        onPress={onOpen}
        className="rounded-full bg-[#f2e8d9] text-[#5e5447]"
      >
        View room details
      </Button>

      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="outside"
      >
        <ModalContent className="rounded-3xl border border-[#e3d8c8] bg-[#fffdf8]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-[#eadfce] bg-[#fcf7ef]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#987345]">
                  Room Preview
                </p>
                <h3 className="font-serif text-3xl capitalize text-[#261f14]">
                  {room.name}
                </h3>
              </ModalHeader>

              <ModalBody className="space-y-5 py-5">
                <div className="grid gap-2 overflow-hidden rounded-2xl border border-[#e7dccd] p-2 sm:grid-cols-2">
                  {(room.images && room.images.length > 0
                    ? room.images
                    : room.image
                      ? [room.image]
                      : ["/bg-awani.jpg"]
                  ).map((src, index) => (
                    <Image
                      key={`${src}-${index}`}
                      src={src}
                      alt={`${room.name} image ${index + 1}`}
                      width="100%"
                      className="h-[180px] w-full object-cover"
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-[#6b6153]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1e6d5] px-3 py-1.5">
                    <UsersRound size={14} />
                    Max {room.max_guest || 1} guests
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1e6d5] px-3 py-1.5">
                    <Ruler size={14} />
                    {room.room_size}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[#665d50]">
                  {room.description}
                </p>

                <div className="rounded-2xl border border-[#e8ddcc] bg-[#fcf8f2] p-4">
                  <h4 className="font-serif text-xl text-[#271f14]">
                    Room Add-ons
                  </h4>
                  <p className="mb-3 text-xs text-[#7a6f62]">
                    Available add-ons for {room.name}
                  </p>
                  <div className="space-y-2 text-sm text-[#5f5548]">
                    {room.room_type_add_ons &&
                    room.room_type_add_ons.length > 0 ? (
                      room.room_type_add_ons.map((item: any) => (
                        <div
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#eadfce] bg-white dark:bg-[#1b1510] px-3 py-2"
                          key={item.id ?? item.add_on?.id}
                        >
                          <span>{item.add_on?.name}</span>
                          <span className="font-medium text-[#2d2418]">
                            {formatPHP(Number(item.add_on?.price || 0))}{" "}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#7a6f62]">
                        No add-ons available.
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xl font-semibold text-[#9c7645]">
                  {formatPHP(Number(room.price))} / night
                </p>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="rounded-full bg-[#f2e8d9] text-[#5e5447]"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewModal;
