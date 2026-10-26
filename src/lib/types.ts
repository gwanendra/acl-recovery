export type Side = "injured" | "healthy" | "both";
export type Swelling = "none" | "mild" | "moderate";
export type Unit = "reps" | "seconds" | "minutes";
export type ExerciseCategory = "strength" | "recovery";
export type SessionType = "train" | "recovery" | "rest";

// Groups strength exercises into the order a training day actually flows in.
// Only meaningful for category: "strength" — recovery days aren't sectioned.
export type ExerciseSection = "warmup" | "core" | "main" | "finisher";

// Only meaningful for section "main". Lets a train day alternate between a
// quad-focused and a hip-hinge-focused set of main lifts instead of doing
// every main lift every session — see pickDailyExercises/mainFocusForToday
// in calc.ts. Main exercises without this field always show (e.g. none left
// untagged today, but a future one could opt out of the split).
export type MainFocus = "quad" | "hip";

export const SECTION_ORDER: ExerciseSection[] = ["warmup", "core", "main", "finisher"];

export const SECTION_LABEL: Record<ExerciseSection, string> = {
  warmup: "Warm-up",
  core: "Core & glutes",
  main: "Main lifts",
  finisher: "Finisher",
};

export function unitLabel(unit: Unit): string {
  if (unit === "seconds") return "s";
  if (unit === "minutes") return "min";
  return "reps";
}

export interface Exercise {
  id: string;
  name: string;
  defaultSets: number;
  defaultReps: string; // free text, e.g. "8-12" or "30-45"
  unit: Unit;
  notes?: string;
  archived?: boolean;
  category?: ExerciseCategory; // missing = "strength", for exercises saved before this field existed
  howTo?: string; // how-to-do-it / form cues, shown as a collapsible tip; "\n" for line breaks (rendered via whitespace-pre-line)
  areasTrained?: string[]; // muscle groups / areas this exercise targets, shown atop the How-to panel
  imageUrl?: string; // external demo image URL, shown in the same collapsible tip — never hosted in this repo
  section?: ExerciseSection; // missing = "main"; only used to group strength exercises in the UI
  mainFocus?: MainFocus; // only used for section "main" — see MainFocus
  defaultSide?: Side; // missing = "both"; set this when an exercise is inherently done on one leg (e.g. single-leg balance targets the injured leg specifically)
  variantGroup?: string; // exercises sharing this tag are interchangeable — only one shows per day, rotating
}

export interface SetEntry {
  id: string;
  reps: number;
  weight: number; // kg, 0 for bodyweight
  side: Side;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string; // snapshot at log time
  sets: SetEntry[];
}

export interface Session {
  id: string;
  date: string; // ISO date string yyyy-mm-dd
  createdAt: string; // ISO timestamp
  exercises: ExerciseLog[];
  pain: number; // 0-10
  swelling: Swelling;
  notes?: string;
  type?: SessionType; // missing = "train", for sessions logged before this field existed
}

export interface ReadinessState {
  noSwellingAfterTraining: boolean;
  fullRom: boolean;
  strength90Percent: boolean;
  painFreeJogging: boolean;
}

export const READINESS_ITEMS: { key: keyof ReadinessState; label: string }[] = [
  { key: "noSwellingAfterTraining", label: "No swelling after training" },
  { key: "fullRom", label: "Full range of motion" },
  { key: "strength90Percent", label: "Strength ≈90%+ of the other leg" },
  { key: "painFreeJogging", label: "Pain-free jogging" },
];
