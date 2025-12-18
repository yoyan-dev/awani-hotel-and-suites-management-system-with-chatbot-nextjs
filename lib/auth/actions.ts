"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const roles: string[] = data.user?.app_metadata?.roles || [];

  // Optional: refresh auth-based layouts
  revalidatePath("/", "layout");

  // ✅ SERVER-SIDE REDIRECT (role-based)
  if (roles.includes("admin")) {
    redirect("/admin");
  } else if (roles.includes("front-office")) {
    redirect("/front-office");
  } else if (roles.includes("housekeeping")) {
    redirect("/housekeeping");
  } else {
    redirect("/guest");
  }
}

export async function signup(email: string, password: string) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email,
    password: password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}
