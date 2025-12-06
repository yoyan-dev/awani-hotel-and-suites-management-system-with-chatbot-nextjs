import { Booking } from "@/types/booking";
import { FetchRoomTypesParams, RoomType } from "@/types/room";
import {
  Button,
  Chip,
  Input,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  Textarea,
  CheckboxGroup,
  Checkbox,
  Form,
  Tooltip,
  Spinner,
  cn,
} from "@heroui/react";
import { ArrowLeft, ArrowRight, Info, Link, Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import ViewModal from "./modals/view-modal";
import { Guest } from "@/types/guest";
import PolicyModal from "./modals/policy-modal";
import { formatPHP } from "@/lib/format-php";
import GuestForm from "./guest-form";
interface BookingFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  query: FetchRoomTypesParams;
  setQuery: React.Dispatch<React.SetStateAction<FetchRoomTypesParams>>;
  guestId: string | null;
  setGuestId: React.Dispatch<React.SetStateAction<string | null>>;
  roomTypes: RoomType[];
  room: RoomType | null;
  isLoading: boolean;
  selectedRoom: any;
  setSelectedRoom: React.Dispatch<React.SetStateAction<any>>;
  specialRequests: { name: string; price: string; quantity: number }[];
  setSpecialRequests: React.Dispatch<
    React.SetStateAction<{ name: string; price: string; quantity: number }[]>
  >;
  bookingIsLoading: boolean;
}

