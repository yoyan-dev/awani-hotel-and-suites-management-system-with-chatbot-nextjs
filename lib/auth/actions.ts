"use server";

import { cookies } from "next/headers";
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

  // ✅ Get mutable cookies
  const cookieStore = await cookies(); // do NOT await it

  // Save session in HttpOnly cookie
  if (data.session) {
    const sessionCookie = Buffer.from(JSON.stringify(data.session)).toString(
      "base64",
    );

    cookieStore.set({
      name: "sb-session",
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  const roles: string[] = data.user?.app_metadata?.roles || [];

  revalidatePath("/", "layout");

  if (roles.includes("admin")) redirect("/admin");
  else if (roles.includes("housekeeping")) redirect("/housekeeping");
  else redirect("/guest");
}

// export async function signup(email: string, password: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) {
//     redirect("/error");
//   }

//   // Optionally store session if auto-login is enabled after signup
//   if (data.session) {
//     const sessionCookie = Buffer.from(JSON.stringify(data.session)).toString(
//       "base64",
//     );
//     cookies().set({
//       name: "sb-session",
//       value: sessionCookie,
//       httpOnly: true,
//       secure: true,
//       path: "/",
//       sameSite: "lax",
//       maxAge: data.session?.expires_in,
//     });
//   }

//   revalidatePath("/", "layout");
//   redirect("/account");
// }
