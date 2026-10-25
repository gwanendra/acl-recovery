"use client";

import { useState } from "react";
import type { Exercise, ExerciseLog, Session, SessionType, SetEntry, Side, Swelling } from "@/lib/types";
import { SECTION_LABEL, unitLabel } from "@/lib/types";
import { exerciseSection, todayIso } from "@/lib/calc";
import { newId } from "@/lib/useLocalStorage";
import { Button, Card, Field, Select, TextInput } from "@/components/ui";

function emptySet() {
  return { id: newId(), reps: 0, weight: 0, side: "both" as Side };
}

// "8-12" -> 8, "30-45" -> 30, "10-15 steps each way" -> 10. Falls back to 0
// (bodyweight-only exercises, or anything we can't parse a number out of).
function parseDefaultReps(defaultReps: string): number {
  const match = defaultReps.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

const SIDE_LABEL: Record<Side, string> = {
  both: "Both legs",
  injured: "Injured",
  healthy: "Healthy",
};

// Most recent logged sets for this exercise, so a session starts prefilled
// with what you actually did last time instead of blank 0/0 fields.
function lastLoggedSets(exerciseId: string, sessions: Session[]): SetEntry[] | undefined {
  const sorted = sessions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  for (const session of sorted) {
    const log = session.exercises.find((l) => l.exerciseId === exerciseId);
    if (log && log.sets.length > 0) return log.sets;
  }
  return undefined;
}

export default function SessionForm({
  exercises,
  type,
  sessions,
  onSave,
}: {
  exercises: Exercise[];
  type: SessionType;
  sessions: Session[];
  onSave: (session: Session) => void;
}) {
  const [date, setDate] = useState(todayIso());
  // Starts at one row per exercise regardless of defaultSets — filling in
  // every set up front was the biggest source of form fatigue. "+ Add set"
  // covers anyone who actually wants to log more than one set.
  const [logs, setLogs] = useState<ExerciseLog[]>(
    exercises.map((ex) => {
      const prefill = lastLoggedSets(ex.id, sessions)?.[0];
      return {
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: [
          prefill
            ? { id: newId(), reps: prefill.reps, weight: prefill.weight, side: prefill.side }
            : { id: newId(), reps: parseDefaultReps(ex.defaultReps), weight: 0, side: "both" as Side },
        ],
      };
    })
  );
  const [pain, setPain] = useState(0);
  const [swelling, setSwelling] = useState<Swelling>("none");
  const [notes, setNotes] = useState("");
  // Cards start collapsed showing the prefilled default — tap Done to accept
  // it as-is, or Edit to open the set-by-set inputs below.
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  function toggleEdit(exerciseId: string) {
    setEditingIds((prev) => {
      const next = new Set(prev);
      if (next.has(exerciseId)) next.delete(exerciseId);
      else next.add(exerciseId);
      return next;
    });
  }

  function markDone(exerciseId: string) {
    setDoneIds((prev) => new Set(prev).add(exerciseId));
    setEditingIds((prev) => {
      if (!prev.has(exerciseId)) return prev;
      const next = new Set(prev);
      next.delete(exerciseId);
      return next;
    });
  }

  function updateSet(exerciseId: string, setId: string, patch: Partial<ExerciseLog["sets"][number]>) {
    setLogs((prev) =>
      prev.map((log) =>
        log.exerciseId !== exerciseId
          ? log
          : { ...log, sets: log.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) }
      )
    );
  }

  function addSet(exerciseId: string) {
    setLogs((prev) =>
      prev.map((log) =>
        log.exerciseId === exerciseId ? { ...log, sets: [...log.sets, emptySet()] } : log
      )
    );
  }

  function copyFirstSetToAll(exerciseId: string) {
    setLogs((prev) =>
      prev.map((log) => {
        if (log.exerciseId !== exerciseId || log.sets.length < 2) return log;
        const first = log.sets[0];
        return {
          ...log,
          sets: log.sets.map((s, i) =>
            i === 0 ? s : { ...s, reps: first.reps, weight: first.weight, side: first.side }
          ),
        };
      })
    );
  }

  function removeSet(exerciseId: string, setId: string) {
    setLogs((prev) =>
      prev.map((log) =>
        log.exerciseId === exerciseId
          ? { ...log, sets: log.sets.filter((s) => s.id !== setId) }
          : log
      )
    );
  }

  function removeExercise(exerciseId: string) {
    setLogs((prev) => prev.filter((l) => l.exerciseId !== exerciseId));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nonEmptyLogs = logs.filter((l) => l.sets.length > 0);
    onSave({
      id: newId(),
      date,
      createdAt: new Date().toISOString(),
      exercises: nonEmptyLogs,
      pain,
      swelling,
      notes: notes.trim() || undefined,
      type,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Date">
        <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Field>

      {type === "rest" && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Rest day — no exercises to log. Just note how the knee feels below.
        </p>
      )}

      {logs.map((log, index) => {
        const exercise = exercises.find((e) => e.id === log.exerciseId);
        const section = exercise && type === "train" ? exerciseSection(exercise) : null;
        const prevExercise = index > 0 ? exercises.find((e) => e.id === logs[index - 1].exerciseId) : undefined;
        const prevSection = prevExercise && type === "train" ? exerciseSection(prevExercise) : null;
        const showSectionHeader = section !== null && section !== prevSection;
        const isEditing = editingIds.has(log.exerciseId);
        const isDone = doneIds.has(log.exerciseId);
        return (
          <div key={log.exerciseId} className="flex flex-col gap-2">
            {showSectionHeader && (
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                {SECTION_LABEL[section]}
              </h3>
            )}
            <Card className={isDone ? "opacity-70" : undefined}>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium">
                {isDone && <span className="mr-1 text-emerald-600 dark:text-emerald-400">✓</span>}
                {log.exerciseName}
              </p>
              <button
                type="button"
                onClick={() => removeExercise(log.exerciseId)}
                className="text-xs font-medium text-zinc-400 hover:text-red-500"
              >
                Remove
              </button>
            </div>
            {exercise && (
              <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                Target: {exercise.defaultSets} × {exercise.defaultReps} {unitLabel(exercise.unit)}
              </p>
            )}
            {exercise?.howTo && (
              <details className="mb-2">
                <summary className="cursor-pointer text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  How to
                </summary>
                {exercise.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- external, unhosted demo image
                  <img
                    src={exercise.imageUrl}
                    alt={`${exercise.name} demonstration`}
                    loading="lazy"
                    className="mt-1 max-h-48 w-auto rounded border border-zinc-200 dark:border-zinc-700"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <p className="mt-1 whitespace-pre-line text-xs text-zinc-500 dark:text-zinc-400">{exercise.howTo}</p>
              </details>
            )}

            {isEditing ? (
              <>
                <div className="flex flex-col gap-2">
                  {log.sets.map((set, idx) => (
                    <div key={set.id} className="flex items-center gap-2">
                      <span className="w-5 shrink-0 text-xs text-zinc-400">{idx + 1}</span>
                      <TextInput
                        type="number"
                        min={0}
                        value={set.reps === 0 ? "" : set.reps}
                        onChange={(e) =>
                          updateSet(log.exerciseId, set.id, {
                            reps: e.target.value === "" ? 0 : Number(e.target.value),
                          })
                        }
                        placeholder={exercise ? unitLabel(exercise.unit) : "reps"}
                        className="w-16"
                      />
                      <TextInput
                        type="number"
                        min={0}
                        step={0.5}
                        value={set.weight === 0 ? "" : set.weight}
                        onChange={(e) =>
                          updateSet(log.exerciseId, set.id, {
                            weight: e.target.value === "" ? 0 : Number(e.target.value),
                          })
                        }
                        placeholder="kg"
                        className="w-16"
                      />
                      <Select
                        value={set.side}
                        onChange={(e) => updateSet(log.exerciseId, set.id, { side: e.target.value as Side })}
                        className="flex-1"
                      >
                        <option value="both">Both legs</option>
                        <option value="injured">Injured</option>
                        <option value="healthy">Healthy</option>
                      </Select>
                      <button
                        type="button"
                        onClick={() => removeSet(log.exerciseId, set.id)}
                        className="shrink-0 px-1 text-zinc-400 hover:text-red-500"
                        aria-label="Remove set"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => addSet(log.exerciseId)}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    + Add set
                  </button>
                  {log.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => copyFirstSetToAll(log.exerciseId)}
                      className="text-xs font-medium text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                    >
                      Copy set 1 to all
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-200">
                {log.sets.length === 0 ? (
                  <p className="text-xs text-zinc-400">No sets — tap Edit to add one.</p>
                ) : (
                  log.sets.map((set, idx) => (
                    <p key={set.id}>
                      {log.sets.length > 1 ? `${idx + 1}. ` : ""}
                      {set.reps} {unitLabel(exercise?.unit ?? "reps")}
                      {set.weight > 0 ? ` · ${set.weight}kg` : " · bodyweight"} · {SIDE_LABEL[set.side]}
                    </p>
                  ))
                )}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <Button type="button" onClick={() => markDone(log.exerciseId)} className="flex-1">
                {isDone ? "✓ Done" : "Done"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => toggleEdit(log.exerciseId)}
                className="flex-1"
              >
                {isEditing ? "Collapse" : "Edit"}
              </Button>
            </div>
            </Card>
          </div>
        );
      })}

      <Card>
        <div className="flex flex-col gap-3">
          <Field label={`Pain (0-10): ${pain}`}>
            <input
              type="range"
              min={0}
              max={10}
              value={pain}
              onChange={(e) => setPain(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </Field>
          <Field label="Swelling">
            <Select value={swelling} onChange={(e) => setSwelling(e.target.value as Swelling)}>
              <option value="none">None</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
            </Select>
          </Field>
          <Field label="Notes (optional)">
            <TextInput value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did it feel?" />
          </Field>
        </div>
      </Card>

      <Button type="submit" className="w-full">
        Save session
      </Button>
    </form>
  );
}
