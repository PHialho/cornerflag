---
name: frontend-performance
description: Common frontend performance issues to check for
---

## Rendering
- Unnecessary re-renders from creating new object/array/function
  literals inline as props on every render, when the child is
  expensive or renders often — memoize when it demonstrably matters,
  not everywhere by default
- Large lists rendered without virtualization when the list can grow
  unbounded (hundreds+ of rows/items)
- Expensive computation inside the render path that isn't memoized,
  recalculated on every render even when its inputs haven't changed

## Loading and bundle size
- Route-level or component-level code splitting for large, rarely-used
  parts of the app (heavy modals, admin-only screens, chart libraries)
- Images sized and compressed appropriately for their rendered size,
  not full-resolution originals shipped as-is
- New dependencies checked for bundle size impact before adding,
  especially for something a smaller existing dependency could do

## Network
- Avoid duplicate/redundant API calls for the same data within a
  short window (deduplication or caching at the data-fetching layer)
- Debounce/throttle handlers that fire on high-frequency events
  (scroll, resize, keystroke-triggered search) instead of running
  expensive work on every event

## Rules
- Never optimize (memoization, virtualization, splitting) without a
  concrete reason — added complexity for an unmeasured, unlikely
  bottleneck is a net loss. Flag as `nit:` unless the impact is clear
  and likely (large list, hot path, obviously duplicated network calls)
- Confirm with actual profiling/measurement before asserting something
  is a performance problem when it's not obvious from the code alone