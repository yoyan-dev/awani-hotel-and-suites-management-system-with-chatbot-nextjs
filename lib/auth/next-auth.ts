import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { supabase } from "@/lib/supabase-client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          throw new Error(error?.message || "Invalid login.");
        }

        const roles = Array.isArray(data.user.app_metadata?.roles)
          ? data.user.app_metadata.roles
          : [];

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name ?? null,
          image: data.user.user_metadata?.image ?? null,
          roles,
          user_metadata: data.user.user_metadata ?? {},
          app_metadata: data.user.app_metadata ?? {},
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as { roles?: string[] }).roles ?? [];
        token.user_metadata =
          (user as { user_metadata?: Record<string, unknown> }).user_metadata ??
          {};
        token.app_metadata =
          (user as { app_metadata?: Record<string, unknown> }).app_metadata ??
          {};
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.email = session.user.email ?? token.email;
        token.image = session.user.image ?? token.image;
        token.user_metadata = session.user.user_metadata ?? token.user_metadata;
        token.app_metadata = session.user.app_metadata ?? token.app_metadata;
        token.roles = session.user.roles ?? token.roles;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.name = typeof token.name === "string" ? token.name : null;
        session.user.email =
          typeof token.email === "string" ? token.email : null;
        session.user.image =
          typeof token.image === "string" ? token.image : null;
        session.user.roles = Array.isArray(token.roles) ? token.roles : [];
        session.user.user_metadata =
          (token.user_metadata as typeof session.user.user_metadata) ?? {};
        session.user.app_metadata =
          (token.app_metadata as typeof session.user.app_metadata) ?? {};
      }

      return session;
    },
  },
};
