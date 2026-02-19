import { User } from "@/types/users";
import { supabase } from "@/lib/supabase/supabase-client";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user as User;
}
