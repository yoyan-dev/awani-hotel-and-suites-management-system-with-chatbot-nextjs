import { addGuest } from "@/features/guest/guest-thunk";
import { AppDispatch, RootState } from "@/store/store";
import { Input, Textarea } from "@heroui/input";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function GuestForm({
  setSelectedGuest,
}: {
  setSelectedGuest: React.Dispatch<React.SetStateAction<any>>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { guest, isLoading } = useSelector((state: RootState) => state.guests);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let id = crypto.randomUUID();
    formData.append("id", id);

    const action = await dispatch(addGuest(formData));
    if (addGuest.fulfilled.match(action)) {
      setSelectedGuest(action.payload.id);
    }
    console.log(guest);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl border border-gray-100 dark:border-gray-700">
      <CardHeader className="text-xl font-semibold">
        📝 Guest Information
      </CardHeader>
      <CardBody className=" dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isRequired
              fullWidth
              variant="bordered"
              radius="sm"
              labelPlacement="outside"
              label="Full Name"
              name="full_name"
              placeholder="Enter guest full name"
            />
            <Input
              isRequired
              fullWidth
              variant="bordered"
              name="contact_number"
              labelPlacement="outside"
              radius="sm"
              label="Contact Number"
              placeholder="Enter guest contact number"
            />
          </div>

          <Textarea
            fullWidth
            variant="bordered"
            radius="sm"
            labelPlacement="outside"
            name="address"
            label="Address"
            placeholder="Enter guest address"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              fullWidth
              variant="bordered"
              radius="sm"
              labelPlacement="outside"
              label="Nationality"
              placeholder="e.g. Filipino"
              name="nationality"
            />
            <Input
              fullWidth
              variant="bordered"
              radius="sm"
              labelPlacement="outside"
              label="Email"
              type="email"
              placeholder="Enter guest email"
              name="email"
            />
          </div>
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={isLoading}
              type="submit"
              size="sm"
              radius="sm"
            >
              Register Guest
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
