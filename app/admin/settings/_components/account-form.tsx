"use client";

import { Input, Select, SelectItem } from "@heroui/react";
import { Staff } from "@/types/staff";

export default function AccountForm({ staff }: { staff: Staff }) {
  return (
    <div className="grid gap-4 mt-6">
      <Input label="Full name" defaultValue={staff.full_name} />

      <Input label="Email" defaultValue={staff.email} />

      <Input label="Phone" defaultValue={staff.phone} />

      <Input label="Role" value={staff.role} isReadOnly />

      <Select label="Shift" defaultSelectedKeys={[staff.shift_type ?? "N/A"]}>
        {["AM", "MID", "PM", "GY", "N/A"].map((s) => (
          <SelectItem key={s}>{s}</SelectItem>
        ))}
      </Select>

      <Input label="Status" value={staff.status} isReadOnly />
    </div>
  );
}
