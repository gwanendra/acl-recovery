export type Side = "injured" | "healthy" | "both";
export type Swelling = "none" | "mild" | "moderate";
export type Unit = "reps" | "seconds";

export interface Exercise {
  id: string;
  name: string;
  defaultSets: number;
  defaultReps: string; // free text, e.g. "8-12" or "30-45"
  unit: Unit;
  notes?: string;
  archived?: boolean;
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
