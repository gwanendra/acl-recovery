"use client";

import { useState } from "react";
import type { Exercise, ExerciseCategory, ExerciseSection, Unit } from "@/lib/types";
import { SECTION_LABEL, SECTION_ORDER } from "@/lib/types";
import { newId } from "@/lib/useLocalStorage";
import { Button, Field, Select, Textarea, TextInput } from "@/components/ui";

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
  const [category, setCategory] = useState<ExerciseCategory>(initial?.category ?? "strength");
  const [section, setSection] = useState<ExerciseSection>(initial?.section ?? "main");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [howTo, setHowTo] = useState(initial?.howTo ?? "");
  const [areasTrained, setAreasTrained] = useState(initial?.areasTrained?.join(", ") ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [variantGroup, setVariantGroup] = useState(initial?.variantGroup ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initial?.id ?? newId(),
      name: name.trim(),
      defaultSets,
      defaultReps,
      unit,
      category,
      section: category === "strength" ? section : undefined,
      notes: notes.trim() || undefined,
      howTo: howTo.trim() || undefined,
      areasTrained: areasTrained.trim()
        ? areasTrained
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : undefined,
      imageUrl: imageUrl.trim() || undefined,
      variantGroup: variantGroup.trim() || undefined,
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
      <div className="grid grid-cols-2 gap-3">
        <Field label="Unit">
          <Select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            <option value="reps">Reps</option>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
          </Select>
        </Field>
        <Field label="Type">
          <Select value={category} onChange={(e) => setCategory(e.target.value as ExerciseCategory)}>
            <option value="strength">Strength (train day)</option>
            <option value="recovery">Recovery (light day)</option>
          </Select>
        </Field>
      </div>
      {category === "strength" && (
        <Field label="Section (where it shows up on a train day)">
          <Select value={section} onChange={(e) => setSection(e.target.value as ExerciseSection)}>
            {SECTION_ORDER.map((s) => (
              <option key={s} value={s}>
                {SECTION_LABEL[s]}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Field label="Notes (optional)">
        <TextInput value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
      </Field>
      <Field label="Areas trained (optional)">
        <TextInput
          value={areasTrained}
          onChange={(e) => setAreasTrained(e.target.value)}
          placeholder="e.g. Glutes, hip abductors"
        />
      </Field>
      <Field label="How to do it (optional)">
        <Textarea
          value={howTo}
          onChange={(e) => setHowTo(e.target.value)}
          placeholder="Form cues, setup, what to watch out for…"
        />
      </Field>
      <Field label="Demo image URL (optional)">
        <TextInput
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://… — an external link, not uploaded"
        />
      </Field>
      <Field label="Rotate with (optional)">
        <TextInput
          value={variantGroup}
          onChange={(e) => setVariantGroup(e.target.value)}
          placeholder="e.g. calf-raise — give matching exercises the same name to rotate between them"
        />
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
