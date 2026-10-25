"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useExercises, useReadiness, useSessions } from "@/lib/store";
import {
  categoryForMode,
  currentStreak,
  exerciseCategory,
  exerciseSection,
  latestSymmetry,
  pickDailyExercises,
  sessionType,
  suggestedMode,
  todayIso,
} from "@/lib/calc";
import {
  READINESS_ITEMS,
  SECTION_LABEL,
  SECTION_ORDER,
  unitLabel,
  type Exercise,
  type SessionType,
} from "@/lib/types";
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

const HYPE_LINES = [
  "Small reps, big discipline.",
  "You showed up. That's the hard part.",
  "One more session than last week.",
  "This is for future you.",
  "Consistency beats intensity.",
  "No PR needed today — just show up.",
  "Discipline is just self-love in boring clothes.",
  "Nobody's grading this. Keep going anyway.",
  "Every session is a vote for who you're becoming.",
  "Slow is still moving forward.",
  "You vs. yesterday's you.",
  "Training because you love you, not to impress anyone.",
  "Today's goal: just start.",
  "Progress doesn't ask for permission.",
  "Not for the sport. For you.",
];

export default function Home() {
  const [exercises, , exercisesHydrated] = useExercises();
  const [sessions, , sessionsHydrated] = useSessions();
  const [readiness, , readinessHydrated] = useReadiness();
  const [modeOverride, setModeOverride] = useState<Mode | null>(null);
  // Picked client-side only (not during prerender) so it's a fresh random line each visit.
  const [hypeLine, setHypeLine] = useState(HYPE_LINES[0]);
  useEffect(() => {
    setHypeLine(HYPE_LINES[Math.floor(Math.random() * HYPE_LINES.length)]);
  }, []);

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
  const categoryFiltered =
    mode === "rest" ? [] : active.filter((ex) => exerciseCategory(ex) === categoryForMode(mode));
  // Once today's logged, show exactly what was done — not a fresh rotation pick.
  const filtered = todaySession
    ? categoryFiltered.filter((ex) =>
        todaySession.exercises.some((log) => log.exerciseId === ex.id)
      )
    : pickDailyExercises(categoryFiltered, sessions);

  const sections: { section: (typeof SECTION_ORDER)[number]; items: Exercise[] }[] =
    mode === "train"
      ? SECTION_ORDER.map((section) => ({
          section,
          items: filtered.filter((ex) => exerciseSection(ex) === section),
        })).filter((group) => group.items.length > 0)
      : [];

  const latestSession = sessions.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  const symmetry = latestSymmetry(sessions);
  const readyCount = READINESS_ITEMS.filter((item) => readiness[item.key]).length;

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Today" />
      <p className="-mt-3 text-sm italic text-zinc-400">{hypeLine}</p>

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

      {todaySession ? (
        <Link href="/log">
          <Button variant="secondary" className="w-full py-3 text-base">
            View today&apos;s log
          </Button>
        </Link>
      ) : (
        <Link href={`/log/new?type=${mode}`}>
          <Button className="w-full py-3 text-base">{CTA_LABEL[mode]}</Button>
        </Link>
      )}

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
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Readiness check</p>
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
          ) : mode === "train" ? (
            <div className="flex flex-col gap-4">
              {sections.map(({ section, items }) => (
                <div key={section} className="flex flex-col gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {SECTION_LABEL[section]}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {items.map((ex) => (
                      <ExerciseCard key={ex.id} ex={ex} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((ex) => (
                <ExerciseCard key={ex.id} ex={ex} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function ExerciseCard({ ex }: { ex: Exercise }) {
  return (
    <Card>
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
          {ex.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- external, unhosted demo image
            <img
              src={ex.imageUrl}
              alt={`${ex.name} demonstration`}
              loading="lazy"
              className="mt-1 max-h-48 w-auto rounded border border-zinc-200 dark:border-zinc-700"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <p className="mt-1 whitespace-pre-line text-xs text-zinc-500 dark:text-zinc-400">{ex.howTo}</p>
        </details>
      )}
    </Card>
  );
}
