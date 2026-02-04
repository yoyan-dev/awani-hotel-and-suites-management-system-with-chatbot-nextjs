<!-- Context: project-intelligence/frontend-ui | Priority: critical | Version: 1.0 | Updated: 2026-02-04 -->

# Frontend Component & UI Standards

**Purpose**: HeroUI component patterns, Tailwind styling conventions, and reusable UI patterns.

## Component Structure

```typescript
// components/ui/RoomTable.tsx
"use client";
import { Button, Table, Chip, Spinner } from "@heroui/react";
import { useAppDispatch } from "@/store/hooks";

interface RoomTableProps {
  rooms: Room[];
  isLoading: boolean;
  onEdit: (room: Room) => void;
}

export function RoomTable({ rooms, isLoading, onEdit }: RoomTableProps) {
  return (
    <Table radius="sm" isHeaderSticky bottomContent={<Pagination />}>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={rooms} loadingContent={<Spinner />}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
```

## HeroUI Component Usage

| Component | Usage            | Example                                                 |
| --------- | ---------------- | ------------------------------------------------------- |
| Input     | Forms with icons | `<Input endContent={<Icon />} label="Email" />`         |
| Button    | Actions          | `<Button color="primary" radius="sm">Submit</Button>`   |
| Table     | Data grids       | `<Table isHeaderSticky bottomContent={<Pagination />}>` |
| Chip      | Status badges    | `<Chip color="success">Vacant</Chip>`                   |
| Form      | Form handling    | `<Form onSubmit={handleSubmit}>`                        |
| Spinner   | Loading state    | `<Spinner />`                                           |

## Status Color Mapping

```typescript
const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "secondary"
> = {
  vacant: "success",
  occupied: "warning",
  dirty: "danger",
  maintenance: "secondary",
  booked: "warning",
};
```

## Tailwind Variants Pattern

```typescript
// components/primitives.ts
import { tv } from "tailwind-variants";

export const card = tv({
  base: "rounded-lg border p-4",
  variants: {
    color: { default: "bg-white", primary: "bg-blue-500" },
    size: { sm: "p-2", md: "p-4", lg: "p-6" },
  },
});

export function Card({ children, color = "default" }: CardProps) {
  return <div className={card({ color })}>{children}</div>;
}
```

## Toast Notifications

```typescript
import { addToast } from "@heroui/react";

addToast({
  title: "Success",
  description: "Room updated successfully",
  color: "success",
});

addToast({
  title: "Error",
  description: error.message,
  color: "danger",
});
```

## Layout Pattern

```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
```

## 📂 Codebase References

| Pattern           | File                          | Description                 |
| ----------------- | ----------------------------- | --------------------------- |
| Table             | `app/admin/rooms/page.tsx`    | Data table with pagination  |
| Status chips      | `app/constants/rooms.ts`      | Status color mapping        |
| Form              | `app/auth/page.tsx`           | Login form with validation  |
| Toast             | `features/room/room-thunk.ts` | Error/success notifications |
| Layout            | `app/housekeeping/layout.tsx` | Dashboard layout            |
| Tailwind variants | `components/primitives.ts`    | Reusable style variants     |

## Related Files

- [Technical Domain](technical-domain.md) - Tech stack overview
- [UI Standards](context/ui/web/navigation.md) - Design system patterns
- [Component Library](context/development/frontend/react/navigation.md) - React patterns
