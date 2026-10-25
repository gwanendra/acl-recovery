"use client";

import Link from "next/link";
import { useExercises, useReadiness, useSessions } from "@/lib/store";
import { latestSymmetry } from "@/lib/calc";
import { READINESS_ITEMS } from "@/lib/types";
import WarningBanner from "@/components/WarningBanner";
import { Button, Card, PageTitle } from "@/components/ui";

export default function Home() {
  const [exercises, , exercisesHydrated] = useExercises();
  const [sessions, , sessionsHydrated] = useSessions();
  const [readiness, , readinessHydrated] = useReadiness();

  const hydrated = exercisesHydrated && sessionsHydrated && readinessHydrated;
  const active = exercises.filter((e) => !e.archived);
  const latestSession = sessions.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  const symmetry = latestSymmetry(sessions);
  const readyCount = READINESS_ITEMS.filter((item) => readiness[item.key]).length;

  if (!hydrated) {
    return <p className="text-sm text-zinc-400">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Today's plan" subtitle="Phase 3 — Strength & control" />

      <WarningBanner latestSession={latestSession} />

      <div className="grid grid-cols-2 gap-3">
        <Link href="/progress">
          <Card className="h-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Limb symmetry</p>
            <p className="mt-1 text-2xl font-bold">
              {symmetry !== null ? `${symmetry}%` : "—"}
            </p>
            <p className="text-xs text-zinc-400">injured vs healthy</p>
          </Card>
        </Link>
        <Link href="/readiness">
          <Card className="h-full">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Phase 4 readiness</p>
            <p className="mt-1 text-2xl font-bold">{readyCount}/{READINESS_ITEMS.length}</p>
            <p className="text-xs text-zinc-400">criteria met</p>
          </Card>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          Exercises ({active.length})
        </h2>
        <Link href="/plan" className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Edit plan
        </Link>
      </div>

      {active.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-500">No exercises yet.</p>
          <Link href="/plan">
            <Button className="mt-3">Add exercises</Button>
          </Link>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {active.map((ex) => (
            <Card key={ex.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{ex.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {ex.defaultSets} × {ex.defaultReps} {ex.unit === "seconds" ? "s" : "reps"}
                </p>
                {ex.notes && <p className="mt-0.5 text-xs text-zinc-400">{ex.notes}</p>}
              </div>
            </Card>
          ))}
        </ul>
      )}

      <Link href="/log/new">
        <Button className="mt-2 w-full">Log today&apos;s session</Button>
      </Link>
    </div>
  );
}
