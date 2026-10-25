---
name: data-model
description: Orientation to this app's data — what gets stored, where, and how progress/symmetry numbers are calculated. Read this first before touching anything related to exercises, sessions, readiness, or charts.
---

# Data model orientation

This app has no backend and no database. Everything lives in the browser's
`localStorage`, read/written through small hooks in `src/lib/store.ts`.

## The three stored things

| Hook | localStorage key | Type | File |
|---|---|---|---|
| `useExercises()` | `acl.exercises.v1` | `Exercise[]` | `src/lib/types.ts` |
| `useSessions()` | `acl.sessions.v1` | `Session[]` | `src/lib/types.ts` |
| `useReadiness()` | `acl.readiness.v1` | `ReadinessState` | `src/lib/types.ts` |

All three hooks come from `useLocalStorage` (`src/lib/useLocalStorage.ts`) and
return `[value, setValue, hydrated]`. `hydrated` is `false` on first render
(server-rendered, before localStorage is read) — every page checks it and
shows a "Loading…" state until it's `true`. Don't skip that check when adding
a new page that reads stored data.

## Key types (`src/lib/types.ts`)

- **`Exercise`** — one row in the exercise library (`src/app/plan`). Has
  `defaultSets`, `defaultReps` (free text like `"8-12"`), `unit`
  (`"reps" | "seconds" | "minutes"`, use `unitLabel()` for display),
  `category` (`"strength" | "recovery"` — missing means `"strength"`, use
  `exerciseCategory()` from `calc.ts` rather than reading `.category`
  directly), optional `section` (`"warmup" | "core" | "main" | "finisher"` —
  missing means `"main"`, use `exerciseSection()`; only meaningful for
  `category: "strength"`, groups the train-day list into labeled sections,
  see `[[add-exercise]]`), optional `variantGroup` (a free-text tag —
  exercises sharing one are interchangeable, and `pickDailyExercises()` shows
  only one per day, rotating; see `[[train-recovery-rest-mode]]`), optional
  `howTo` (a short how-to-do-it tip shown as a collapsible "How to"
  disclosure), optional `notes`, optional `archived`.
- **`Session`** — one logged day (`src/app/log`). Has a `date`, `pain`
  (0–10), `swelling` (`"none" | "mild" | "moderate"`), `type`
  (`"train" | "recovery" | "rest"` — missing means `"train"`, use
  `sessionType()` from `calc.ts`), and a list of `ExerciseLog` (empty for a
  rest day). See `[[train-recovery-rest-mode]]` for how `type` drives the
  home screen and `/log/new`.
- **`ExerciseLog`** — one exercise within a session. Snapshots the exercise
  name at log time (`exerciseName`) so renaming/deleting an exercise later
  doesn't rewrite history. Contains a list of `SetEntry`.
- **`SetEntry`** — one set: `reps`, `weight` (kg, `0` for bodyweight), and
  `side` (`"injured" | "healthy" | "both"`). The injured-vs-healthy split is
  what powers the symmetry charts — always keep `side` on every set.
- **`ReadinessState`** — a fixed set of boolean checkboxes, defined by
  `READINESS_ITEMS` in `types.ts` (see `[[add-readiness-criterion]]` to add
  one).

Default seed data (starting exercise list, default readiness state) lives in
`src/lib/defaults.ts`.

## How the numbers are calculated (`src/lib/calc.ts`)

- `setLoad(set)` — one set's "load": `reps * weight`, or just `reps` for
  bodyweight sets (`weight === 0`).
- `logLoad(log, side?)` — sums `setLoad` across a log's sets, optionally
  filtered to one side.
- `loadOverTime(sessions, exerciseId)` — per-session load (total/injured/
  healthy) for one exercise, sorted by date. Feeds the "Load over time" chart
  on `/progress`.
- `symmetryOverTime(sessions, exerciseId?)` — per-session symmetry %
  (`injured / healthy * 100`), across one exercise or all of them. `null`
  when there's no healthy-side load to compare against that date, and those
  points get filtered out (not shown as zero).
- `latestSymmetry(sessions)` — last symmetry point, used on the home screen.
- `shouldWarn(pain, swelling)` — `true` when `pain >= 5` or
  `swelling === "moderate"`. Drives `WarningBanner` on the home screen.
- `exerciseCategory(exercise)` / `sessionType(session)` — safe getters that
  default missing `category`/`type` fields (older data) to `"strength"` /
  `"train"`.
- `suggestedMode(sessions)`, `currentStreak(sessions, today?)`,
  `categoryForMode(mode)`, `exerciseSection(exercise)`,
  `pickDailyExercises(exercises, sessions)` — power the train/recovery/rest
  day picker and the daily exercise rotation. See
  `[[train-recovery-rest-mode]]`.

If you change how load or symmetry is computed, update this file only — every
page/chart reads through these functions, nothing duplicates the math
elsewhere.

## Pages, at a glance

- `src/app/page.tsx` — home / today's plan
- `src/app/log/new/page.tsx` — log a session (`SessionForm`)
- `src/app/log/page.tsx` — session history
- `src/app/plan/page.tsx` — exercise library (`ExerciseForm`)
- `src/app/progress/page.tsx` — charts (recharts)
- `src/app/readiness/page.tsx` — Phase 4 readiness checklist
