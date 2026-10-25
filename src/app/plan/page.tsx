"use client";

import { useState } from "react";
import { useExercises } from "@/lib/store";
import { exerciseCategory, exerciseSection } from "@/lib/calc";
import { SECTION_LABEL, unitLabel, type Exercise } from "@/lib/types";
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

  // Exercises can only swap with a neighbor in the same visual group: the
  // same section for strength exercises (so arrows stay effective now that
  // the list is grouped by section), or anywhere within recovery.
  function groupIdsFor(ex: Exercise): string[] {
    return exercises
      .filter((e) => (showArchived ? e.archived : !e.archived))
      .filter((e) => exerciseCategory(e) === exerciseCategory(ex))
      .filter((e) => exerciseCategory(ex) !== "strength" || exerciseSection(e) === exerciseSection(ex))
      .map((e) => e.id);
  }

  function moveExercise(id: string, direction: "up" | "down") {
    setExercises((prev) => {
      const target = prev.find((e) => e.id === id);
      if (!target) return prev;
      const groupIds = groupIdsFor(target);
      const posInGroup = groupIds.indexOf(id);
      const swapWithId = groupIds[direction === "up" ? posInGroup - 1 : posInGroup + 1];
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
      <PageTitle title="Exercise library" subtitle="Edit sets, reps, and weight — make it yours" />

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
        {visible.map((ex, index) => {
          const prevEx = index > 0 ? visible[index - 1] : undefined;
          const section = exerciseCategory(ex) === "strength" ? exerciseSection(ex) : null;
          const prevSection =
            prevEx && exerciseCategory(prevEx) === "strength" ? exerciseSection(prevEx) : null;
          const showSectionHeader = section !== null && section !== prevSection;
          const group = groupIdsFor(ex);
          const posInGroup = group.indexOf(ex.id);

          return (
          <li key={ex.id} className="flex flex-col gap-2">
            {showSectionHeader && (
              <h3 className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 first:mt-0">
                {SECTION_LABEL[section]}
              </h3>
            )}
            {editing?.id === ex.id ? (
            <Card>
              <h2 className="mb-3 text-sm font-semibold">Edit exercise</h2>
              <ExerciseForm initial={ex} onSave={saveExercise} onCancel={() => setEditing(null)} />
            </Card>
          ) : (
            <Card>
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
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveExercise(ex.id, "up")}
                      disabled={posInGroup === 0}
                      aria-label="Move up"
                      className="flex h-11 w-11 items-center justify-center rounded-md text-sm font-medium text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveExercise(ex.id, "down")}
                      disabled={posInGroup === group.length - 1}
                      aria-label="Move down"
                      className="flex h-11 w-11 items-center justify-center rounded-md text-sm font-medium text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
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
            )}
          </li>
          );
        })}
        {visible.length === 0 && (
          <p className="py-6 text-center text-sm text-zinc-400">
            {showArchived ? "No archived exercises." : "No exercises — add one above."}
          </p>
        )}
      </ul>
    </div>
  );
}
