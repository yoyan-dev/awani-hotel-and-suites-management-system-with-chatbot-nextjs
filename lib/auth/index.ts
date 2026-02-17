"use client";

import type { User, UserMetadata } from "@/types/users";

type StoredSession = {
  user_metadata?: UserMetadata;
  user?: User;
  email?: string;
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

/**
 * 🔥 Update entire stored session
 */
export function updateStoredSession(updates: Partial<StoredSession>) {
  const { session } = getStoredSession();
  if (!session) return;

  const updatedSession: StoredSession = {
    ...session,
    ...updates,
  };

  localStorage.setItem("sb-session", JSON.stringify(updatedSession));
}

/**
 * 🔥 Update user metadata
 */
export function updateStoredUser(updates: Partial<User>) {
  const { session } = getStoredSession();
  if (!session?.user) return;

  const updatedUser: User = {
    ...session.user,
    ...updates,
  };

  const updatedSession: StoredSession = {
    ...session,
    user: updatedUser,
  };

  localStorage.setItem("sb-session", JSON.stringify(updatedSession));
}
