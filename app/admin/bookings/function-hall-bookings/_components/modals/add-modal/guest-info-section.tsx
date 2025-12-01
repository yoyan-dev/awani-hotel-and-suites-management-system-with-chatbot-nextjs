import { Select, SelectItem } from "@heroui/react";
import GuestForm from "../guest/guest-form";
import SelectedGuest from "../../selected-guest";
import { Guest } from "@/types/guest";

interface Props {
  guests: Guest[];
  selectedGuest?: string;
  setSelectedGuest: (id: string) => void;
  filteredGuest: Guest;
  loading?: boolean;
}

export default function GuestInfoSection({
  guests,
  selectedGuest,
  setSelectedGuest,
  filteredGuest,
  loading,
}: Props) {
  return (
    <div className="space-y-4 w-full flex flex-col items-start">
      <h1 className="w-full bg-primary px-2 py-1 text-white">
        Guest Information
      </h1>
      <Select
        isRequired
        fullWidth
        isLoading={loading}
        radius="none"
        className="flex-1 w-full min-w-40 pt-4"
        name="guest_id"
        label="Guest"
        onChange={(e) => setSelectedGuest(e.target.value)}
        labelPlacement="outside"
        placeholder="Select Guest"
        variant="bordered"
        items={[
          ...guests,
          {
            id: "new",
            full_name: "Register new guest",
            email: "",
          },
        ]}
      >
        {(guest) => (
          <SelectItem key={guest.id} textValue={guest.full_name}>
            <div className="flex flex-col">
              <span className="text-small">{guest.full_name}</span>
              <span className="text-tiny text-gray-600 dark:text-gray-300">
                {guest.email}
              </span>
            </div>
          </SelectItem>
        )}
      </Select>
      {selectedGuest ? (
        selectedGuest === "new" ? (
          <div className="w-full">
            <GuestForm setSelectedGuest={setSelectedGuest} />
          </div>
        ) : (
          <div className="w-full">
            <SelectedGuest guest={filteredGuest} />
          </div>
        )
      ) : null}
    </div>
  );
}
