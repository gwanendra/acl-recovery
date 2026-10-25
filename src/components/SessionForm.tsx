"use client";

import { useState } from "react";
import type { Exercise, ExerciseLog, Session, SessionType, Side, Swelling } from "@/lib/types";
import { unitLabel } from "@/lib/types";
import { todayIso } from "@/lib/calc";
import { newId } from "@/lib/useLocalStorage";
import { Button, Card, Field, Select, TextInput } from "@/components/ui";

function emptySet() {
  return { id: newId(), reps: 0, weight: 0, side: "both" as Side };
}

export default function SessionForm({
  exercises,
  type,
  onSave,
}: {
  exercises: Exercise[];
  type: SessionType;
  onSave: (session: Session) => void;
}) {
  const [date, setDate] = useState(todayIso());
  const [logs, setLogs] = useState<ExerciseLog[]>(
    exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: Array.from({ length: ex.defaultSets }, emptySet),
    }))
  );
  const [pain, setPain] = useState(0);
  const [swelling, setSwelling] = useState<Swelling>("none");
  const [notes, setNotes] = useState("");

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

      {logs.map((log) => {
        const exercise = exercises.find((e) => e.id === log.exerciseId);
        return (
          <Card key={log.exerciseId}>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium">{log.exerciseName}</p>
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
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{exercise.howTo}</p>
              </details>
            )}
            <div className="flex flex-col gap-2">
              {log.sets.map((set, idx) => (
                <div key={set.id} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-xs text-zinc-400">{idx + 1}</span>
                  <TextInput
                    type="number"
                    min={0}
                    value={set.reps}
                    onChange={(e) => updateSet(log.exerciseId, set.id, { reps: Number(e.target.value) })}
                    placeholder={exercise ? unitLabel(exercise.unit) : "reps"}
                    className="w-16"
                  />
                  <TextInput
                    type="number"
                    min={0}
                    step={0.5}
                    value={set.weight}
                    onChange={(e) =>
                      updateSet(log.exerciseId, set.id, { weight: Number(e.target.value) })
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
            <button
              type="button"
              onClick={() => addSet(log.exerciseId)}
              className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              + Add set
            </button>
          </Card>
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
