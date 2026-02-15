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
    return { user: decoded.user, error: null };
  } catch (err) {
    return { user: null, error: "Failed to decode session" };
  }
}
