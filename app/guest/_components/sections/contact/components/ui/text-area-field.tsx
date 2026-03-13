import { Textarea } from "@heroui/input";
import type { TextAreaProps } from "@heroui/input";

interface Props {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  classNames?: TextAreaProps["classNames"];
}

const defaultClassNames: TextAreaProps["classNames"] = {
  label: "text-[#6b6153] font-medium",
  input: "text-[#1f1e1b] placeholder:text-[#8a7f71]",
  inputWrapper:
    "border-[#dac7af] bg-[#fffaf3] group-data-[focus=true]:border-[#b08a53]",
};

export default function TextAreaField({
  label,
  name,
  placeholder,
  required = false,
  classNames,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <Textarea
        label={label}
        labelPlacement="outside"
        classNames={classNames ?? defaultClassNames}
        name={name}
        id={name}
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
