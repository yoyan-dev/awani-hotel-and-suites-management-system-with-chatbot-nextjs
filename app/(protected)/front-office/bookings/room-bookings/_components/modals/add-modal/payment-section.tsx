import {
  Textarea,
  RadioGroup,
  Radio,
  Input,
  CheckboxGroup,
  Checkbox,
  Select,
  SelectItem,
} from "@heroui/react";

export default function PaymentSection() {
  return (
    <div className="space-y-4">
      <h1 className="w-full bg-primary px-2 py-1 text-white">
        Payment Details
      </h1>
      <div className="flex justify-between">
        <Select
          isRequired
          fullWidth
          radius="none"
          className="flex-1 w-full min-w-40"
          name="payment_method"
          label="Payment Method"
          labelPlacement="outside"
          placeholder="Select payment method"
          variant="bordered"
        >
          <SelectItem key="cash">Cash</SelectItem>
          <SelectItem key="gcash">Gcash</SelectItem>
          <SelectItem key="card">Card</SelectItem>
        </Select>
        <Input
          labelPlacement="outside"
          fullWidth
          variant="bordered"
          radius="none"
          isRequired
          type="number"
          name="amount_paid"
          label="Amount Paid"
          placeholder="00.00"
          startContent={"₱"}
        />
      </div>
    </div>
  );
}
