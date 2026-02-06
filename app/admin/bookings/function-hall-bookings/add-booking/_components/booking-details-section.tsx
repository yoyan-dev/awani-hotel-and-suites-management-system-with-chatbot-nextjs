import { BanquetPackage } from "@/types/banquet";
import {
  Select,
  SelectItem,
  Input,
  Chip,
  Button,
  Form,
  TimeInput,
  Textarea,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { TimerIcon } from "lucide-react";
interface EventDuration {
  start: Time | null;
  end: Time | null;
}

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  eventDuration: EventDuration;
  setEventDuration: React.Dispatch<React.SetStateAction<EventDuration>>;
  banquetPackages: BanquetPackage[];
  selectedPackage: string;
  setSelectedPackage: React.Dispatch<React.SetStateAction<string>>;
  packageLoading: boolean;
  bookingIsLoading: boolean;
}

export default function BookingDetailsSection({
  handleSubmit,
  eventDuration,
  setEventDuration,
  banquetPackages,
  selectedPackage,
  setSelectedPackage,
  packageLoading,
  bookingIsLoading,
}: Props) {
  return (
    <Form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Event Details */}
      <div className="space-y-4 w-full">
        <h2 className="w-full bg-primary px-2 py-1 text-white">
          Event Details
        </h2>

        <Select
          isRequired
          fullWidth
          radius="none"
          className="flex-1 w-full min-w-40 mt-4"
          name="event_type"
          label="Event Type"
          labelPlacement="outside"
          placeholder="Select event type"
          variant="bordered"
        >
          <SelectItem key="wedding">Wedding</SelectItem>
          <SelectItem key="birthday">Birthday</SelectItem>
          <SelectItem key="corporate">Corporate Event</SelectItem>
          <SelectItem key="debut">Debut</SelectItem>
          <SelectItem key="others">Others</SelectItem>
        </Select>

        <Input
          className="mt-4"
          isRequired
          fullWidth
          variant="bordered"
          radius="none"
          type="date"
          label="Event Date"
          name="event_date"
          labelPlacement="outside"
        />

        <div className="flex gap-4">
          <TimeInput
            isRequired
            label="Start Time"
            labelPlacement="outside"
            variant="bordered"
            startContent={<TimerIcon size={16} />}
            value={eventDuration.start}
            onChange={(time) =>
              setEventDuration((prev: EventDuration) => ({
                ...prev,
                start: time,
              }))
            }
            className="flex-1"
          />
          <TimeInput
            isRequired
            label="End Time"
            labelPlacement="outside"
            variant="bordered"
            startContent={<TimerIcon size={16} />}
            value={eventDuration.end}
            onChange={(time) =>
              setEventDuration((prev: EventDuration) => ({
                ...prev,
                end: time,
              }))
            }
            className="flex-1"
          />
        </div>
      </div>

      {/* Package & Guests */}
      <div className="space-y-4 w-full">
        <h2 className="w-full bg-primary px-2 py-1 text-white">
          Package & Guests
        </h2>

        <Select
          isRequired
          fullWidth
          radius="none"
          className="flex-1 w-full min-w-40 mt-4"
          name="banquet_package_id"
          label="Banquet Package"
          labelPlacement="outside"
          placeholder="Select banquet package"
          variant="bordered"
          isLoading={packageLoading}
          selectedKeys={selectedPackage ? [selectedPackage] : []}
          onChange={(e) => setSelectedPackage(e.target.value)}
        >
          {banquetPackages.map((pkg) => (
            <SelectItem key={pkg.id} textValue={pkg.name}>
              <div className="flex flex-col">
                <span className="text-small font-medium">{pkg.name}</span>
                <span className="text-tiny text-gray-600 dark:text-gray-300">
                  ₱{pkg.price_per_cover} per cover
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>

        <Input
          className="mt-4"
          isRequired
          fullWidth
          variant="bordered"
          radius="none"
          type="number"
          min={1}
          label="Number of Guests"
          name="number_of_guest"
          labelPlacement="outside"
          placeholder="Enter number of guests"
        />
      </div>

      {/* Additional Information */}
      <div className="space-y-4 w-full">
        <h2 className="w-full bg-primary px-2 py-1 text-white">
          Additional Information
        </h2>

        <Textarea
          fullWidth
          variant="bordered"
          radius="none"
          name="notes"
          label="Notes / Special Requests"
          labelPlacement="outside"
          placeholder="Enter any special requests or notes..."
        />
      </div>

      <div className="flex gap-4 justify-end w-full pb-4 pt-4">
        <Button
          type="submit"
          radius="none"
          size="sm"
          color="primary"
          isLoading={bookingIsLoading}
        >
          Create Booking
        </Button>
      </div>
    </Form>
  );
}
