# Admin Dashboard - Todo List

## Overview

This document tracks all unfinished pages and features for the Admin Dashboard section of the Awani Hotel Management System.

---

## Completed Pages ✅

### Analytics Dashboard

- `/admin/page.tsx` - Main analytics dashboard with KPIs, charts, and data visualization
- `/admin/dashboard/dashboard-layout.tsx` - Reusable UI components (DashboardCard, KPICard, StatGrid, ProgressBar, Badge)

### Housekeeping Dashboard

- `/housekeeping/page.tsx` - Housekeeping operations dashboard with room status, cleaning progress, today's operations

### Bookings Management

- `/admin/bookings/overview/page.tsx` - Enhanced booking overview with real data, filters, and statistics cards

---

## High Priority - Core Features 🚨

### 1. Bookings Management

#### `/admin/bookings/overview/page.tsx`

- **Status**: ✅ COMPLETED
- **Completed**:
  - [x] Connect to Redux booking slice (useAppSelector + dispatch)
  - [x] Add real data fetching with filters (search, status, date range)
  - [x] Implement booking statistics cards (KPICard with revenue, occupancy, check-ins)
  - [x] Add booking list table with status badges
  - [x] Fix API response format mismatch in booking thunk

#### `/admin/bookings/room-bookings/page.tsx`

- **Status**: Page exists with ID route
- **Required**:
  - [ ] Implement room booking list view
  - [ ] Add booking creation modal/form
  - [ ] Connect to booking API endpoints
  - [ ] Add status filtering (pending, confirmed, checked-in, checked-out)
  - [ ] Implement booking detail view

#### `/admin/bookings/function-hall-bookings/page.tsx`

- **Status**: Page exists with ID route
- **Required**:
  - [ ] Implement function hall booking list
  - [ ] Add event type filtering
  - [ ] Connect to function hall booking API
  - [ ] Add booking form with banquet package selection
  - [ ] Implement calendar view for venue availability

#### `/admin/bookings/calendar/page.tsx`

- **Status**: Basic structure exists
- **Required**:
  - [ ] Integrate fullcalendar library
  - [ ] Display room bookings on calendar
  - [ ] Add drag-and-drop booking creation
  - [ ] Implement booking conflict detection
  - [ ] Add color-coded status indicators

---

### 2. Rooms Management

#### `/admin/rooms/hotel-rooms/page.tsx`

- **Status**: Page exists with ID route
- **Required**:
  - [ ] Implement room grid/list view
  - [ ] Add room status filters (available, occupied, maintenance, cleaning)
  - [ ] Connect to rooms API endpoints
  - [ ] Add room creation/edit modal
  - [ ] Implement room status update functionality
  - [ ] Add room images gallery

#### `/admin/rooms/room-types/page.tsx`

- **Status**: Basic structure exists (52 lines)
- **Required**:
  - [ ] Implement room type cards
  - [ ] Add pricing configuration (regular/peak season)
  - [ ] Connect to room-types API
  - [ ] Add room type creation/editing
  - [ ] Implement amenities management
  - [ ] Add room type images upload

#### `/admin/rooms/function-rooms/page.tsx`

- **Status**: Has new-room subpage
- **Required**:
  - [ ] Implement function room list
  - [ ] Add capacity-based filtering
  - [ ] Connect to function-rooms API
  - [ ] Add room creation with type selection
  - [ ] Implement availability calendar

#### `/admin/rooms/function-rooms/new-room/page.tsx`

- **Status**: Empty directory
- **Required**:
  - [ ] Create new function room form
  - [ ] Add room number, type, capacity fields
  - [ ] Implement image upload
  - [ ] Add description and amenities
  - [ ] Connect to API POST endpoint

---

## Medium Priority - Operations 📋

### 3. Banquet Management

#### `/admin/banquet/page.tsx`

- **Status**: Directory exists, page not created
- **Required**:
  - [ ] Create main banquet dashboard
  - [ ] Add quick stats (upcoming events, revenue)
  - [ ] Connect to banquet API

#### `/admin/banquet/menus/page.tsx`

- **Status**: Basic structure exists
- **Required**:
  - [ ] Implement menu item list
  - [ ] Add category filtering (appetizer, main course, dessert, etc.)
  - [ ] Connect to banquet menus API
  - [ ] Add menu item creation/editing
  - [ ] Implement menu pricing

#### `/admin/banquet/packages/page.tsx`

- **Status**: Basic structure exists
- **Required**:
  - [ ] Implement package cards
  - [ ] Add package pricing per cover
  - [ ] Connect to banquet packages API
  - [ ] Add package creation with menu selection
  - [ ] Implement package activation/deactivation

---

### 4. Inventory Management

#### `/admin/inventory/page.tsx`

- **Status**: Basic structure exists
- **Required**:
  - [ ] Implement inventory list table
  - [ ] Add category filtering
  - [ ] Connect to inventory API
  - [ ] Add stock quantity management
  - [ ] Implement low stock alerts
  - [ ] Add item creation/editing
  - [ ] Implement inventory reports

---

### 5. Guest Requests

#### `/admin/guest-requests/page.tsx`

- **Status**: Basic structure exists
- **Required**:
  - [ ] Implement request list with status filters
  - [ ] Connect to guest-requests API
  - [ ] Add request assignment to staff
  - [ ] Implement status update workflow
  - [ ] Add request priority management
  - [ ] Connect to housekeeping for room requests

---

## Lower Priority - Support Features 📝

