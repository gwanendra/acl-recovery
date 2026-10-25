---
name: train-recovery-rest-mode
description: How the Train/Recovery/Rest day picker works — the home screen mode card, exercise filtering by category, the day streak, and how it connects to /log/new. Read before changing anything about "today's mode," alternation logic, or the home screen.
---

# Train / Recovery / Rest day mode

The whole point of this feature: alternate a hard strength day with a light
day, instead of training hard once then limping through the rest of the
week. It's a suggestion the user can override, not a hard lock.

## The three modes

A day is one of:
- **`train`** — normal strength session, exercises with
  `category: "strength"`.
- **`recovery`** — light/active-recovery session, exercises with
  `category: "recovery"` (easy bike, mobility, walking, foam rolling).
- **`rest`** — no exercises at all, just a log entry (pain/notes) so the
  streak stays honest.

These are `SessionType` (`src/lib/types.ts`), stored per-session as
`Session.type`. They are **not** the same set of strings as
`ExerciseCategory` (`"strength" | "recovery"`) — `"train"` day maps to
`"strength"` exercises. Never compare a `SessionType` to an
`ExerciseCategory` directly; always go through `categoryForMode()` in
`src/lib/calc.ts`. (This was a real bug during development — filtering
exercises with `exerciseCategory(ex) === mode` silently showed zero
exercises on train days because `"train" !== "strength"`.)

## Suggestion logic (`src/lib/calc.ts`)

- `suggestedMode(sessions)` — alternates: if the most recently logged
  session was `train`, suggest `recovery`, and vice versa. No sessions yet →
  suggest `train`. It only ever returns `train` or `recovery` — rest is
  always a manual choice, never auto-suggested.
- `currentStreak(sessions, today?)` — consecutive days (ending today, or
  yesterday if today isn't logged yet) with any session logged. Train,
  recovery, and rest all count — the point is showing up, not how hard.

## Home screen (`src/app/page.tsx`)

- If today already has a logged session, the mode card is **locked** to
  that session's actual type (`sessionType(todaySession)`) and shows "You
  already logged a training session today," with no picker.
- Otherwise, `mode` = a local `modeOverride` state (if the user tapped a
  different button) or `suggestedMode(sessions)` by default. Three buttons
  let the user override before logging.
- The exercise list below is filtered to `categoryForMode(mode)`, then run
  through `pickDailyExercises()` (see "Daily rotation" below) — **unless**
  today's already logged, in which case it shows exactly what's in
  `todaySession.exercises` instead of a fresh pick. Rest mode shows no
  exercise list at all, just a short "rest is part of the plan" message and a
  "Log rest day" button.
- For `mode === "train"`, the picked list is grouped under section headers
  (`SECTION_ORDER` / `SECTION_LABEL` in `types.ts`) via a small local
  `ExerciseCard` component. Recovery mode stays a flat list — sections are
  strength-only.
- The CTA button links to `/log/new?type=${mode}`.

## Daily rotation (`pickDailyExercises()` in `src/lib/calc.ts`)

Some exercises share a `variantGroup` tag (e.g. `"calf-raise"`,
`"glute-activation"`) because they're interchangeable — same training goal,
different exercise, so the library can grow without every session getting
longer. `pickDailyExercises(exercises, sessions)` shows every exercise with
no `variantGroup` unconditionally, and exactly one exercise per group,
picked as the one after whichever was most recently logged from that group
(round-robin; defaults to the first in the group if never logged). It's
purely a function of `sessions`, so the pick is stable all day and only
advances once you actually log that slot — nothing is date-seeded or random.

Both the home screen and `NewSessionClient` call this the same way (same
`exercises` + `sessions`), so what's shown on Today always matches what
`/log/new` lets you log.

## Logging (`src/app/log/new/`)

`page.tsx` is a plain server component that wraps `NewSessionClient.tsx` in
`<Suspense>` — required because `NewSessionClient` reads the `type` query
param via `useSearchParams()`, which needs a Suspense boundary for static
prerendering (see the Next.js `useSearchParams` docs under
`node_modules/next/dist/docs/`). `NewSessionClient` reads `type`, filters
exercises by `categoryForMode(type)` then `pickDailyExercises()` (empty list
for `rest`), and passes both into `SessionForm`, which groups the exercise
cards by section the same way the home screen does, and stamps `type` onto
the saved `Session`.

If you add a fourth mode or change the alternation rule, check all three
spots above — they currently assume exactly train/recovery/rest.
