import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getUserRecordById(id: string) {
  const { data, error } = await supabase
    .from("users" as any)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}

export async function updateUserById(id: string, body: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, body);

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 400,
      color: "danger",
    });
  }

  return data.user;
}

export async function deleteUserById(id: string) {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    throw new ApiRouteError(`DB Error: ${error.message}`, {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function updateCurrentUserProfile(body: Record<string, any>) {
  const {
    user,
    email,
    current_password,
    new_password,
    confirm_password,
    user_metadata,
  } = body;

  if (new_password) {
    if (!current_password) {
      throw new ApiRouteError("Current password is required", {
        status: 400,
        color: "error",
      });
    }

    if (new_password !== confirm_password) {
      throw new ApiRouteError(
        "New password and confirm password do not match",
        {
          status: 400,
          title: "Password Mismatch",
          color: "error",
        },
      );
    }

    if (current_password === new_password) {
      throw new ApiRouteError(
        "New password cannot be the same as old password",
        {
          status: 400,
          title: "Invalid Password",
          color: "warning",
        },
      );
    }

    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email,
      password: current_password,
    });

    if (signInError) {
      throw new ApiRouteError("Current password is incorrect", {
        status: 400,
        title: "Incorrect Password",
        color: "error",
      });
    }
  }

  const updatePayload: Record<string, unknown> = {};
  if (email) updatePayload.email = email;
  if (user_metadata) updatePayload.user_metadata = user_metadata;
  if (new_password) updatePayload.password = new_password;

  await supabaseAdmin.auth.admin.updateUserById(user.id, updatePayload);

  return {
    description: new_password
      ? "Account and password updated successfully"
      : "Account updated successfully",
  };
}
