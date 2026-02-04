<!-- Context: project-intelligence/function-booking | Priority: critical | Version: 2.2 | Updated: 2026-02-04 -->

# Function Hall Booking Completion Flow

**Purpose**: Booking workflow for events including function room assignment, occupancy-based validation, and confirmation.

## Booking Completion Workflow

### Step 1: Retrieve Booking Details

```typescript
// features/booking/function-hall/booking-thunk.ts
export const fetchBooking = createAsyncThunk<FunctionHallBooking, string>(
  "function-hall-booking/fetchBooking",
  async (id, { rejectWithValue }) => {
    const res = await fetch(`/api/bookings/function-hall/${id}`);
    const data = await res.json();
    if (!res.ok || !data.success) return rejectWithValue(data.message);
    return data.data;
  },
);
```

### Step 2: Validate Eligibility

```typescript
interface CompletionValidation {
  isEligible: boolean;
  reasons: string[];
}

export function validateBookingEligibility(
  booking: FunctionHallBooking,
): CompletionValidation {
  const reasons: string[] = [];

  if (!booking.id) reasons.push("Invalid booking ID");
  if (booking.status === "cancelled") reasons.push("Booking is cancelled");
  if (booking.status === "completed") reasons.push("Booking already completed");
  if (!booking.event_date) reasons.push("Missing event date");
  if (!booking.event_duration?.start || !booking.event_duration?.end) {
    reasons.push("Missing event duration");
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}
```

### Step 3: Occupancy-Based Room Assignment

```typescript
// features/function-room/function-room-thunk.ts
export const fetchAvailableFunctionRooms = createAsyncThunk<
  { data: FunctionRoom[] },
  FetchFunctionRoomParams | undefined
>("room/fetchAvailableFunctionRooms", async (params, { rejectWithValue }) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.event_date) searchParams.append("eventDate", params.event_date);
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);

    const res = await fetch(
      `/api/function-rooms/available-rooms?${searchParams.toString()}`,
    );
    const data = await res.json();

    if (!res.ok || !data.success) {
      addToast(data.message ?? "Failed to fetch rooms");
      return rejectWithValue(data.message ?? "Failed to fetch rooms");
    }

    return { data: data.data };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
```

The API returns rooms with computed fields:

```typescript
{
  status: "available" | "half occupied" | "full occupied",
  availability: "Available" | "Half occupied" | "Fully occupied",
  total_guests: number,
  remaining_slots: number,
}
```

### Step 4: Complete Booking with Room Assignment

```typescript
// app/api/bookings/function-hall/complete/route.ts
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { booking_id, room_id, occupancy_type } = await req.json();

    // Validate booking eligibility
    const { data: booking, error: fetchError } = await supabase
      .from("function_hall_bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Booking not found",
            color: "danger",
          },
        },
        { status: 404 },
      );
    }

    // Check room availability with strict validation
    const { data: existingBookings, error: conflictError } = await supabase
      .from("function_hall_bookings")
      .select("id, event_date, event_duration, number_of_guest")
      .eq("room_id", room_id)
      .neq("status", "cancelled")
      .neq("id", booking_id);

    const hasConflict = existingBookings?.some((b) => {
      const eventDate = new Date(b.event_date);
      const existingStart = new Date(b.event_duration.start);
      const existingEnd = new Date(b.event_duration.end);
      const newStart = new Date(booking.event_duration.start);
      const newEnd = new Date(booking.event_duration.end);

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Conflict",
            description: "Room not available",
            color: "warning",
          },
        },
        { status: 409 },
      );
    }

    // Update booking with room assignment
    const { data: updated, error: updateError } = await supabase
      .from("function_hall_bookings")
      .update({
        room_id,
        occupancy_type,
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Booking completed",
          color: "success",
        },
        data: updated,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: { title: "Error", description: err.message, color: "danger" },
      },
      { status: 500 },
    );
  }
}
```

## Occupancy Logic

```typescript
function determineOccupancy(
  roomMaxGuests: number,
  currentGuests: number,
  newBookingGuests: number,
): "available" | "half occupied" | "full occupied" {
  const totalAfterBooking = currentGuests + newBookingGuests;

  if (totalAfterBooking === 0) return "available";
  if (totalAfterBooking >= roomMaxGuests) return "full occupied";
  return "half occupied";
}

// Usage with availability validation
const availability = checkRoomAvailability(eventDate, start, end, guestCount);
const suitableRooms = availability.filter(
  (r) =>
    r.available_for_booking ||
    (r.occupancy === "available" && r.max_guests >= guestCount),
);
```

## Booking Completion Thunk

```typescript
// features/booking/function-hall/booking-thunk.ts
export const completeBooking = createAsyncThunk<
  FunctionHallBooking,
  { bookingId: string; roomId: string; occupancyType: string }
>(
  "function-hall-booking/completeBooking",
  async ({ bookingId, roomId, occupancyType }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/bookings/function-hall/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          room_id: roomId,
          occupancy_type: occupancyType,
        }),
      });
      const data = await res.json();

      addToast(data.message);
      if (!res.ok || !data.success) {
        return rejectWithValue(
          data.message?.description ?? "Failed to complete booking",
        );
      }
      return data.data;
    } catch (err: any) {
      addToast({ title: "Error", description: err.message, color: "danger" });
      return rejectWithValue(err.message);
    }
  },
);
```

## Status Flow

```
Pending/Reserved → Confirmed → In Progress → Completed
                              ↓
                        Cancelled
```

## 📂 Codebase References

| Pattern       | File                                                                  | Description            |
| ------------- | --------------------------------------------------------------------- | ---------------------- |
| Fetch booking | `features/booking/function-hall/booking-thunk.ts`                     | Get booking details    |
| Availability  | `app/api/function-rooms/available-rooms/route.ts`                     | Calculate occupancy    |
| Complete API  | `app/api/bookings/function-hall/complete/route.ts`                    | Completion endpoint    |
| Booking thunk | `features/booking/function-hall/booking-thunk.ts`                     | All booking operations |
| API GET/POST  | `app/api/bookings/function-hall/route.ts`                             | CRUD operations        |
| Assign page   | `app/admin/bookings/function-hall-bookings/assign-room/[id]/page.tsx` | Room assignment UI     |
| Types         | `types/function-room-booking.d.ts`                                    | Booking interfaces     |
| Constants     | `app/constants/function-hall-booking.ts`                              | Status options         |

## Related Files

- [Technical Domain](technical-domain.md) - Architecture overview
- [Backend Patterns](backend-api-database.md) - API conventions

## Files Modified

| File                                                                  | Change                                         |
| --------------------------------------------------------------------- | ---------------------------------------------- |
| `app/api/bookings/function-hall/complete/route.ts`                    | Created - Completion endpoint                  |
| `app/api/function-rooms/available-rooms/route.ts`                     | Occupancy calculation                          |
| `features/function-room/function-room-thunk.ts`                       | Fixed return structure (`{ data: data.data }`) |
| `features/booking/function-hall/booking-thunk.ts`                     | Added completeBooking thunk                    |
| `features/booking/function-hall/booking-slice.ts`                     | Added completeBooking reducer                  |
| `hooks/use-function-hall-bookins.ts`                                  | Added completeBooking hook                     |
| `types/function-room.d.ts`                                            | Added availability_status field                |
| `app/admin/bookings/function-hall-bookings/assign-room/[id]/page.tsx` | Completion UI                                  |
