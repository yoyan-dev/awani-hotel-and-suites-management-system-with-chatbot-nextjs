"use server";
import { createClient } from "../supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  const user = data?.claims;

  return { user, error };
}
