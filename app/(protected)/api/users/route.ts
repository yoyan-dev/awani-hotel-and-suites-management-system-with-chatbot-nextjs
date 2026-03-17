import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { uploadUserImage } from "@/lib/upload-user-image";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: error.message,
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "",
          color: "success",
        },
        data: data.users,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const formObj = Object.fromEntries(formData.entries());
    const image = formData.get("image") as File;

    const {
      email,
      password,
      full_name,
      phone,
      gender,
      address,
      birthday,
      roles,
    } = formObj;

    const userData = {
      full_name,
      phone,
      gender,
      address,
      birthday,
      image: image ? await uploadUserImage(image) : "",
    };
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email as string,
      password: password as string,
      email_confirm: true,
      user_metadata: userData,
      app_metadata: {
        roles: (roles as string)?.split(",") ?? ["housekeeping"],
        department: (formObj.department as string) ?? "General",
        permissions: ["create", "update"],
      },
    });

    if (error) {
      console.error("Supabase create error:", error);
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Supabase Error",
            description: error.message,
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Account created successfully.",
          color: "success",
        },
        data: data.user,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Api Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}

// export async function DELETE(
//   request: Request,
// ): Promise<NextResponse<ApiResponse>> {
//   try {
//     const body = await request.json();
//     const selectedValues: string[] | "all" = body.selectedValues;

//     let query = supabase.from("users").delete();

//     if (selectedValues === "all") {
//     } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
//       query = query.in("id", selectedValues);
//     } else {
//       return NextResponse.json(
//         {
//           success: false,
//           message: {
//             title: "Error",
//             description: selectedValues,
//             color: "warning",
//           },
//         },
//         { status: 400 },
//       );
//     }

//     const { data, error } = await query;

//     if (error) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: {
//             title: "Error",
//             description: "Failed to delete users",
//             color: "error",
//           },
//           error: error.message,
//         },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: {
//         title: "Success",
//         description:
//           selectedValues === "all"
//             ? "All users deleted successfully"
//             : "Selected users deleted successfully",
//         color: "success",
//       },
//       data: data,
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: {
//           title: "Error",
//           description: "Something went wrong",
//           color: "error",
//         },
//         error: err.message,
//       },
//       { status: 500 },
//     );
//   }
// }
