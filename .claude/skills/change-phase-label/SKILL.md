---
name: change-phase-label
description: The app intentionally dropped clinical "Phase 3/Phase 4" framing in favor of plain Train/Recovery/Rest language. Read before reintroducing phase numbers, clinical copy, or PT-reporting framing anywhere in the UI.
---

# No more "Phase 3 / Phase 4" framing — read this before adding it back

Earlier versions of this app hardcoded "Phase 3 → Phase 4" copy in five
places (`layout.tsx` title, home `PageTitle` subtitle, home readiness tile,
`/readiness` title, `/readiness` all-met banner). That copy has been removed
— see `[[acl-app-purpose]]` (project memory): the user explicitly said this
app is not a clinical rehab tracker or a return-to-sport protocol, it's a
personal discipline/consistency tool they open before a gym session. Phase
numbers, PT-progression language, and diary-style reporting don't fit that.

**Current state:**
- App title/metadata: `"Leg Day"` (`src/app/layout.tsx`).
- Home screen has no phase subtitle — instead a rotating `HYPE_LINES` quote
  (`src/app/page.tsx`) under the "Today" title.
- The readiness feature still exists (`/readiness`, `READINESS_ITEMS` in
  `src/lib/types.ts`) but is framed as optional — "Readiness check," not
  tied to a phase number, not a prerequisite for anything in the app.

**If asked to add phase/milestone language back:** confirm with the user
first — it was explicitly removed, not just outdated copy. If they do want
it, treat it as plain text in the same handful of UI spots (no settings
system or stored "phase" value to wire up), and check whether
`READINESS_ITEMS` still makes sense for whatever phase they name — see
`[[add-readiness-criterion]]`.
