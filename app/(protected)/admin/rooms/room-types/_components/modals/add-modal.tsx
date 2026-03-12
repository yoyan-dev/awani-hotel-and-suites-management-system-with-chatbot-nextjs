import React, { useState } from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  Textarea,
  ModalFooter,
} from "@heroui/react";
import { Copyright, Plus, Upload, X } from "lucide-react";
import AddOnsInput from "../add-ons-input";
import { useRoomTypes } from "@/hooks/use-room-types";
import { RoomTypeAddOnFormRow } from "../add-ons-input";

export default function AddModal() {
  const { isLoading, error, addRoomType } = useRoomTypes();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [addOns, setAddOns] = useState<RoomTypeAddOnFormRow[]>([]);
  const [previews, setPreviews] = useState<Array<{ file: File; url: string }>>(
    [],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.delete("images");
    previews.forEach((item) => formData.append("images", item.file));
    formData.append("room_type_add_ons", JSON.stringify(addOns));

    await addRoomType(formData);
    if (!error) {
      onClose();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setPreviews((prev) => [
      ...prev,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  };

  const handleRemovePreview = (index: number) => {
    setPreviews((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1)[0];
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return next;
    });
  };

  return (
    <>
      <Button color="primary" endContent={<Plus />} size="sm" onPress={onOpen}>
        Add New
      </Button>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
        size="3xl"
        radius="none"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 w-full bg-primary text-white">
                Add New Room Type
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full space-y-4"
                  onSubmit={onSubmit}
                  onReset={() => {
                    previews.forEach((item) => URL.revokeObjectURL(item.url));
                    setPreviews([]);
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1 w-full md:border-r md:border-gray-300 md:pr-4 space-y-6">
                      <Input
                        isRequired
                        className="w-full"
                        label="Name"
                        placeholder="Item room type"
                        name="name"
                        variant="bordered"
                        radius="none"
                        labelPlacement="outside"
                      />
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                          isRequired
                          className="flex-1"
                          label="Room Size"
                          placeholder="Room size"
                          name="room_size"
                          variant="bordered"
                          radius="none"
                          labelPlacement="outside"
                        />
                        <Input
                          isRequired
                          className="flex-1"
                          label="Max Guest"
                          name="max_guest"
                          type="number"
                          variant="bordered"
                          radius="none"
                          labelPlacement="outside"
                          min={1}
                          placeholder="0"
                        />
                      </div>
                      <Textarea
                        isRequired
                        name="description"
                        placeholder="Item description"
                        label="Description"
                        labelPlacement="outside"
                        variant="bordered"
                        radius="none"
                      />
                      <Input
                        isRequired
                        className="flex-1"
                        label="Price"
                        name="price"
                        type="number"
                        variant="bordered"
                        radius="none"
                        labelPlacement="outside"
                        placeholder="0.00"
                        startContent={
                          <span className="text-default-600 dark:text-default-300 text-small">
                            ₱
                          </span>
                        }
                      />
                      <Input
                        isRequired
                        fullWidth
                        label="Peak Season Price"
                        name="peak_season_price"
                        type="number"
                        variant="bordered"
                        radius="none"
                        labelPlacement="outside"
                        placeholder="0.00"
                        startContent={
                          <span className="text-default-600 dark:text-default-300 text-small">
                            ₱
                          </span>
                        }
                      />
                    </div>

                    <div className="flex-1 space-y-4 flex flex-col">
                      <label className="text-sm font-medium text-gray-600">
                        Room Images
                      </label>
                      <label
                        htmlFor="images-upload"
                        className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition min-h-44"
                      >
                        {previews.length > 0 ? (
                          <div className="grid w-full grid-cols-2 gap-2 p-2">
                            {previews.map((item, index) => (
                              <div
                                key={`${item.url}-${index}`}
                                className="relative"
                              >
                                <img
                                  src={item.url}
                                  alt={`Preview ${index + 1}`}
                                  className="h-28 w-full rounded-lg object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePreview(index)}
                                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
                                  aria-label="Remove image"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-400 py-6">
                            <Upload size={32} />
                            <span className="text-sm">
                              Click or drag file to upload
                            </span>
                          </div>
                        )}
                      </label>
                      <Input
                        isRequired
                        id="images-upload"
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <AddOnsInput addOns={addOns} setAddOns={setAddOns} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 w-full pb-4">
                    <Button onPress={onClose} variant="bordered" radius="none">
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" isLoading={isLoading}>
                      Submit
                    </Button>
                  </div>
                </Form>
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
}
