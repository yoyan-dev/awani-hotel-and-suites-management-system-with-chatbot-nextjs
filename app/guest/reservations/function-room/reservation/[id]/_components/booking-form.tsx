import { Booking } from "@/types/booking";
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
  Card,
  CardHeader,
  CardBody,
  DateRangePicker,
} from "@heroui/react";
import { ArrowLeft, ArrowRight, Info, Link, Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import ViewModal from "./modals/view-modal";
import { Guest } from "@/types/guest";
import PolicyModal from "./modals/policy-modal";
import { formatPHP } from "@/lib/format-php";
import GuestForm from "./guest-form";
import { BanquetPackage } from "@/types/banquet-package";
import { parseZonedDateTime } from "@internationalized/date";
interface BookingFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  guestId: string | null;
  setGuestId: React.Dispatch<React.SetStateAction<string | null>>;
  items: BanquetPackage[];
  banquetPackage: BanquetPackage | null;
  isLoading: boolean;
  selectedPackage: any;
  setSelectedPackage: React.Dispatch<React.SetStateAction<any>>;
  eventDate: any;
  setEventDate: React.Dispatch<React.SetStateAction<any>>;
  eventDuration: { start: any; end: any };
  setEventDuration: React.Dispatch<
    React.SetStateAction<{ start: any; end: any }>
  >;
  bookingIsLoading: boolean;
}

export default function BookingForm({
  onSubmit,
  guestId,
  setGuestId,
  items,
  banquetPackage,
  isLoading,
  selectedPackage,
  setSelectedPackage,
  eventDate,
  setEventDate,
  eventDuration,
  setEventDuration,
  bookingIsLoading,
}: BookingFormProps) {
  const [selectedPurpose, SetSelectedPurpose] = useState<string>("");
  const [policySignature, setPolicySignature] = useState("");

  return (
    <>
      {!guestId ? (
        <GuestForm guestId={guestId} setGuestId={setGuestId} />
      ) : (
        <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl border border-gray-100 dark:border-gray-700">
          <CardHeader className="text-xl font-semibold">
            📝 Event / Banquet Booking
          </CardHeader>

          <CardBody className="dark:bg-gray-900">
            <Form onSubmit={onSubmit} className="space-y-6 px-4 w-full">
              <div className="space-y-4 w-full">
                <h1 className="flex items-center gap-2">
                  <Chip color="primary" size="sm">
                    1
                  </Chip>
                  Event Details
                </h1>

                <Select
                  fullWidth
                  isRequired
                  label="Event Type"
                  name="event_type"
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

                {/* Event Date & Duration */}
                <div className="flex gap-4 w-full">
                  <Input
                    isRequired
                    type="date"
                    name="event_date"
                    label="Event Date"
                    onChange={(e) => setEventDate(e.target.value)}
                    labelPlacement="outside"
                    variant="underlined"
                    fullWidth
                  />
                  <Input
                    isRequired
                    type="time"
                    label="Start"
                    onChange={(e) =>
                      setEventDuration({
                        ...eventDuration,
                        start: e.target.value,
                      })
                    }
                    labelPlacement="outside"
                    variant="underlined"
                    fullWidth
                  />
                  <Input
                    isRequired
                    type="time"
                    label="End"
                    onChange={(e) =>
                      setEventDuration({
                        ...eventDuration,
                        end: e.target.value,
                      })
                    }
                    labelPlacement="outside"
                    variant="underlined"
                    fullWidth
                  />
                </div>
              </div>

              <div className="space-y-4 w-full">
                <h1 className="flex items-center gap-2">
                  <Chip color="primary" size="sm">
                    2
                  </Chip>
                  Package & Guests
                </h1>

                <Select
                  isRequired
                  fullWidth
                  isLoading={isLoading}
                  name="banquet_package_id"
                  label="Banquet Package"
                  labelPlacement="outside"
                  placeholder="Select package"
                  variant="bordered"
                  defaultSelectedKeys={[selectedPackage]}
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                >
                  {items.map((pkg: any) => (
                    <SelectItem key={pkg.id} textValue={pkg.name}>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-small font-medium">
                            {pkg.name}
                          </span>

                          <Chip size="sm">
                            {formatPHP(pkg.price_per_cover)} per cover
                          </Chip>
                        </div>

                        {pkg.categories?.length > 0 && (
                          <div className="pt-2">
                            <h4 className="text-xs font-semibold text-gray-600 mb-1">
                              Package Included
                            </h4>

                            <div className="flex flex-wrap gap-1">
                              {pkg.categories.map(
                                (category: string, index: number) => (
                                  <Chip
                                    key={`${pkg.id}-${index}`}
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                  >
                                    {category}
                                  </Chip>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  isRequired
                  type="number"
                  min={1}
                  name="number_of_guest"
                  label="Number of Guests"
                  labelPlacement="outside"
                  variant="bordered"
                />
              </div>

              <div className="space-y-4 w-full">
                <h1 className="flex items-center gap-2">
                  <Chip color="primary" size="sm">
                    3
                  </Chip>
                  Additional Information
                </h1>

                <Textarea
                  name="notes"
                  label="Special Requests / Notes"
                  labelPlacement="outside"
                  placeholder="Stage setup, dietary needs, program flow, etc."
                  variant="bordered"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  color="primary"
                  type="submit"
                  isLoading={bookingIsLoading}
                >
                  Submit Booking
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      )}
    </>
  );
}
