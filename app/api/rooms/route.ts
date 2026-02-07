import { NextResponse } from "next/server";
import type { Room } from "@/types/room";
import { supabase } from "@/lib/supabase-client";
import { uploadRoomImage } from "@/lib/upload-room-image";
import { ApiResponse } from "@/types/response";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q") || "";
  const roomTypeID = searchParams.get("roomTypeID") || "";
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase.from("rooms").select(
    `
    id,
    room_id,
    room_number,
    room_type_id,
    room_type:room_type_id (*),
    area,
    description,
    status,
    remarks,
    bookings
  `,
    { count: "exact" },
  );

  if (query) {
    q = q.or(`
    room_id.ilike.%${query}%,
    description.ilike.%${query}%,
    remarks.ilike.%${query}%,
    area.ilike.%${query}%
  `);
  }

  if (roomTypeID) {
    q = q.eq("room_type_id", roomTypeID);
  }

  if (status) {
    q = q.eq("status", status);
  }

  const {
    data: roomData,
    error,
    count,
  } = await q.range(from, to).order("room_type_id", { ascending: true });

  const orderByRoomTypes = roomData?.sort((a: any, b: any) => {
    return a.room_type?.name.localeCompare(b.room_type?.name);
  });

  if (error) {
    console.error("Error fetching rooms:", error.message);
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

  console.log("Room data:", orderByRoomTypes);
  const rooms = orderByRoomTypes || [];
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
        total_pages: Math.ceil((count ?? 0) / limit),
      },
    },
    { status: 201 },
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
    const images = formData.getAll("images") as File[];

    const imageUrls = await Promise.all(
      images.map(async (file) => {
        if (!file || file.size === 0) throw new Error("File missing or empty");

        const imageUrl = await uploadRoomImage(file, Number(roomNumber));
        return imageUrl;
      }),
    );

    const newRoom = {
      ...formObj,
      room_id: `RM-${roomNumber}`,
      images: imageUrls,
    };

    const { data, error } = await supabase
      .from("rooms")
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
          title: "Success",
          description: "Room added successfully",
          color: "success",
        },
        data: data[0],
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

//DELETE MANY
export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("rooms").delete();

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
            description: "Failed to delete rooms",
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
            ? "All rooms deleted successfully"
            : "Selected rooms deleted successfully",
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
      { status: 500 },
    );
  }
}
