"use client";

import { useCallback, useEffect, useState } from "react";

// `migrate` runs once against whatever was already in storage right after
// it's parsed — e.g. backfilling fields a stored record predates. If it
// returns a different value (by reference), the migrated version is written
// straight back so this doesn't re-run every load.
export function useLocalStorage<T>(key: string, initialValue: T, migrate?: (value: T) => T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        const migrated = migrate ? migrate(parsed) : parsed;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, a client-only external source read here on purpose
        setValue(migrated);
        if (migrated !== parsed) {
          try {
            window.localStorage.setItem(key, JSON.stringify(migrated));
          } catch {
            // ignore quota / private-mode errors
          }
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore quota / private-mode errors
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update, hydrated] as const;
}

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
