import {
  Textarea,
  RadioGroup,
  Radio,
  Input,
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";

interface Props {
  selectedPurpose?: string;
  setSelectedPurpose: (val: string) => void;
}

export default function HealthDeclarationSection({
  selectedPurpose,
  setSelectedPurpose,
}: Props) {
  return (
    <div className="space-y-4">
      <h1 className="w-full bg-primary px-2 py-1 text-white">
        Health Declaration
      </h1>
      <Textarea
        isRequired
        classNames={{ label: "text-gray-600 dark:text-gray-300" }}
        label="City/Country work visited and transited in the last 30 days."
        labelPlacement="outside"
        variant="bordered"
        name="places_last_visited"
        placeholder="Please separate it with commas."
      />
      <RadioGroup
        isRequired
        classNames={{ label: "text-gray-600 dark:text-gray-300" }}
        label="Purpose of Travel"
        orientation="horizontal"
        color="primary"
        name="purpose"
        size="sm"
        value={selectedPurpose}
        onValueChange={setSelectedPurpose}
      >
        <Radio value="Visiting friends and family">
          Visiting friends and family
        </Radio>
        <Radio value="Business">Business</Radio>
        <Radio value="San Francisco">San Francisco</Radio>
        <Radio value="Mice">Mice</Radio>
        <Radio value="Leisure">Leisure</Radio>
        <Radio value="others">Others</Radio>
      </RadioGroup>
      {selectedPurpose === "others" && (
        <Input
          fullWidth
          placeholder="Please specify"
          variant="underlined"
          className="max-w-xs mt-2"
          name="purpose"
        />
      )}
      <CheckboxGroup
        isRequired
        classNames={{ label: "text-gray-600 dark:text-gray-300" }}
        color="primary"
        size="sm"
        label="Please check if you have any of the following at the present or during the past 30 days."
        orientation="horizontal"
      >
        <Checkbox value="fever">Fever</Checkbox>
        <Checkbox value="sore throat">Sore Throat</Checkbox>
        <Checkbox value="headeache">Headeache</Checkbox>
        <Checkbox value="body weakness">Body weakness</Checkbox>
        <Checkbox value="difficulty of breathing">
          Difficulty of Breathing
        </Checkbox>
        <Checkbox value="severe diarhea">Severe Diarhea</Checkbox>
        <Checkbox value="none">None</Checkbox>
      </CheckboxGroup>
    </div>
  );
}
