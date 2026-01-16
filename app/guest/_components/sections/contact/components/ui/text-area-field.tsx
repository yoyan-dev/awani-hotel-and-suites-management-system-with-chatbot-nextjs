import { Textarea } from "@heroui/input";

interface Props {
  label: string;
  placeholder?: string;
  required?: boolean;
}

export default function TextAreaField({
  label,
  placeholder,
  required = false,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <Textarea
        label={label}
        labelPlacement="outside"
        classNames={{ label: "text-dark" }}
        placeholder={placeholder}
        required={required}
        color="primary"
        variant="bordered"
        className="resize-none h-32"
        radius="sm"
      />
    </div>
  );
}
