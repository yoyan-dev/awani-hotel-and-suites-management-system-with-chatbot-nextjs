import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Guest } from "@/types/guest";
import { uploadUserImage } from "../../../../lib/upload-user-image";
import { uploadValidIDImage } from "@/lib/upload-valid-id";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const { data: guest, error } = await supabase.from("guest").select("*");

  if (error) {
    console.error("Error fetching guests:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  console.log("Guests data:", guest);
  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: guest || [],
    },
    { status: 201 },
  );
}

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();

    const {
      id,
      full_name,
      contact_number,
      address,
      nationality,
      gender,
      email,
    } = Object.fromEntries(formData.entries());

    const imageFile = (formData.get("image") as File) || null;
    const frontImageFile = (formData.get("front") as File) || null;
    const backImageFIle = (formData.get("back") as File) || null;

    // if (!frontImageFile || !backImageFIle) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: {
    //         title: "Error",
    //         description: "Please provide a valid ID.",
    //         color: "danger",
    //       },
    //     },
    //     { status: 400 }
    //   );
    // }

    const validIdImage = await uploadValidIDImage(
      frontImageFile,
      backImageFIle,
    );

    const newData = {
      id,
      full_name,
      contact_number,
      address,
      nationality,
      gender,
      email,
      image: await uploadUserImage(imageFile),
      valid_id: { front: validIdImage.front, back: validIdImage.back },
    };
    const { data, error } = await supabase
      .from("guest")
      .insert([newData])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Error",
              description: "Guest already exists.",
              color: "danger",
            },
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: error.message,
            color: "danger",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "",
          description: "",
          color: "success",
        },
        data: data[0] || {},
      },
      { status: 201 },
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

//DELETE SELECTED
export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("guest").delete();

    if (selectedValues === "all") {
    } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      query = query.in("id", selectedValues);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: selectedValues,
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Failed to delete items.",
            color: "error",
          },
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        title: "Success",
        description:
          selectedValues === "all"
            ? "All items deleted successfully"
            : "Selected items deleted successfully",
        color: "success",
      },
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "error",
        },
        error: err.message,
      },
      { status: 500 },
    );
  }
}
