"use server";

import { createClient } from "@/lib/supabase/server";

export async function handleResetPassword(email: string, redirectTo: string) {
  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
