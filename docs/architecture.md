# Architecture

## Overview

This learning platform uses a modular Next.js App Router structure with route groups for distinct areas: public, auth, admin, student, and teacher.

## Route Groups and URL Mapping

| Route group | URL examples | Purpose |
|-------------|--------------|---------|
| `(public)` | `/` | Marketing, landing |
| `(auth)` | `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth flows |
| `(admin)` | `/admin` | Admin dashboard, course/user management |
| `(student)` | `/student` | Student dashboard, courses, progress |
| `(teacher)` | `/teacher` | Teacher dashboard, cohorts, grading |

Route groups (parentheses) do not affect the URL. They only provide layout isolation.

## Feature Module Boundaries

- **`src/features/auth`**: Auth-related types, hooks, and services.
- **`src/features/courses`**: Course domain logic, components, and data access.
- **`src/features/users`**: User management logic and components.

Feature modules are colocated by domain. Components, hooks, and services live inside each feature. Shared UI goes in `src/components/`.

## Lib Responsibilities

- **`src/lib/auth.ts`**: `getCurrentUser()`, `requireRole()` stubs. Will integrate with Supabase Auth.
- **`src/lib/env.ts`**: Environment variable validation stub.
- **`src/lib/supabase/`**: Supabase client (browser and server).
- **`src/lib/utils.ts`**: Shared utilities (e.g., `cn`).

## RBAC Placeholder Usage

- `getCurrentUser()`: Returns the current user or `null`. Stub returns `null` until auth is wired.
- `requireRole(role)`: Returns `{ allowed: boolean }`. No enforcement yet; used as integration point for layout-level protection.

Future: Call `requireRole()` in admin/student/teacher layouts and redirect unauthenticated/unauthorized users.

## Conventions

- **Code and comments**: English only.
- **User-facing UI**: Spanish (LatAm neutral).
- **Server Components**: Default. Use `"use client"` only when needed (state, effects, browser APIs).
- **Path alias**: `@/*` maps to `./src/*`.
