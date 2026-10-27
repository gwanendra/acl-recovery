"use client";

import { useState } from "react";
import Link from "next/link";
import { useExercises, useSessions } from "@/lib/store";
import { logLoad, sessionType, shouldWarn } from "@/lib/calc";
import { unitLabel, type Side, type SessionType } from "@/lib/types";
import { Button, Card, PageTitle } from "@/components/ui";

const TYPE_LABEL: Record<SessionType, string> = {
  train: "Train",
  recovery: "Recovery",
  rest: "Rest",
  relax: "Relax",
};

const TYPE_BADGE_CLASS: Record<SessionType, string> = {
  train: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  recovery: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  rest: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  relax: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};

const SIDE_LABEL: Record<Side, string> = {
  both: "both legs",
  injured: "injured",
  healthy: "healthy",
};

export default function LogPage() {
  const [sessions, setSessions, hydrated] = useSessions();
  const [exercises, , exercisesHydrated] = useExercises();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!hydrated || !exercisesHydrated) return <p className="text-sm text-zinc-400">Loading…</p>;

  const exerciseById = new Map(exercises.map((ex) => [ex.id, ex]));
  const sorted = sessions.slice().sort((a, b) => b.date.localeCompare(a.date));

  function removeSession(id: string) {
    if (!confirm("Delete this session log?")) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Session log" subtitle={`${sessions.length} session${sessions.length === 1 ? "" : "s"} recorded`} />

      <Link href="/log/new">
        <Button className="w-full">+ Log new session</Button>
      </Link>

      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">No sessions logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((session) => {
            const open = expanded === session.id;
            const warn = shouldWarn(session.pain, session.swelling);
            const type = sessionType(session);
            return (
              <Card key={session.id}>
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setExpanded(open ? null : session.id)}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium">{session.date}</p>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${TYPE_BADGE_CLASS[type]}`}
                      >
                        {TYPE_LABEL[type]}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {type === "rest"
                        ? `pain ${session.pain}/10`
                        : `${session.exercises.length} exercise${session.exercises.length === 1 ? "" : "s"} · pain ${session.pain}/10 · swelling ${session.swelling}`}
                    </p>
                  </div>
                  {warn && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      flagged
                    </span>
                  )}
                </button>

                {open && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    {session.exercises.map((log) => {
                      const ex = exerciseById.get(log.exerciseId);
                      const unit = ex?.unit ?? "reps";
                      return (
                        <div key={log.exerciseId} className="text-sm">
                          <p className="font-medium">{log.exerciseName}</p>
                          <ul className="ml-3 list-disc text-xs text-zinc-500 dark:text-zinc-400">
                            {log.sets.map((s) => (
                              <li key={s.id}>
                                {s.reps} {unitLabel(unit)}
                                {unit !== "minutes" && (
                                  <>
                                    {" "}
                                    · {s.weight > 0 ? `${s.weight}kg` : "bodyweight"} · {SIDE_LABEL[s.side]}
                                    {s.weight > 0 && ` · load ${logLoad({ ...log, sets: [s] })}`}
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    {session.notes && (
                      <p className="text-xs italic text-zinc-500 dark:text-zinc-400">&ldquo;{session.notes}&rdquo;</p>
                    )}
                    <Button variant="danger" onClick={() => removeSession(session.id)} className="mt-1 self-start">
                      Delete session
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </ul>
      )}
    </div>
  );
}
