---
name: add-readiness-criterion
description: Add, remove, or reword one of the Phase 4 readiness checklist items shown on the /readiness page and summarized on the home screen.
---

# Changing the readiness checklist

The Phase 4 readiness checklist is driven entirely by one array —
`READINESS_ITEMS` in `src/lib/types.ts`:

```ts
export const READINESS_ITEMS: { key: keyof ReadinessState; label: string }[] = [
  { key: "noSwellingAfterTraining", label: "No swelling after training" },
  { key: "fullRom", label: "Full range of motion" },
  { key: "strength90Percent", label: "Strength ≈90%+ of the other leg" },
  { key: "painFreeJogging", label: "Pain-free jogging" },
];
```

The `/readiness` page (`src/app/readiness/page.tsx`) and the home screen
readiness tile (`src/app/page.tsx`) both just map over this array — neither
hardcodes the items, so editing this one list is enough to change what's
shown in both places.

## To add a new criterion

1. Add a new boolean field to the `ReadinessState` interface in
   `src/lib/types.ts`.
2. Add a matching default value (`false`) to `DEFAULT_READINESS` in
   `src/lib/defaults.ts`.
3. Add a `{ key, label }` entry to `READINESS_ITEMS`, same file as
   `ReadinessState`.

## To remove or reword one

- **Reword**: just change the `label` string — no other file needs touching.
- **Remove**: delete its entry from `READINESS_ITEMS` and from
  `ReadinessState`/`DEFAULT_READINESS`. Anyone with it already checked in
  their browser's stored state will just have an unused field lying around —
  harmless, no migration needed since storage is per-device and informal.

See `[[data-model]]` for how `ReadinessState` is stored and read.
