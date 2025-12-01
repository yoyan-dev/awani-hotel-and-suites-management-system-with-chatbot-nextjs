import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { uploadRoomImage } from "@/lib/upload-room-image";
import { ApiResponse } from "@/types/response";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase.from("function-rooms").select(
    `
    id,
    image,
    room_number,
    type,
    max_guest,
    size,
    description,
    bookings,
    status,
    remarks
  `,
    { count: "exact" }
  );

  if (query) {
    q = q.or(`
    description.ilike.%${query}%,
    remarks.ilike.%${query}%,
  `);
  }

  if (status) {
    q = q.eq("status", status);
  }

  const { data: roomData, error, count } = await q.range(from, to);

  if (error) {
    console.error("Error fetching function rooms:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 }
    );
  }

  console.log("Function rooms data:", roomData);
  const rooms = roomData || [];
  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: rooms,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    },
    { status: 201 }
  );
}

// CREATE room
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const roomNumber = Number(formData.get("room_number"));
    const formObj = Object.fromEntries(formData.entries());

    // const beds = JSON.parse(formObj.beds as string);
    // const facilities = JSON.parse(formObj.facilities as string);
    const file = formData.get("image") as File;

    const imageUrl = await uploadRoomImage(file, "FRN" + Number(roomNumber));

    const newRoom = {
      ...formObj,
      image: imageUrl,
      status: "available",
    };

    const { data, error } = await supabase
      .from("function-rooms")
      .insert([newRoom])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Error",
              description: "Room number already exists.",
              color: "danger",
            },
          },
          { status: 400 }
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
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Function Room added successfully",
          color: "success",
        },
        data: data[0],
      },
      { status: 201 }
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
      { status: 500 }
    );
  }
}

//DELETE MANY
export async function DELETE(
  request: Request
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("function-rooms").delete();

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
        { status: 400 }
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Failed to delete function rooms",
            color: "error",
          },
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        title: "Success",
        description:
          selectedValues === "all"
            ? "All rooms deleted successfully"
            : "Selected function rooms deleted successfully",
        color: "success",
      },
      data: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Something went wrong",
          color: "error",
        },
        error: err.message,
      },
      { status: 500 }
    );
  }
}
