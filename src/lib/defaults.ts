import type { Exercise, ReadinessState } from "./types";

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "split-squat",
    name: "Split squat",
    defaultSets: 3,
    defaultReps: "8-12",
    unit: "reps",
    notes: "Progress with dumbbells",
  },
  {
    id: "single-leg-press",
    name: "Single-leg press",
    defaultSets: 3,
    defaultReps: "8-12",
    unit: "reps",
    notes: "Compare left vs right load",
  },
  {
    id: "glute-bridge",
    name: "Glute bridge / single-leg bridge",
    defaultSets: 3,
    defaultReps: "10-15",
    unit: "reps",
    notes: "Hamstrings and glutes",
  },
  {
    id: "step-ups",
    name: "Step-ups",
    defaultSets: 3,
    defaultReps: "10",
    unit: "reps",
    notes: "Raise box height over time",
  },
  {
    id: "hamstring-curls",
    name: "Hamstring curls",
    defaultSets: 3,
    defaultReps: "10-12",
    unit: "reps",
  },
  {
    id: "single-leg-balance",
    name: "Single-leg balance",
    defaultSets: 3,
    defaultReps: "30-45",
    unit: "seconds",
    notes: "Progress to unstable surface or eyes closed",
  },
  {
    id: "stationary-bike",
    name: "Stationary bike",
    defaultSets: 1,
    defaultReps: "15-20",
    unit: "seconds",
    notes: "Warm-up (minutes)",
  },
];

export const DEFAULT_READINESS: ReadinessState = {
  noSwellingAfterTraining: false,
  fullRom: false,
  strength90Percent: false,
  painFreeJogging: false,
};
