---
name: api-design-conventions
description: Conventions for designing consistent, predictable backend APIs
---

## Resource naming (REST)
- Plural nouns for collections (`/users`, `/orders`), not verbs
  (`/getUsers`)
- Nesting reflects real ownership, max ~2 levels deep
  (`/orders/:id/items`, not `/users/:id/orders/:id/items/:id`)
- Consistent casing across all endpoints (usually `camelCase` for JSON
  fields, `kebab-case` for URL paths) — confirm the project's existing
  convention before introducing a new one

## Status codes
- `200` success with body, `201` created (with `Location` header when
  applicable), `204` success with no body
- `400` malformed request, `401` not authenticated, `403` authenticated
  but not authorized, `404` resource not found, `409` conflict
  (duplicate, version mismatch), `422` semantically invalid input
- `5xx` reserved for actual server failures — never used to signal
  expected business errors (that's `4xx`)

## Request/response shape
- Consistent envelope across all endpoints (either always wrap in
  `{ data, error }` or never — don't mix)
- Errors return a stable, machine-readable code plus a human message,
  not just a string (ver `error-messages`)
- Pagination: consistent pattern project-wide (cursor or offset, not
  both), with explicit limits and a documented maximum page size

## Versioning and compatibility
- Additive changes (new optional field) don't require a version bump;
  breaking changes (removing/renaming a field, changing a type) do
- Never silently change the meaning of an existing field — add a new
  field instead and deprecate the old one with a migration path

## Rules
- Idempotent methods (`GET`, `PUT`, `DELETE`) must actually be
  idempotent in implementation, not just in name
- Every endpoint validates input at the boundary (ver `input-validation`)
  before any business logic runs
- Long-running operations return `202 Accepted` with a status
  endpoint/webhook, never block the request indefinitely