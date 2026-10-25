"use client";

import { useState } from "react";
import Link from "next/link";
import { useExercises, useReadiness, useSessions } from "@/lib/store";
import {
  categoryForMode,
  currentStreak,
  exerciseCategory,
  latestSymmetry,
  sessionType,
  suggestedMode,
  todayIso,
} from "@/lib/calc";
import { READINESS_ITEMS, unitLabel, type SessionType } from "@/lib/types";
import WarningBanner from "@/components/WarningBanner";
import { Button, Card, PageTitle } from "@/components/ui";

const MODES = ["train", "recovery", "rest"] as const;
type Mode = (typeof MODES)[number];

const MODE_LABEL: Record<Mode, string> = {
  train: "Train",
  recovery: "Recovery",
  rest: "Rest",
};

const MODE_HINT: Record<Mode, string> = {
  train: "Strength day — lift with control, push effort, but stop if pain climbs.",
  recovery: "Active recovery — light movement only, keep the leg moving without loading it hard.",
  rest: "Full rest — no training. This is what lets yesterday's work turn into strength.",
};

const CTA_LABEL: Record<Mode, string> = {
  train: "Start training",
  recovery: "Start recovery session",
  rest: "Log rest day",
};

const LOGGED_LABEL: Record<SessionType, string> = {
  train: "a training session",
  recovery: "a recovery session",
  rest: "a rest day",
};

export default function Home() {
  const [exercises, , exercisesHydrated] = useExercises();
  const [sessions, , sessionsHydrated] = useSessions();
  const [readiness, , readinessHydrated] = useReadiness();
  const [modeOverride, setModeOverride] = useState<Mode | null>(null);

  const hydrated = exercisesHydrated && sessionsHydrated && readinessHydrated;

  if (!hydrated) {
    return <p className="text-sm text-zinc-400">Loading…</p>;
  }

  const today = todayIso();
  const todaySession = sessions.find((s) => s.date === today);
  const suggestion = suggestedMode(sessions);
  const mode: Mode = todaySession ? sessionType(todaySession) : modeOverride ?? suggestion;
  const streak = currentStreak(sessions, today);

  const active = exercises.filter((e) => !e.archived);
  const filtered =
    mode === "rest" ? [] : active.filter((ex) => exerciseCategory(ex) === categoryForMode(mode));

  const latestSession = sessions.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  const symmetry = latestSymmetry(sessions);
  const readyCount = READINESS_ITEMS.filter((item) => readiness[item.key]).length;

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Today" subtitle="Phase 3 — Strength & control" />

      <WarningBanner latestSession={latestSession} />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Today&apos;s mode</p>
            <p className="text-lg font-bold">{MODE_LABEL[mode]}</p>
          </div>
          {streak > 0 && (
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{streak}</p>
              <p className="text-[10px] text-zinc-400">day streak</p>
            </div>
          )}
        </div>

        {todaySession ? (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            You already logged {LOGGED_LABEL[sessionType(todaySession)]} today. Nice work.
          </p>
        ) : (
          <>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{MODE_HINT[mode]}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeOverride(m)}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                    mode === m
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>
          </>
        )}
      </Card>

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

      {mode === "rest" ? (
        <Card>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Nothing to train today. Rest is part of the plan — it&apos;s how yesterday&apos;s work
            actually turns into strength.
          </p>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {mode === "train" ? "Strength exercises" : "Recovery exercises"} ({filtered.length})
            </h2>
            <Link href="/plan" className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Edit plan
            </Link>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <p className="text-sm text-zinc-500">
                No {mode === "train" ? "strength" : "recovery"} exercises yet.
              </p>
              <Link href="/plan">
                <Button className="mt-3">Add exercises</Button>
              </Link>
            </Card>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((ex) => (
                <Card key={ex.id}>
                  <p className="font-medium">{ex.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {ex.defaultSets} × {ex.defaultReps} {unitLabel(ex.unit)}
                  </p>
                  {ex.notes && <p className="mt-0.5 text-xs text-zinc-400">{ex.notes}</p>}
                  {ex.howTo && (
                    <details className="mt-1.5">
                      <summary className="cursor-pointer text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        How to
                      </summary>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{ex.howTo}</p>
                    </details>
                  )}
                </Card>
              ))}
            </ul>
          )}
        </>
      )}

      {todaySession ? (
        <Link href="/log">
          <Button variant="secondary" className="mt-2 w-full py-3 text-base">
            View today&apos;s log
          </Button>
        </Link>
      ) : (
        <Link href={`/log/new?type=${mode}`}>
          <Button className="mt-2 w-full py-3 text-base">{CTA_LABEL[mode]}</Button>
        </Link>
      )}
    </div>
  );
}