export default function BookingForm({
  onSubmit,
  query,
  setQuery,
  guestId,
  setGuestId,
  roomTypes,
  room,
  isLoading,
  selectedRoom,
  setSelectedRoom,
  specialRequests,
  setSpecialRequests,
  bookingIsLoading,
}: BookingFormProps) {
  const [selectedPurpose, SetSelectedPurpose] = useState<string>("");
  const [policySignature, setPolicySignature] = useState("");

  if (!guestId) return <GuestForm guestId={guestId} setGuestId={setGuestId} />;

  return (
    <Form onSubmit={onSubmit} className="flex-1 px-4 w-full space-y-4">
      <div className="space-y-4 w-full">
        {/* <div className="flex justify-between flex-wrap">
          <h1>
            <Chip color="primary" className="text-sm">
              1
            </Chip>
            -Personal Information
          </h1>
          <div className="flex">
            <Tooltip
              content="This field is automatically filled from your account. To change it, go to Account Settings."
              color="warning"
            >
              <Info />
            </Tooltip>
          </div>
        </div> */}
        {/* {guestIsLoading ? (
          <div className="w-full flex justify-between">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                fullWidth
                variant="bordered"
                radius="none"
                isReadOnly
                isDisabled
                labelPlacement="outside"
                label="Full Name"
                value={guest.full_name}
                placeholder="Enter your name"
              />
              <Input
                fullWidth
                variant="bordered"
                isReadOnly
                isDisabled
                labelPlacement="outside"
                radius="none"
                label="Contact Number"
                value={guest.contact_number}
                placeholder="Enter your name"
              />
            </div>
            <Textarea
              fullWidth
              variant="bordered"
              isReadOnly
              isDisabled
              radius="none"
              labelPlacement="outside"
              label="Address"
              value={guest.address}
              placeholder="Enter your name"
            />
          </>
        )} */}
      </div>
      <div className="space-y-4 w-full">
        <h1>
          <Chip color="primary" className="text-sm">
            2
          </Chip>
          -Booking Details
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-3">
          Fill in your booking preferences below. All fields are editable.
        </p>
        {room ? (
          <div className="flex w-full justify-end md:hidden">
            <ViewModal room={room} />
          </div>
        ) : null}
        <div className="flex gap-4">
          <Input
            fullWidth
            variant="underlined"
            isRequired
            type="date"
            label="Check-in Date"
            name="check_in"
            value={query.checkIn}
            onChange={(e) => setQuery({ ...query, checkIn: e.target.value })}
          />

          <Input
            fullWidth
            variant="underlined"
            isRequired
            type="date"
            label="Check-out Date"
            name="check_out"
            value={query.checkOut}
            onChange={(e) => setQuery({ ...query, checkOut: e.target.value })}
          />
        </div>
        {query.checkIn && query.checkOut && roomTypes.length <= 0 ? (
          <div>No Available rooms on a selected date</div>
        ) : null}
        <div className="py-4">
          <Select
            isRequired
            fullWidth
            isLoading={isLoading}
            radius="none"
            className="flex-1 w-full min-w-40"
            name="room_type_id"
            label="Room type"
            value={selectedRoom}
            defaultSelectedKeys={[selectedRoom]}
            onChange={(e) => setSelectedRoom(e.target.value)}
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
        </div>

        <Input
          fullWidth
          variant="bordered"
          name="company"
          labelPlacement="outside"
          radius="none"
          label="Company (Optional)"
          placeholder="Company name"
        />

        {specialRequests ? (
          <div>
            <label>Special requests</label>
            <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
              Select optional add-ons for this room. Use the plus/minus buttons
              to adjust the quantity.
            </p>

            <div className="flex gap-4 flex-wrap py-4">
              {specialRequests.map((request: any) => (
                <div
                  className="flex flex-col gap-2 items-center"
                  key={request.name}
                >
                  <div className="flex items-center gap-4 ">
                    <span className="text-tiny text-default-700 dark:text-default-400">
                      {request.name} (max {request.max_quantity})
                    </span>
                    <Chip color="success" size="sm" variant="flat">
                      {formatPHP(Number(request.price || 0))}
                    </Chip>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      isIconOnly
                      isDisabled={request.quantity === 0}
                      onPress={() =>
                        setSpecialRequests((prev) =>
                          prev.map((req) =>
                            req.name === request.name
                              ? { ...req, quantity: req.quantity - 1 }
                              : req
                          )
                        )
                      }
                    >
                      <Minus size={8} />
                    </Button>
                    {request.quantity}
                    <Button
                      size="sm"
                      isIconOnly
                      isDisabled={
                        request.quantity >= Number(request?.max_quantity)
                      }
                      onPress={() =>
                        setSpecialRequests((prev) =>
                          prev.map((req) =>
                            req.name === request.name
                              ? { ...req, quantity: req.quantity + 1 }
                              : req
                          )
                        )
                      }
                    >
                      <Plus size={8} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <Input
          variant="bordered"
          isRequired
          labelPlacement="outside"
          defaultValue="1"
          radius="none"
          type="number"
          placeholder="0"
          label="Number of Guests"
          name="number_of_guests"
          min={1}
          max={room?.max_guest}
          errorMessage={`Maximum guests allowed: ${room?.max_guest}`}
        />
      </div>
      <div className="space-y-4">
        <h1>
          <Chip color="primary" className="text-sm">
            3
          </Chip>
          -Health Declaration
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-3">
          Please complete this section honestly. These answers are required for
          your safety and for compliance with health regulations. <br />
        </p>
        <Textarea
          classNames={{ label: "text-gray-600 dark:text-gray-300" }}
          label="City/Country work visited and transited in the last 30 days."
          labelPlacement="outside"
          variant="bordered"
          name="places_last_visited"
          placeholder="Please separate it with commas."
        />
        <RadioGroup
          isRequired
          classNames={{ label: "text-gray-600 dark:text-gray-300" }}
          label="Purpose of Travel"
          orientation="horizontal"
          color="primary"
          name="purpose"
          value={selectedPurpose}
          size="sm"
          onValueChange={SetSelectedPurpose}
        >
          <Radio value="Visiting friends and family">
            Visiting friends and family
          </Radio>
          <Radio value="Business">Business</Radio>
          <Radio value="San Francisco">San Francisco</Radio>
          <Radio value="Mice">Mice</Radio>
          <Radio value="Leisure">Leisure</Radio>
          <Radio value="others">Others</Radio>
        </RadioGroup>

        {selectedPurpose === "others" && (
          <Input
            fullWidth
            placeholder="Please specify"
            variant="underlined"
            className="max-w-xs mt-2"
            name="purpose"
          />
        )}
        <CheckboxGroup
          classNames={{ label: "text-gray-600 dark:text-gray-300" }}
          color="primary"
          label="Please check if you have any of the following at the present or during the past 30 days."
          orientation="horizontal"
          name="recent_sickness"
          size="sm"
        >
          <Checkbox value="fever">Fever</Checkbox>
          <Checkbox value="sore throat">Sore Throat</Checkbox>
          <Checkbox value="headeache">Headeache</Checkbox>
          <Checkbox value="body weakness">Body weakness</Checkbox>
          <Checkbox value="difficulty of breathing">
            Difficulty of Breathing
          </Checkbox>
          <Checkbox value="severe diarhea">Severe Diarhea</Checkbox>
          <Checkbox value="none">None</Checkbox>
        </CheckboxGroup>
      </div>
      <div className="space-y-4">
        <h1 className="px-2 bg-primary text-white md:text-xl">Declaration</h1>
        <div>
          <p className="text-sm text-gray-600">
            The information I have given is true, correct and complete. I
            understand failure to answer any question may have serious
            consequences.
          </p>
        </div>
        <div className="flex justify-between">
          <PolicyModal onConfirm={(sig) => setPolicySignature(sig)} />

          <Button
            isLoading={bookingIsLoading}
            isDisabled={policySignature ? false : true}
            type="submit"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
}