### 6. User Management

#### `/admin/accounts/page.tsx`

- **Status**: Basic structure exists (90 lines)
- **Required**:
  - [ ] Implement staff list table
  - [ ] Connect to staff API endpoints
  - [ ] Add role-based access control display
  - [ ] Implement staff creation/editing
  - [ ] Add shift management
  - [ ] Implement status activation/deactivation

---

### 7. Settings & Configuration

#### `/admin/settings/page.tsx`

- **Status**: Very basic (23 lines)
- **Required**:
  - [ ] Create settings categories (General, Notifications, Integrations)
  - [ ] Implement hotel profile settings
  - [ ] Add notification preferences
  - [ ] Connect to settings API (if exists)
  - [ ] Implement theme customization
  - [ ] Add business hours configuration

---

### 8. Feedback Management

#### `/admin/feedback/page.tsx`

- **Status**: Stub file (6 lines) - NOT STARTED
- **Required**:
  - [ ] Create feedback list view
  - [ ] Add rating/comment display
  - [ ] Connect to feedback API (if table exists)
  - [ ] Implement feedback categorization
  - [ ] Add response functionality
  - [ ] Implement feedback analytics

---

## Missing Pages - Need Creation 📋

### 9. Reports & Analytics

#### `/admin/reports/page.tsx` - NEW

- **Required**:
  - [ ] Create reports dashboard
  - [ ] Add revenue reports
  - [ ] Implement occupancy reports
  - [ ] Add booking reports by source
  - [ ] Connect to analytics data
  - [ ] Implement date range filtering
  - [ ] Add export functionality (PDF, Excel)

#### `/admin/reports/daily/page.tsx` - NEW

- **Required**:
  - [ ] Create daily summary view
  - [ ] Add check-in/check-out counts
  - [ ] Implement revenue breakdown
  - [ ] Connect to daily analytics API

#### `/admin/reports/monthly/page.tsx` - NEW

- **Required**:
  - [ ] Create monthly summary
  - [ ] Add trend charts
  - [ ] Implement comparison views
  - [ ] Connect to monthly analytics API

---

### 10. Staff Management

#### `/admin/staff/page.tsx` - NEW

- **Required**:
  - [ ] Create staff directory
  - [ ] Add role/position filtering
  - [ ] Connect to staff API
  - [ ] Implement shift scheduling
  - [ ] Add performance metrics
  - [ ] Implement leave management

---

### 11. Archive Management

#### `/admin/archives/page.tsx` - NEW

- **Required**:
  - [ ] Create archive view
  - [ ] Connect to archives API
  - [ ] Add historical booking search
  - [ ] Implement guest history lookup
  - [ ] Add export functionality

---

## Backend/API Requirements 📡

### Existing API Endpoints (Need Verification)

- `/api/accounts` - Needs testing and documentation
- `/api/analytics` - Completed with bookings, function-hall-bookings, rooms, function-rooms
- `/api/banquet` - Needs completion
- `/api/banquet-packages` - Basic structure
- `/api/bookings` - Needs enhancement
- `/api/function-rooms` - Needs completion
- `/api/guest` - Basic structure
- `/api/guest-requests` - Needs completion
- `/api/housekeeping` - Completed with rooms, operations
- `/api/inventory` - Needs completion
- `/api/room-types` - Needs completion
- `/api/rooms` - Needs completion
- `/api/staff` - Needs completion
- `/api/users` - Needs completion

### Missing API Endpoints (Need Creation)

- [ ] `/api/reports` - For report generation
- `/api/archives` - For historical data
- `/api/settings` - For app configuration
- `/api/feedback` - For guest feedback

---

## UI/UX Improvements 🎨

### Reusable Components Needed

- [ ] DataTable with sorting, filtering, pagination
- [ ] DateRangePicker for analytics
- [ ] Modal/Dialog for forms
- [ ] Toast notifications system
- [ ] Loading skeletons
- [ ] Empty state components
- [ ] Confirm dialogs for destructive actions

### Theme & Styling

- [ ] Consistent Hero UI component usage
- [ ] Responsive design verification
- [ ] Dark mode support
- [ ] Print-friendly layouts for reports

---

## Testing Requirements 🧪

### Unit Tests Needed

- [ ] Redux slices tests
- [ ] API endpoint tests
- [ ] Component rendering tests
- [ ] Hook tests

### Integration Tests Needed

- [ ] Booking flow tests
- [ ] Room status update flow
- [ ] Authentication flow

---

## Documentation 📚

### Needed Documentation

- [ ] API endpoint documentation
- [ ] Component usage guide
- [ ] State management guide
- [ ] Deployment guide

---

## Priority Summary

| Priority  | Pages                                     | Status      |
| --------- | ----------------------------------------- | ----------- |
| 🚨 High   | Bookings (4 subpages), Rooms (3 subpages) | In Progress |
| 📋 Medium | Banquet (2), Inventory, Guest Requests    | Not Started |
| 📝 Low    | Accounts, Settings, Feedback              | Not Started |
| ✨ New    | Reports (3), Staff, Archives              | Not Started |

---

## Quick Start Tasks

1. **Complete Bookings Management** - Most critical for hotel operations
2. **Enhance Rooms Management** - Room inventory is core functionality
3. **Implement Banquet Management** - Secondary revenue source
4. **Build Reports Dashboard** - Business insights needed

---

_Last Updated: February 1, 2024_
_Project: Awani Hotel Management System_
