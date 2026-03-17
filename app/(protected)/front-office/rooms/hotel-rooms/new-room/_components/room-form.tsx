import React from "react";
import {
  Form,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { Room, RoomType } from "@/types/room";
import BedsInput from "./beds-input";
import FacilitiesInput from "./facilities-input";
import ImagesUpload from "./image-upload";
import { Copyright, Save } from "lucide-react";

interface RoomFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  images: any[];
  setImages: React.Dispatch<React.SetStateAction<any[]>>;
  roomTypes: RoomType[];
  typesLoading: boolean;
  roomLoading: boolean;
}

export default function RoomForm({
  onSubmit,
  images,
  setImages,
  roomTypes,
  typesLoading,
  roomLoading,
}: RoomFormProps) {
  return (
    <Form
      onSubmit={onSubmit}
      className="bg-white dark:bg-gray-900 rounded space-y-2 w-full"
    >
      <div className="flex justify-between items-center px-4 py-2 w-full bg-primary text-white">
        <h1 className="text-xl semi-bold">New Room</h1>
        <Button
          radius="none"
          type="submit"
          className="bg-primary-200"
          variant="bordered"
          isLoading={roomLoading}
        >
          <Save size={18} />
          Save
        </Button>
      </div>
      <div className="flex flex-col gap-8 w-full md:flex-row px-4">
        <div className="flex-1 flex flex-col gap-4">
          <h1>Basic Information</h1>
          <hr className="border border-gray-400" />

          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              className="w-full"
              label="Room Number"
              placeholder="room number"
              name="room_number"
              type="number"
              variant="bordered"
              radius="none"
              labelPlacement="outside"
            />
            <Input
              className="w-full"
              label="Area"
              placeholder="room area"
              name="area"
              variant="bordered"
              radius="none"
              labelPlacement="outside"
            />
          </div>
          <Select
            isLoading={typesLoading}
            radius="none"
            className="flex-1 w-full min-w-40"
            name="room_type_id"
            label="Room type"
            labelPlacement="outside"
            placeholder="Select Room Type"
            variant="bordered"
          >
            {roomTypes.map((type) => (
              <SelectItem key={type.id} textValue={type.name}>
                <div className="flex flex-col">
                  <span className="text-small">{type.name}</span>
                  <span className="text-tiny text-gray-600 dark:text-gray-300">
                    {type.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>

          <Textarea
            radius="none"
            className="w-full"
            label="Description"
            name="description"
            labelPlacement="outside"
            placeholder="Briefly describe the hotel room..."
            variant="bordered"
          />
          <Textarea
            radius="none"
            className="w-full"
            label="Remarks"
            name="remarks"
            labelPlacement="outside"
            placeholder="Room remarks..."
            variant="bordered"
          />
        </div>
      </div>

      <div className="gap-1 w-full bg-primary flex justify-center items-center text-white text-sm font-thin py-2">
        <Copyright size={10} /> Alright reserved Ma. Awani.
      </div>
    </Form>
  );
}
