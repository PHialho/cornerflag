---
name: state-management-conventions
description: Where state should live and how it should flow in frontend code
---

## Where state lives
- Local component state for anything only that component (and maybe
  its direct children) needs — don't lift state to global scope
  "just in case"
- Shared/global state only for data genuinely needed across unrelated
  parts of the tree (auth session, theme, current user) — not as a
  default choice for convenience
- Server data (API responses) belongs in a data-fetching/cache layer
  (query library, or an explicit cache), not duplicated into ad-hoc
  global state that can drift out of sync with the server

## Derived state
- Never store a value in state if it can be computed from existing
  state/props during render — compute it inline or memoize, don't
  duplicate and manually keep in sync
- `useEffect` (or equivalent) to synchronize state from props is
  usually a sign the value should just be derived, not stored

## Data flow
- Props flow down, events flow up — avoid reaching into parent state
  from a deeply nested child through non-standard means when normal
  prop drilling or a shared store is the established project pattern
- State updates are never mutated directly; always produce a new
  value, even when the underlying framework wouldn't immediately break
  on a mutation

## Rules
- Confirm the state management approach already established in the
  project (context, external store, signals, etc.) before introducing
  a new one for a single feature
- Async state (loading/error/data) modeled explicitly, not inferred
  from combinations of nullable flags that can end up in impossible
  states
- Global state additions require justification — default to local
  unless there's a concrete cross-component need