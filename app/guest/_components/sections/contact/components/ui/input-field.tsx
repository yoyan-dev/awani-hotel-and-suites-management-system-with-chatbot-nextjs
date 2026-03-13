import { Input } from "@heroui/input";
import type { InputProps } from "@heroui/input";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  classNames?: InputProps["classNames"];
}

const defaultClassNames: InputProps["classNames"] = {
  label: "text-[#6b6153] font-medium",
  input: "text-[#1f1e1b] placeholder:text-[#8a7f71]",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] group-data-[focus=true]:border-[#b08a53]",
};

export default function InputField({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  autoComplete,
  classNames,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <Input
        label={label}
        labelPlacement="outside"
        variant="bordered"
        classNames={classNames ?? defaultClassNames}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        color="primary"
        radius="sm"
      />
    </div>
  );
}
