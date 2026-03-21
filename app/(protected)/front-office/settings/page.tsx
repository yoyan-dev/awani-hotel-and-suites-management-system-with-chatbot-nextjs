"use client";

import AccountCard from "./_components/account-card";
import { DashboardLayout, LoadingState } from "@/components/dashboard/dashboard-layout";
import { useFrontOfficeSettingsPage } from "@/hooks/front-office/use-front-office-settings-page";

export default function AccountSettingsPage() {
  const { status, user, formData, setFormData, onSubmit, updateUserLoading } =
    useFrontOfficeSettingsPage();

  if (status === "loading" || !user) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading user data..." />
      </DashboardLayout>
    );
  }

  return (
    <main className="min-h-screen bg-default-50 p-6">
      <h1 className="text-lg font-semibold mb-4">Account Settings</h1>
      <AccountCard
        user={user}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={updateUserLoading}
      />
    </main>
  );
}
