"use client";

import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { Staff } from "@/types/staff";
import AccountAvatar from "./account-avatar";
import AccountForm from "./account-form";

export default function AccountCard({ staff }: { staff: Staff }) {
  return (
    <Card className="max-w-xl mx-auto shadow-sm rounded-md">
      <CardBody>
        <AccountAvatar image={staff.image} name={staff.full_name} />
        <AccountForm staff={staff} />
      </CardBody>

      <CardFooter className="justify-end">
        <Button color="primary">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
