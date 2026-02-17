import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";

const dbTable = "feedback";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase.from(dbTable).select(`*`, { count: "exact" });

  if (query) {
    q = q.or(
      `full_name.ilike.%${query}%,email.ilike.%${query}%,room_number.ilike.%${query}%,recommend.ilike.%${query}%,comments.ilike.%${query}%`,
    );
  }

  const { data, error, count } = await q
    .range(from, to)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching guest feedback:", error.message);
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

  console.log("guest feedback data:", data);
  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: data || [],
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

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();

    const formObj = Object.fromEntries(formData.entries());
    const newData = {
      full_name: formObj.full_name,
      email: formObj.email,
      room_number: formObj.room_number,
      check_in: formObj.check_in,
      check_out: formObj.check_out,
      comments: formObj.comments,
      rating: Number(formObj.rating),
      recommend: formObj.recommend,
    };
    console.log(newData);
    const { data, error } = await supabase
      .from(dbTable)
      .insert([newData])
      .select();

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
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Feedback successfully submitted.",
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

export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from(dbTable).delete();

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
            description: "Failed to delete guest feedback.",
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
