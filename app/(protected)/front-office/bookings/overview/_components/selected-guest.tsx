import { Guest } from "@/types/guest";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Chip,
} from "@heroui/react";

interface SelectedGuestProps {
  guest: Guest;
}

export default function SelectedGuest({ guest }: SelectedGuestProps) {
  return (
    <Card
      className="w-full shadow-none border border-gray-100 dark:border-gray-700 dark:bg-gray-900"
      radius="sm"
    >
      <CardHeader className="flex items-center gap-4">
        <Image
          alt={`${guest.full_name} avatar`}
          className="object-cover"
          height={60}
          width={60}
          radius="full"
          src={
            guest?.image ||
            "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
          }
        />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{guest.full_name}</p>
          <p className="text-sm text-default-700 dark:text-default-500">
            {guest.contact_number}
          </p>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="space-y-3 flex justify-between flex-wrap md:flex-nowrap md:flex-row">
        <div className="flex-1">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{guest.email ?? "—"}</p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">{guest.address ?? "—"}</p>
        </div>
      </CardBody>

      <Divider />
      <CardFooter className="flex justify-end">
        <Link isExternal showAnchorIcon className="text-primary font-medium">
          View valid ID
        </Link>
      </CardFooter>
    </Card>
  );
}
