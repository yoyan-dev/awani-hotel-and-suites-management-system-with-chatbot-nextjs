import { ApiRouteError } from "@/lib/api/route-error";
import { uploadUserImage } from "@/lib/upload-user-image";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function listUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    throw new ApiRouteError(error.message, { status: 400 });
  }

  return data.users;
}

export async function createUser(formData: FormData) {
  const formObj = Object.fromEntries(formData.entries());
  const image = formData.get("image") as File;
  const userData = {
    full_name: formObj.full_name,
    phone: formObj.phone,
    gender: formObj.gender,
    address: formObj.address,
    birthday: formObj.birthday,
    image: image ? await uploadUserImage(image) : "",
  };

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: String(formObj.email ?? ""),
    password: String(formObj.password ?? ""),
    email_confirm: true,
    user_metadata: userData,
    app_metadata: {
      roles: String(formObj.roles ?? "housekeeping").split(","),
      department: String(formObj.department ?? "General"),
      permissions: ["create", "update"],
    },
  });

  if (error) {
    throw new ApiRouteError(error.message, {
      status: 400,
      title: "Supabase Error",
    });
  }

  return data.user;
}
