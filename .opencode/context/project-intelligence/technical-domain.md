<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.0 | Updated: 2026-02-04 -->

# Technical Domain

**Purpose**: Tech stack, architecture patterns, and data flow conventions for the Awani Hotel Management System.

## Quick Reference

| Layer      | Technology    | Version | Purpose                                  |
| ---------- | ------------- | ------- | ---------------------------------------- |
| Framework  | Next.js       | 16.0.7  | App Router with Server/Client components |
| Language   | TypeScript    | 5.9.3   | Type-safe development                    |
| UI Library | HeroUI        | 2.8.5   | React component library                  |
| Styling    | Tailwind CSS  | 4.1.17  | Utility-first CSS                        |
| State      | Redux Toolkit | 2.x     | Feature-based state management           |
| Backend    | Supabase      | -       | Auth + PostgreSQL database               |
| Build      | Turbopack     | -       | Fast development/builds                  |

## Architecture Pattern

**Type**: Monolith with feature-based modularity  
**Pattern**: Next.js App Router + Redux Toolkit + Supabase

### Why This Architecture?

- **Next.js App Router**: Server components for data fetching, client components for interactivity
- **Redux Toolkit**: Centralized state for complex hotel operations (bookings, rooms, guests)
- **Supabase**: Integrated auth + database reduces infrastructure complexity

## Project Structure

```
awani-hotel-management-system/
├── app/                    # Next.js pages, layouts, API routes
│   ├── admin/             # Admin dashboard routes
│   ├── guest/             # Guest-facing routes
│   ├── housekeeping/      # Housekeeping module
│   ├── auth/              # Authentication routes
│   └── api/               # REST API endpoints
├── features/              # Redux slices + async thunks (13 modules)
│   ├── room/, booking/, guest/, housekeeping/
│   ├── inventory/, staff/, users/
│   └── analytics/, banquet_*/
├── components/            # Shared UI components
│   ├── ui/               # Reusable primitives
│   └── dashboard/        # Dashboard widgets
├── lib/                  # Core libraries
│   └── supabase/         # Supabase client setup
├── store/                # Redux store + typed hooks
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
└── constants/            # Status options, enums
```

## Key Technical Decisions

| Decision                   | Rationale                                             | Impact                              |
| -------------------------- | ----------------------------------------------------- | ----------------------------------- |
| Redux Toolkit over Context | Complex multi-feature state (bookings, rooms, guests) | Predictable state updates, DevTools |
| HeroUI components          | Consistent hotel management UI                        | Faster development, accessibility   |
| Feature-based organization | Domain-driven separation                              | Easier navigation, maintainability  |
| Supabase for auth + DB     | Integrated solution                                   | Reduced infrastructure, type safety |
| REST API routes            | Standard Next.js pattern                              | Clear data flow, testability        |

## Integration Points

| System               | Purpose             | Protocol | Direction |
| -------------------- | ------------------- | -------- | --------- |
| Supabase Auth        | User authentication | REST     | Internal  |
| PostgreSQL           | Hotel data storage  | SQL      | Internal  |
| Google Generative AI | AI features         | REST API | Outbound  |

## State Management Pattern

```typescript
// features/room/room-slice.ts
interface RoomState {
  rooms: Room[];
  isLoading: boolean;
  error?: string;
}

// features/room/room-thunk.ts
export const fetchRooms = createAsyncThunk<...>("room/fetchRooms", async (_, { rejectWithValue }) => {
  const res = await fetch("/api/rooms");
  const data = await res.json();
  if (!data.success) return rejectWithValue(data.message);
  return data;
});
```

## API Response Standard

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: { title: string; description: any; color: "success" | "danger" };
  data?: T;
  pagination?: { page; limit; total; total_pages };
}
```

## Development Environment

```
Setup: npm install
Local Dev: npm run dev
Build: npm run build
Type Check: npm run type-check (if available)
```

## Onboarding Checklist

- [ ] Understand feature-based Redux organization
- [ ] Know API route patterns in app/api/
- [ ] Familiar with HeroUI + Tailwind styling
- [ ] Understand role-based auth (admin, housekeeping, guest)
- [ ] Can add new feature with slice + thunk + hook pattern

## 📂 Codebase References

| Pattern         | File                              | Description                      |
| --------------- | --------------------------------- | -------------------------------- |
| Redux slice     | `features/room/room-slice.ts`     | State definition + reducers      |
| Async thunk     | `features/room/room-thunk.ts`     | API calls with error handling    |
| Custom hook     | `hooks/use-rooms.ts`              | Typed dispatch + selector        |
| API route       | `app/api/rooms/route.ts`          | REST endpoint with pagination    |
| Supabase client | `lib/supabase/supabase-client.ts` | Browser client setup             |
| Auth action     | `lib/auth/actions.ts`             | Server action with role redirect |

## Related Files

- [Business Domain](business-domain.md) - Hotel operations context
- [Decisions Log](decisions-log.md) - Architectural decision history
- [Development Navigation](context/development/navigation.md) - Framework patterns
