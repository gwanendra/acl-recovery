---
name: add-exercise
description: Add, edit, or remove an exercise in the training plan — either as a starting default for new users, or live in a running app via the UI/store.
---

# Adding or changing an exercise

There are two separate places an exercise can be added. Pick the right one.

## 1. Change the starting default list (new installs / fresh browser)

Edit `DEFAULT_EXERCISES` in `src/lib/defaults.ts`. Each entry is an
`Exercise` (see `src/lib/types.ts`):

```ts
{
  id: "split-squat",        // unique, kebab-case, never reused
  name: "Split squat",      // shown in the UI
  defaultSets: 3,
  defaultReps: "8-12",      // free text — can be a range or a single number
  unit: "reps",             // "reps" | "seconds" | "minutes"
  category: "strength",     // "strength" (train day) | "recovery" (light day)
  section: "main",          // strength only: "warmup" | "core" | "finisher" | "main"
  variantGroup: "calf-raise", // optional: shares a rotation slot with other exercises of this tag
  notes: "Progress with dumbbells", // optional, short context
  howTo: "Rear foot up on a bench...", // optional, form cues / how-to-do-it tip
}
```

`category` decides whether the exercise shows up on a Train day or a
Recovery day — see `[[train-recovery-rest-mode]]`. Missing `category` is
treated as `"strength"` (`exerciseCategory()` in `calc.ts`), so older
entries without the field still work.

`section` only matters for `category: "strength"` — it groups the train-day
list under headers (Warm-up / Core & glutes / Main lifts / Finisher).
Missing `section` defaults to `"main"` (`exerciseSection()`). `main` is
meant for the tracked compound lifts (kept fixed session to session so
progress is comparable) — warm-up, core/glute activation, and finisher
isolation work are the better home for anything meant to vary.

`variantGroup` is how exercise variety/rotation works: give two or more
exercises the same string and only one shows per day, rotating — see
"Daily rotation" in `[[train-recovery-rest-mode]]`. Only tag exercises as a
group when they're genuinely interchangeable for the same goal (e.g. five
calf-raise variations, or "which cardio today" for recovery) — not a
progression ladder (plain vs. single-leg version of the same move), which
should stay separate entries with a `notes` hint instead, so the user
advances it deliberately rather than it rotating away.

This list is only the *seed* used the first time the app runs in a browser
with nothing in `localStorage` yet (key `acl.exercises.v1` — see
`[[data-model]]`). It has no effect on a browser that's already stored
exercises.

## 2. Add/edit/remove in an already-running app

This is just normal app usage, not a code change — the `/plan` page
(`src/app/plan/page.tsx`) already supports it:

- **Add**: "+ Add exercise" button → `ExerciseForm` (`src/components/
  ExerciseForm.tsx`) → saved via `useExercises()`'s setter.
- **Edit**: "Edit" button on any exercise card, same form.
- **Archive vs. Delete**: "Archive" hides it from the active plan but keeps it
  (and its history) around; "Delete" removes it from the library entirely.
  Deleting does **not** delete past session logs — `ExerciseLog.exerciseName`
  is a snapshot taken at log time, so history stays readable.

If you're asked to "add an exercise" without more context, prefer option 1
(edit `defaults.ts`) only if they explicitly mean the starting/default plan.
Otherwise, just use the app's own Add Exercise flow — no code change needed.

## Fields that matter for calculations

`unit`, `defaultSets`, and `defaultReps` are just display/pre-fill values —
nothing downstream depends on them being accurate. The one field that *does*
feed the symmetry and load charts is `SetEntry.side` (`"injured" | "healthy"
| "both"`), logged per-set when someone records a session, not per-exercise.
