<!-- Context: project-intelligence/backend-api-db | Priority: critical | Version: 1.0 | Updated: 2026-02-04 -->

# Backend, API & Database Patterns

**Purpose**: REST API conventions, Supabase database access, and data flow patterns for hotel operations.

## API Route Pattern

```typescript
// app/api/rooms/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");

  let q = supabase
    .from("rooms")
    .select("*, room_type:room_type_id(*)", { count: "exact" });

  if (query) {
    q = q.or(`room_id.ilike.%${query}%, description.ilike.%${query}%`);
  }

  const { data, error, count } = await q.range(from, to).order("room_type_id");

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
      message: { title: "Success", description: "", color: "success" },
      data,
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
```

## Standard Response Interface

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: { title: string; description: any; color: "success" | "danger" };
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

## Supabase Client Pattern

```typescript
// lib/supabase/supabase-client.ts
import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
```

## Database Types

```typescript
// types/supabase.d.ts (generated from Supabase CLI)
export type Database = {
  public: {
    Tables: {
      rooms: { Row; Insert; Update; Relationships };
      bookings: { Row; Insert; Update; Relationships };
      guest: { Row; Insert; Update; Relationships };
      // ... more tables
    };
  };
};
```

## Query Patterns

| Pattern                   | Example                                   |
| ------------------------- | ----------------------------------------- |
| Select with relationships | `.select("*, room_type:room_type_id(*)")` |
| Pagination                | `.range(from, to)`                        |
| Search                    | `.or(`field.ilike.%${query}%, ...`)`      |
| Count                     | `{ count: "exact" }`                      |
| Filter                    | `.eq("status", "vacant")`                 |

## Error Handling

```typescript
try {
  const { data, error } = await supabase.from("table").select("*");
  if (error) throw error;
  return data;
} catch (error: any) {
  return NextResponse.json(
    {
      success: false,
      message: { title: "Error", description: error.message, color: "danger" },
    },
    { status: 500 },
  );
}
```

## 📂 Codebase References

| Pattern         | File                              | Description                  |
| --------------- | --------------------------------- | ---------------------------- |
| API route       | `app/api/rooms/route.ts`          | GET with pagination + search |
| POST handler    | `app/api/rooms/route.ts`          | POST with form data          |
| Thunk           | `features/room/room-thunk.ts`     | Async action calling API     |
| Supabase client | `lib/supabase/supabase-client.ts` | Browser client               |
| Server client   | `lib/supabase/server.ts`          | Server with cookies          |
| Types           | `types/supabase.d.ts`             | Generated database types     |

## Related Files

- [Technical Domain](technical-domain.md) - Architecture overview
- [API Routes](context/development/backend/navigation.md) - Backend patterns
- [Supabase Integration](context/development/integration/navigation.md) - Database integration
