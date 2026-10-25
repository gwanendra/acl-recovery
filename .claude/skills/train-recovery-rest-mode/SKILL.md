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
- The exercise list below is filtered to `categoryForMode(mode)`. Rest mode
  shows no exercise list at all, just a short "rest is part of the plan"
  message and a "Log rest day" button.
- The CTA button links to `/log/new?type=${mode}`.

## Logging (`src/app/log/new/`)

`page.tsx` is a plain server component that wraps `NewSessionClient.tsx` in
`<Suspense>` — required because `NewSessionClient` reads the `type` query
param via `useSearchParams()`, which needs a Suspense boundary for static
prerendering (see the Next.js `useSearchParams` docs under
`node_modules/next/dist/docs/`). `NewSessionClient` reads `type`, filters
exercises by `categoryForMode(type)` (empty list for `rest`), and passes
both into `SessionForm`, which just stamps `type` onto the saved `Session`.

If you add a fourth mode or change the alternation rule, check all three
spots above — they currently assume exactly train/recovery/rest.
