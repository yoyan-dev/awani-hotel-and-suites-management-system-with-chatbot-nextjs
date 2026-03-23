import React, { useState } from "react";
import {
  Form,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Textarea,
  ModalFooter,
} from "@heroui/react";
import { Copyright, Upload, X } from "lucide-react";
import AddOnsInput from "../add-ons-input";
import { RoomType } from "@/types/room";
import { uploadRoomImage } from "@/lib/upload-room-image";
import { useRoomTypes } from "@/hooks/use-room-types";
import { RoomTypeAddOnFormRow } from "../add-ons-input";
import AmenitiesInput, { RoomTypeAmenityFormRow } from "../amenities-input";
import { getRoomTypeAmenityNames } from "@/lib/room-types/amenities";

interface UpdateModalProps {
  room: RoomType;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ room, isOpen, onClose }) => {
  const { isLoading, updateRoomType } = useRoomTypes();
  const [formData, setFormData] = useState<RoomType>(room);
  const [addOns, setAddOns] = useState<RoomTypeAddOnFormRow[]>(
    (room.room_type_add_ons ?? []).map((row) => ({
      id: row.id,
      inventory_id: row.inventory_id ?? row.add_on_id,
      add_on_id: row.inventory_id ?? row.add_on_id,
      quantity_limit: Number(row.quantity_limit ?? 0),
      add_on: {
        id: row.add_on?.id,
        name: String(row.add_on?.name ?? ""),
        price: Number(row.add_on?.price ?? 0),
      },
    })),
  );
  const [amenities, setAmenities] = useState<RoomTypeAmenityFormRow[]>(
    getRoomTypeAmenityNames(room.amenities).map((name) => ({ name })),
  );
  const [previews, setPreviews] = useState<Array<{ file: File; url: string }>>(
    [],
  );
  const [removedImages, setRemovedImages] = useState<Set<string>>(new Set());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    data.delete("images");
    const files = previews.map((item) => item.file);

    const existingImages =
      formData.images && formData.images.length > 0
        ? formData.images
        : formData.image
          ? [formData.image]
          : [];
    const keptImages = existingImages.filter(
      (src) => !removedImages.has(src),
    );

    let images = existingImages;

    if (files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadRoomImage(file, "type-image")),
      );
      images = [...keptImages, ...uploadedImages];
    } else {
      images = keptImages;
    }

    await updateRoomType({
      ...formData,
      room_type_add_ons: addOns,
      amenities,
      images,
      image: images[0] ?? formData.image,
    });

    onClose();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setPreviews((prev) => [
      ...prev,
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  };

  const existingImages =
    formData.images && formData.images.length > 0
      ? formData.images
      : formData.image
        ? [formData.image]
        : [];

  const displayImages = [
    ...existingImages.filter((src) => !removedImages.has(src)),
    ...previews.map((item) => item.url),
  ];

  const handleRemoveExisting = (src: string) => {
    setRemovedImages((prev) => new Set(prev).add(src));
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
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        placement="top-center"
        scrollBehavior="outside"
        size="3xl"
        radius="none"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 w-full bg-primary text-white">
                Edit Room Type
              </ModalHeader>
              <ModalBody>
                <Form
                  className="w-full space-y-4"
                  onSubmit={onSubmit}
                  onReset={() => {
                    previews.forEach((item) => URL.revokeObjectURL(item.url));
                    setPreviews([]);
                    setRemovedImages(new Set());
                  }}
                >
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1 w-full md:border-r md:border-gray-300 md:pr-4 space-y-6">
                      <Input
                        className="w-full"
                        label="Name"
                        placeholder="Item room type"
                        name="name"
                        variant="bordered"
                        radius="none"
                        labelPlacement="outside"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                          className="flex-1"
                          label="Room Size"
                          placeholder="Room size"
                          name="room_size"
                          variant="bordered"
                          radius="none"
                          labelPlacement="outside"
                          value={formData.room_size}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              room_size: e.target.value,
                            })
                          }
                        />
                        <Input
                          className="flex-1"
                          label="Max Guest"
                          name="max_guest"
                          type="number"
                          variant="bordered"
                          radius="none"
                          value={formData.max_guest?.toString() ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              max_guest: Number(e.target.value),
                            })
                          }
                          labelPlacement="outside"
                          min={1}
                          placeholder="0"
                        />
                      </div>
                      <Textarea
                        name="description"
                        placeholder="Item description"
                        label="Description"
                        labelPlacement="outside"
                        variant="bordered"
                        radius="none"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                      <AmenitiesInput
                        amenities={amenities}
                        setAmenities={setAmenities}
                      />
                      <Input
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
                        value={formData.price?.toString() ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
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
                        value={formData.peak_season_price?.toString() ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            peak_season_price: Number(e.target.value),
                          })
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
                        {displayImages.length > 0 ? (
                          <div className="grid w-full grid-cols-2 gap-2 p-2">
                            {existingImages
                              .filter((src) => !removedImages.has(src))
                              .map((src, index) => (
                                <div
                                  key={`${src}-${index}`}
                                  className="relative"
                                >
                                  <img
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    className="h-28 w-full rounded-lg object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExisting(src)}
                                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
                                    aria-label="Remove image"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
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
export default UpdateModal;
