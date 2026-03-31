# Search Feature Design

**Date:** 2026-03-31  
**Status:** Approved

## Overview

Add search and filtering to SampleVault. Users type in the Hero or Navbar search input, submit, and are taken to `/samples?q=...` where they can further refine results using a BPM range slider and a key selector. All filters apply together (AND). Results update instantly as filters change. URLs are shareable and bookmarkable.

---

## 1. URL Structure

The `/samples` page is the search results page. All state lives in URL query params:

```
/samples?q=dark+trap&bpmMin=80&bpmMax=120&key=C+Major
```

| Param    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `q`      | string | Text search (name + tags)            |
| `bpmMin` | int    | Lower bound of BPM range             |
| `bpmMax` | int    | Upper bound of BPM range             |
| `key`    | string | Root note + mode e.g. "C Major"      |

All params are optional. Omitting all params (navigating to `/samples`) returns all samples — a browse view.

---

## 2. Backend

### Repository — `samples.repository.ts`

Add a new `search(params: SearchParams)` method alongside the existing `findAll`. Builds a dynamic SQL query — only includes a clause if the corresponding param is present:

- `q` → `WHERE (s.name ILIKE $n OR $n = ANY(s.tags))`
- `bpmMin` / `bpmMax` → `AND s.bpm BETWEEN $n AND $m`
- `key` → `AND s.key = $n`

Existing `findAll()` is left untouched.

### Controller — `samples.controller.ts`

Add a `search` handler that reads `req.query`, coerces `bpmMin`/`bpmMax` to integers, and delegates to `SamplesRepository.search(params)`.

### Routes — `samples.routes.ts`

The existing `GET /` handler is updated to route to `search` when any query param is present, otherwise falls through to `getAll`. No new route needed.

---

## 3. Frontend

### Routing — `App.tsx`

Add route:
```tsx
<Route path="/samples" element={<SearchResultsPage />} />
```

### Search input wiring

Both the **Hero** (`Hero.tsx`) and **Navbar** (`Navbar.tsx` — desktop + mobile) search inputs get an `onSubmit` / `onKeyDown` handler that calls:
```ts
navigate(`/samples?q=${encodeURIComponent(value)}`)
```

The unused `Search.tsx` component is deleted.

### Custom hooks

**`useSearchFilters`** — reads/writes URL search params via `useSearchParams`. Returns parsed filter values and setter functions. Consumers never interact with `useSearchParams` directly.

**`useSearchResults(filters)`** — wraps TanStack Query. Calls `searchSamples(params)` in `api/samples.ts`. Query key includes all filter params so each unique filter combo is cached independently.

**`useSamplePlayer`** — extracted from `LatestSamples`. Manages `playingId`, `audioRef`, volume sync, and `handlePlayPause`. Used by both `LatestSamples` and `SearchResultsPage`.

### API client — `api/samples.ts`

Add:
```ts
export async function searchSamples(params: SearchParams): Promise<Sample[]>
```
Calls `GET /samples` with params forwarded as query string.

### Components

**`SampleRow`** — extracted from `LatestSamples.tsx` into `components/SampleRow.tsx`. Unchanged in appearance. Accepts `sample`, `isPlaying`, `onPlayPause` props.

**`FilterSidebar`** — new component (`components/FilterSidebar.tsx`):
- BPM range slider (min/max, debounced ~400ms before updating URL)
- Key dropdown (24 options: 12 root notes × major/minor)
- Calls setter functions from `useSearchFilters`

**`SearchResultsPage`** — new page (`pages/SearchResultsPage.tsx`):
- Uses `useSearchFilters` to read current params
- Uses `useSearchResults` to fetch data
- Renders `FilterSidebar` + list of `SampleRow`
- Shows loading / empty states

**`LatestSamples`** — refactored to use extracted `SampleRow` and `useSamplePlayer`. Behaviour and appearance unchanged.

---

## 4. Debouncing

The BPM slider fires many events as the user drags. A ~400ms debounce is applied inside `FilterSidebar` before the URL param updates. This prevents a TanStack Query re-fetch on every pixel of movement. Text search is not debounced — it only fires on form submission.

---

## 5. What is not in scope

- Pagination on the search results page (can be added later)
- Sorting (by BPM, date, etc.)
- Tag filter chips on the results page
- Saving or sharing searches
