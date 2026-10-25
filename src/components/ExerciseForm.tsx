"use client";

import { useState } from "react";
import type { Exercise, Unit } from "@/lib/types";
import { newId } from "@/lib/useLocalStorage";
import { Button, Field, Select, TextInput } from "@/components/ui";

export default function ExerciseForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [defaultSets, setDefaultSets] = useState(initial?.defaultSets ?? 3);
  const [defaultReps, setDefaultReps] = useState(initial?.defaultReps ?? "8-12");
  const [unit, setUnit] = useState<Unit>(initial?.unit ?? "reps");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? newId(),
      name: name.trim(),
      defaultSets,
      defaultReps,
      unit,
      notes: notes.trim() || undefined,
      archived: initial?.archived,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Field label="Name">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Split squat"
          required
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Sets">
          <TextInput
            type="number"
            min={1}
            value={defaultSets}
            onChange={(e) => setDefaultSets(Number(e.target.value))}
          />
        </Field>
        <Field label={unit === "seconds" ? "Duration (per set)" : "Reps"}>
          <TextInput
            value={defaultReps}
            onChange={(e) => setDefaultReps(e.target.value)}
            placeholder="8-12"
          />
        </Field>
      </div>
      <Field label="Unit">
        <Select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          <option value="reps">Reps</option>
          <option value="seconds">Seconds</option>
        </Select>
      </Field>
      <Field label="Notes (optional)">
        <TextInput value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
      </Field>
      <div className="mt-1 flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
