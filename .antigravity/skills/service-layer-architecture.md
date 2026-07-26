---
name: service-layer-architecture
description: Separation of concerns and layering conventions for backend code
---

## Layers
- **Controller/handler** — parses request, calls the service layer,
  formats the response. No business logic here.
- **Service** — business logic, orchestration between repositories and
  external calls. Framework-agnostic where possible (shouldn't import
  HTTP request/response objects directly).
- **Repository/data access** — the only layer that talks to the
  database directly. Business logic never constructs raw queries
  outside this layer.

Confirm the layering already established in the project before
introducing a new pattern — don't mix architectural styles within the
same codebase without a stated reason.

## Dependency direction
- Dependencies point inward: controllers depend on services, services
  depend on repository interfaces — never the reverse
- Services depend on abstractions (interfaces) for external
  dependencies (DB, third-party APIs) when the project's testing
  strategy relies on it, not concrete implementations directly

## Boundaries
- A service function does one coherent unit of business logic — if its
  name needs "and" to describe it, it's a candidate to split
- Cross-cutting concerns (logging, auth checks, transactions) live in
  middleware/decorators, not duplicated inside every handler
- Shared logic between services goes in a shared module, never copy-
  pasted between them

## Rules
- Business logic never lives in the controller layer, even for "just
  one quick check" — it belongs in the service layer
- A repository method returns domain data, not raw database rows with
  driver-specific types leaking into the service layer
- New code follows the existing layering even if it takes more files;
  don't collapse layers for convenience in one place while the rest of
  the codebase keeps them separate