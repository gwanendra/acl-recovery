---
name: change-phase-label
description: Update which recovery phase the app displays (currently hardcoded to Phase 3 → Phase 4). Use when the user has progressed phases and wants the app's text relabeled.
---

# Changing the displayed phase

The app is currently hard-coded for one specific transition: **"currently in
Phase 3, working toward Phase 4."** There's no settings page or stored phase
number — it's plain text in a few places. Update all of them together so the
app stays internally consistent:

| File | Line context | What it says |
|---|---|---|
| `src/app/layout.tsx` | `metadata.title` | `"ACL Phase 3 Tracker"` |
| `src/app/page.tsx` | `PageTitle subtitle` | `"Phase 3 — Strength & control"` |
| `src/app/page.tsx` | readiness tile label | `"Phase 4 readiness"` |
| `src/app/readiness/page.tsx` | `PageTitle title` | `"Phase 4 readiness"` |
| `src/app/readiness/page.tsx` | all-met banner text | `"All Phase 3 criteria checked... toward Phase 4..."` |

Also check whether the **readiness checklist itself** (`READINESS_ITEMS` in
`src/lib/types.ts`) still makes sense for the new target phase — those four
criteria ("no swelling," "full ROM," "~90% strength," "pain-free jogging")
are specifically the usual Phase 3 → Phase 4 gate. If the user is moving to a
later phase, the checklist content likely needs to change too — see
`[[add-readiness-criterion]]`.

Don't invent a generic "phase" config/variable unless asked — this app has
no settings system, and the phase name only ever appears as plain copy in a
handful of places. A find-and-replace across the table above is the whole
job.
