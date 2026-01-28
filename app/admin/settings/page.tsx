import { Staff } from "@/types/staff";
import AccountCard from "./_components/account-card";

export default function AccountSettingsPage() {
  const staff = {
    id: "1",
    image: "/avatar.png",
    full_name: "Juan Dela Cruz",
    role: "admin",
    email: "juan@email.com",
    phone: "09123456789",
    shift_type: "AM",
    status: "active",
    createdAt: new Date(),
  } as Staff;

  return (
    <main className="min-h-screen bg-default-50 p-6">
      <h1 className="text-lg font-semibold mb-4">Account Settings</h1>
      <AccountCard staff={staff} />
    </main>
  );
}
