"use client";

import { useState } from "react";
import { useExercises } from "@/lib/store";
import { exerciseCategory } from "@/lib/calc";
import { unitLabel, type Exercise } from "@/lib/types";
import ExerciseForm from "@/components/ExerciseForm";
import { Button, Card, PageTitle } from "@/components/ui";

export default function PlanPage() {
  const [exercises, setExercises, hydrated] = useExercises();
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [adding, setAdding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  if (!hydrated) return <p className="text-sm text-zinc-400">Loading…</p>;

  const visible = exercises.filter((e) => (showArchived ? e.archived : !e.archived));

  function saveExercise(exercise: Exercise) {
    setExercises((prev) => {
      const exists = prev.some((e) => e.id === exercise.id);
      return exists ? prev.map((e) => (e.id === exercise.id ? exercise : e)) : [...prev, exercise];
    });
    setEditing(null);
    setAdding(false);
  }

  function toggleArchive(id: string) {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, archived: !e.archived } : e))
    );
  }

  function removeExercise(id: string) {
    if (!confirm("Delete this exercise? Past session logs will keep their recorded name.")) return;
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }

  function moveExercise(id: string, direction: "up" | "down") {
    setExercises((prev) => {
      const visibleIds = prev
        .filter((e) => (showArchived ? e.archived : !e.archived))
        .map((e) => e.id);
      const posInVisible = visibleIds.indexOf(id);
      const swapWithId = visibleIds[direction === "up" ? posInVisible - 1 : posInVisible + 1];
      if (!swapWithId) return prev;

      const a = prev.findIndex((e) => e.id === id);
      const b = prev.findIndex((e) => e.id === swapWithId);
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Exercise library" subtitle="Edit sets, reps, and weight to match your physio's plan" />

      {adding && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold">New exercise</h2>
          <ExerciseForm onSave={saveExercise} onCancel={() => setAdding(false)} />
        </Card>
      )}

      {!adding && (
        <Button onClick={() => setAdding(true)} className="w-full">
          + Add exercise
        </Button>
      )}

      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setShowArchived(false)}
          className={`rounded-full px-3 py-1 ${!showArchived ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}
        >
          Active
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`rounded-full px-3 py-1 ${showArchived ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}
        >
          Archived
        </button>
      </div>

      <p className="text-xs text-zinc-400">
        Use the arrows to set the order you do exercises in — this is the order they show up on
        Today and in session logs.
      </p>

      <ul className="flex flex-col gap-2">
        {visible.map((ex, index) =>
          editing?.id === ex.id ? (
            <Card key={ex.id}>
              <h2 className="mb-3 text-sm font-semibold">Edit exercise</h2>
              <ExerciseForm initial={ex} onSave={saveExercise} onCancel={() => setEditing(null)} />
            </Card>
          ) : (
            <Card key={ex.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-start gap-1.5">
                    <p className="font-medium">{ex.name}</p>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        exerciseCategory(ex) === "recovery"
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {exerciseCategory(ex) === "recovery" ? "Recovery" : "Strength"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {ex.defaultSets} × {ex.defaultReps} {unitLabel(ex.unit)}
                  </p>
                  {ex.notes && <p className="mt-0.5 text-xs text-zinc-400">{ex.notes}</p>}
                  {ex.howTo && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        How to
                      </summary>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{ex.howTo}</p>
                    </details>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => moveExercise(ex.id, "up")}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded-md px-1.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveExercise(ex.id, "down")}
                      disabled={index === visible.length - 1}
                      aria-label="Move down"
                      className="rounded-md px-1.5 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(ex)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleArchive(ex.id)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    {ex.archived ? "Restore" : "Archive"}
                  </button>
                  <button
                    onClick={() => removeExercise(ex.id)}
                    className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Delete
                  </button>
                  </div>
                </div>
              </div>
            </Card>
          )
        )}
        {visible.length === 0 && (
          <p className="py-6 text-center text-sm text-zinc-400">
            {showArchived ? "No archived exercises." : "No exercises — add one above."}
          </p>
        )}
      </ul>
    </div>
  );
}
