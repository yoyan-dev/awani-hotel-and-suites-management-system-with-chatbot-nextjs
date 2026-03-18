# AI Development Task

This document defines the structural rules for this project.
Any AI assistant modifying this codebase must follow these rules.

---

# Primary Goal

Maintain a **clean, modular, and uniform architecture** across the entire project.

The purpose of this task is to keep the codebase:

- modular
- component-based
- easy to understand
- easy to maintain
- composed of small focused files

---

# Critical Rule

Do NOT change:

- application behavior
- feature flow
- API logic
- data structure
- existing functionality

This task is strictly about **refactoring structure and modularity**.

---

# Admin Page Structure

Every admin page must follow this structure:

pages/admin/{feature}/
index.vue
\_components/

Example:

pages/admin/products/
index.vue
\_components/
product-table.tsx
product-form.tsx
product-modal.tsx

pages/admin/categories/
index.vue
\_components/
category-table.tsx
category-form.tsx

---

# Important Restriction

Only `_components` may exist inside page folders.

Do NOT create the following inside page folders:

- \_services
- \_types
- \_composables
- \_constants

All logic must live in root-level folders.

---

# Root Architecture

components/
reusable UI across the entire application

composables/
reusable Vue logic

services/
API requests and business logic

types/
TypeScript interfaces

utils/
helper functions

constants/
configuration values

stores/
global state management

---

# Component Rules

Components must be:

- small
- focused
- single responsibility

Examples of components:

- tables
- filters
- forms
- modals
- headers
- action bars

Large components must be split into smaller components.

---

# Page Rules

Page files should:

- orchestrate the layout
- import components
- call composables/services

Pages must **not contain heavy logic**.

---

# Refactoring Guidelines

When modifying code:

1. Explore the project structure first.
2. Detect large files.
3. Split large files into smaller modules.
4. Extract reusable logic.
5. Keep components modular.
6. Maintain consistent structure across all admin pages.

---

# Final Goal

The project should maintain:

- consistent structure
- modular architecture
- small readable files
- clear separation of concerns

# Refactor the API structure only.

This project is maintained by one developer, so keep the architecture simple, practical, and easy to maintain.

Goals:

- make the API structure uniform
- keep files small as much as possible
- keep logic modular
- avoid crowded route handlers
- improve readability and maintainability
- do not change existing behavior or flow

API structure rules:

- use `app/api/{feature}/route.ts`
- use `app/api/{feature}/[id]/route.ts` for single-resource routes
- keep route handlers very small
- route handlers should only:
  - parse request
  - validate input
  - call service
  - return response

Do not put heavy business logic inside route handlers.

Use root folders for API logic:

- services/
- validations/
- lib/
- types/

Folder responsibilities:

- services/ = business logic and reusable API logic
- validations/ = request validation
- lib/ = db access, response helpers, error helpers
- types/ = shared interfaces and types

Refactor rules:

- make files smaller as much as possible
- split files with multiple responsibilities
- maintain consistent structure across all API features
- preserve existing behavior exactly
- do not over-engineer for a single developer workflow

Final goal:
A simple, clean, modular, and uniform API structure that is easy for one developer to manage.
