"use client";

import { getSession } from "next-auth/react";

import type { User } from "@/types/users";

type StoredSession = {
  user?: User;
};

export async function getStoredSession() {
  const session = await getSession();

  if (!session?.user) {
    return { session: null, error: "No session found" };
  }

  return {
    session: { user: session.user as User } satisfies StoredSession,
    error: null,
  };
}

export async function getCurrentUser() {
  const { session, error } = await getStoredSession();
  return { user: session?.user ?? null, error };
}

export async function getCurrentUserRoles() {
  const { session } = await getStoredSession();
  const roles = session?.user?.app_metadata?.roles;
  return Array.isArray(roles) ? [...roles] : [];
}

export async function updateStoredSession() {
  return;
}

export async function updateStoredUser() {
  return;
}
