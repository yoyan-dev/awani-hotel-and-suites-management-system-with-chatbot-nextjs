import { Input, Textarea } from "@heroui/react";

export default function GuestInfoSection() {
  return (
    <div className="space-y-4 w-full flex flex-col items-start">
      <h1 className="w-full bg-primary px-2 py-1 text-white">
        Guest Information
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4">
        <Input
          isRequired
          fullWidth
          variant="bordered"
          radius="none"
          labelPlacement="outside"
          label="Full Name"
          name="guest_full_name"
          placeholder="Enter guest full name"
        />
        <Input
          isRequired
          fullWidth
          variant="bordered"
          radius="none"
          labelPlacement="outside"
          label="Contact Number"
          name="guest_contact_number"
          placeholder="Enter guest contact number"
        />
      </div>

      <Textarea
        isRequired
        fullWidth
        variant="bordered"
        radius="none"
        labelPlacement="outside"
        name="guest_address"
        label="Address"
        placeholder="Enter guest address"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Input
          isRequired
          fullWidth
          variant="bordered"
          radius="none"
          labelPlacement="outside"
          label="Nationality"
          placeholder="e.g. Filipino"
          name="guest_nationality"
        />
        <Input
          isRequired
          fullWidth
          variant="bordered"
          radius="none"
          labelPlacement="outside"
          label="Email"
          type="email"
          placeholder="Enter guest email"
          name="guest_email"
        />
      </div>
    </div>
  );
}
