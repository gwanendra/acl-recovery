import type { Exercise, ReadinessState } from "./types";

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "split-squat",
    name: "Split squat",
    defaultSets: 3,
    defaultReps: "8-12",
    unit: "reps",
    category: "strength",
    notes: "Progress with dumbbells",
    howTo:
      "Rear foot up on a bench (or just back behind you). Front knee tracks over your toes, lower until your back knee nearly touches the floor, then push through your front heel. Keep your torso tall.",
  },
  {
    id: "single-leg-press",
    name: "Single-leg press",
    defaultSets: 3,
    defaultReps: "8-12",
    unit: "reps",
    category: "strength",
    notes: "Compare left vs right load",
    howTo:
      "Seat set so your knee bends to about 90°. Press through your whole foot, not just your toes. Control the way back down — don't let the weight stack slam.",
  },
  {
    id: "glute-bridge",
    name: "Glute bridge / single-leg bridge",
    defaultSets: 3,
    defaultReps: "10-15",
    unit: "reps",
    category: "strength",
    notes: "Hamstrings and glutes",
    howTo:
      "Lie on your back, knees bent, feet flat. Squeeze your glutes to lift your hips into a straight line from shoulder to knee. For single-leg, keep the other knee pulled to your chest.",
  },
  {
    id: "step-ups",
    name: "Step-ups",
    defaultSets: 3,
    defaultReps: "10",
    unit: "reps",
    category: "strength",
    notes: "Raise box height over time",
    howTo:
      "Step fully onto the box leading with your injured leg — avoid pushing off the back foot to cheat the rep. Control the step back down, don't just drop.",
  },
  {
    id: "hamstring-curls",
    name: "Hamstring curls",
    defaultSets: 3,
    defaultReps: "10-12",
    unit: "reps",
    category: "strength",
    howTo:
      "Keep your hips pressed into the pad or floor the whole time. Curl through a full range without letting your hips lift up.",
  },
  {
    id: "single-leg-balance",
    name: "Single-leg balance",
    defaultSets: 3,
    defaultReps: "30-45",
    unit: "seconds",
    category: "strength",
    notes: "Progress to unstable surface or eyes closed",
    howTo:
      "Stand on one leg, soft knee, eyes forward. Too easy? Close your eyes or stand on a pillow/cushion to make it harder.",
  },
  {
    id: "stationary-bike",
    name: "Stationary bike (warm-up)",
    defaultSets: 1,
    defaultReps: "5",
    unit: "minutes",
    category: "strength",
    notes: "Before training",
    howTo:
      "Light resistance, just enough to get blood flowing before you lift. This is a warm-up, not a workout — keep it easy.",
  },
  {
    id: "easy-bike",
    name: "Easy stationary bike",
    defaultSets: 1,
    defaultReps: "10-15",
    unit: "minutes",
    category: "recovery",
    howTo:
      "Low resistance, easy spin. The goal is blood flow and joint lubrication, not effort — you should be able to hold a conversation the whole time.",
  },
  {
    id: "mobility-flow",
    name: "Mobility flow / stretching",
    defaultSets: 1,
    defaultReps: "8-10",
    unit: "minutes",
    category: "recovery",
    howTo:
      "Gentle hip, quad, hamstring, and calf stretches. Nothing should feel sharp — ease into each stretch and breathe through it.",
  },
  {
    id: "easy-walk",
    name: "Easy walk",
    defaultSets: 1,
    defaultReps: "15-20",
    unit: "minutes",
    category: "recovery",
    howTo:
      "Flat ground, comfortable pace. If the knee feels fine, this is a good way to fill a recovery day without loading it.",
  },
  {
    id: "foam-rolling",
    name: "Foam rolling / self-massage",
    defaultSets: 1,
    defaultReps: "5-8",
    unit: "minutes",
    category: "recovery",
    howTo:
      "Roll quads, IT band, and calves. Slow passes, pausing on tender spots for about 20-30 seconds.",
  },
];

export const DEFAULT_READINESS: ReadinessState = {
  noSwellingAfterTraining: false,
  fullRom: false,
  strength90Percent: false,
  painFreeJogging: false,
};
