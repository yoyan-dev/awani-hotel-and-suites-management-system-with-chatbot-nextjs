import { ApiRouteError } from "@/lib/api/route-error";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return user;
}

export async function signUpAuthUser(body: Record<string, any>) {
  const supabase = await createClient();
  const { email, password, ...metadata } = body;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}

export async function updateCurrentAuthUser(body: Record<string, unknown>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser(body);

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}

export async function signOutCurrentAuthUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new ApiRouteError(error.message);
  }
}
