"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("sb-session")?.value;

  if (!cookie) {
    return { user: null, error: "No session cookie found" };
  }

  try {
    const decoded = JSON.parse(Buffer.from(cookie, "base64").toString("utf-8"));

    const accessToken = decoded?.access_token;

    if (!accessToken) {
      return { user: null, error: "Invalid session format" };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // server only
    );

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: "Failed to decode session" };
  }
}
