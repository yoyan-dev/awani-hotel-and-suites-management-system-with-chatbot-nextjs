import { Tab, Tabs } from "@heroui/react";

interface Props {
  activeTab: "arrival" | "departure";
  onChange: (tab: "arrival" | "departure") => void;
}

export default function GuestTabs({ activeTab, onChange }: Props) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => onChange(val as "arrival" | "departure")}
    >
      <Tab value="arrival">Arrival</Tab>
      <Tab value="departure">Departure</Tab>
    </Tabs>
  );
}
