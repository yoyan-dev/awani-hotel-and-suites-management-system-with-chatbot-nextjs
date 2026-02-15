"use client";

import type { User } from "@/types/users";

type StoredSession = {
  user?: User;
  access_token?: string;
};

export function getStoredSession() {
  const sessionStr = localStorage.getItem("sb-session");
  if (!sessionStr) {
    return { session: null, error: "No session found" };
  }

  try {
    const session = JSON.parse(sessionStr) as StoredSession;
    if (!session?.user) {
      return { session: null, error: "Invalid session payload" };
    }
    return { session, error: null };
  } catch {
    return { session: null, error: "Invalid session payload" };
  }
}

export function getCurrentUser() {
  const { session, error } = getStoredSession();
  return { user: session?.user ?? null, error };
}

export function getCurrentUserRoles() {
  const { session } = getStoredSession();
  const roles = session?.user?.app_metadata?.roles;
  return Array.isArray(roles) ? [...roles] : [];
}
