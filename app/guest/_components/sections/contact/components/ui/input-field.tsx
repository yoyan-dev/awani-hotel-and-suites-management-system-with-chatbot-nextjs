import { Input } from "@heroui/input";

interface Props {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export default function InputField({
  label,
  placeholder,
  type = "text",
  required = false,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <Input
        label={label}
        labelPlacement="outside"
        variant="bordered"
        classNames={{ label: "text-dark" }}
        type={type}
        placeholder={placeholder}
        required={required}
        color="primary"
        radius="sm"
      />
    </div>
  );
}
