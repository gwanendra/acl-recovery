import type { Exercise, ReadinessState } from "./types";

export const DEFAULT_EXERCISES: Exercise[] = [
  // Warm-up — picks one each session via variantGroup "warmup-cardio"
  {
    id: "stationary-bike",
    name: "Stationary bike (warm-up)",
    defaultSets: 1,
    defaultReps: "5",
    unit: "minutes",
    category: "strength",
    section: "warmup",
    variantGroup: "warmup-cardio",
    notes: "Before training",
    howTo:
      "Light resistance, just enough to get blood flowing before you lift. This is a warm-up, not a workout — keep it easy.",
  },
  {
    id: "bodyweight-warmup-flow",
    name: "Bodyweight warm-up flow",
    defaultSets: 1,
    defaultReps: "3-5",
    unit: "minutes",
    category: "strength",
    section: "warmup",
    variantGroup: "warmup-cardio",
    notes: "Use when the bike's taken",
    howTo:
      "Leg swings front-to-back and side-to-side, bodyweight glute bridges × 10, walking lunges × 10, ankle circles. Just get the joint moving and blood flowing before you lift.",
  },

  // Core & glutes — control/activation work. Balance and TKE stay fixed every
  // session; the glute-activation and anti-rotation core slots rotate one
  // pick each from their group so you're not doing the exact same 3 moves
  // every time.
  {
    id: "single-leg-balance",
    name: "Single-leg balance",
    defaultSets: 3,
    defaultReps: "30-45",
    unit: "seconds",
    category: "strength",
    section: "core",
    notes: "Progress to unstable surface or eyes closed",
    howTo:
      "Stand on one leg, soft knee, eyes forward. Too easy? Close your eyes or stand on a pillow/cushion to make it harder.",
  },
  {
    id: "band-terminal-knee-extension",
    name: "Band terminal knee extension (TKE)",
    defaultSets: 3,
    defaultReps: "15-20",
    unit: "reps",
    category: "strength",
    section: "core",
    notes: "Quad activation — classic early ACL drill",
    howTo:
      "Anchor a band behind your knee (around a rack post or door). Stand with a slight bend in the knee, then straighten it fully against the band, squeezing your quad at the top. Small range, but don't skip the lockout — that's the whole point of the move.",
  },
  {
    id: "band-lateral-walks",
    name: "Band lateral walks (monster walk)",
    defaultSets: 3,
    defaultReps: "10-15 steps each way",
    unit: "reps",
    category: "strength",
    section: "core",
    variantGroup: "glute-activation",
    notes: "Glute medius — keeps the knee from caving in",
    howTo:
      "Band around your ankles or just above the knees, feet hip-width, knees slightly bent. Step sideways keeping tension on the band the whole time — don't let your feet drift together or your knee cave inward.",
  },
  {
    id: "clamshells",
    name: "Clamshells",
    defaultSets: 3,
    defaultReps: "15-20 each side",
    unit: "reps",
    category: "strength",
    section: "core",
    variantGroup: "glute-activation",
    notes: "Glute medius, no equipment needed",
    howTo:
      "Lie on your side, knees bent about 45°, feet together. Keeping feet touching, open your top knee like a clamshell by rotating at the hip — don't let your pelvis roll backward. Add a mini-band above the knees once bodyweight feels easy.",
  },
  {
    id: "side-plank-hip-abduction",
    name: "Side plank with hip abduction",
    defaultSets: 3,
    defaultReps: "8-10 each side",
    unit: "reps",
    category: "strength",
    section: "core",
    variantGroup: "glute-activation",
    notes: "Core and glute medius together",
    howTo:
      "Side plank on your forearm, knees straight, hips stacked. Lift your top leg up and down without letting your hips sag or rotate. Drop to your knees if a full plank is too hard to hold with good form.",
  },
  {
    id: "pallof-press",
    name: "Pallof press",
    defaultSets: 3,
    defaultReps: "10-12 each side",
    unit: "reps",
    category: "strength",
    section: "core",
    variantGroup: "core-anti-rotation",
    notes: "Anti-rotation core — resist the band pulling you sideways",
    howTo:
      "Anchor a band at chest height to your side. Hold it at your chest with both hands, step away to create tension, then press it straight out in front of you and back without letting your torso rotate toward the anchor.",
  },
  {
    id: "bird-dog",
    name: "Bird dog",
    defaultSets: 3,
    defaultReps: "8-10 each side",
    unit: "reps",
    category: "strength",
    section: "core",
    variantGroup: "core-anti-rotation",
    notes: "Core stability and balance, no equipment",
    howTo:
      "On hands and knees, extend one arm and the opposite leg straight out until level with your torso, keeping your back flat and hips square. Hold briefly, return with control, switch sides.",
  },
  {
    id: "dead-bug",
    name: "Dead bug",
    defaultSets: 3,
    defaultReps: "8-10 each side",
    unit: "reps",
    category: "strength",
    section: "core",
    variantGroup: "core-anti-rotation",
    notes: "Core control, easier on the back than sit-ups",
    howTo:
      "Lie on your back, arms up, knees bent 90° over your hips. Slowly lower one arm and the opposite leg toward the floor without letting your lower back arch off the ground, then return and switch sides.",
  },
  {
    id: "glute-bridge",
    name: "Glute bridge / single-leg bridge",
    defaultSets: 3,
    defaultReps: "10-15",
    unit: "reps",
    category: "strength",
    section: "core",
    notes: "Hamstrings and glutes",
    howTo:
      "Lie on your back, knees bent, feet flat. Squeeze your glutes to lift your hips into a straight line from shoulder to knee. For single-leg, keep the other knee pulled to your chest.",
  },

  // Main lifts — the tracked compound work, kept fixed so progress over
  // weeks is actually comparable session to session.
  {
    id: "split-squat",
    name: "Split squat",
    defaultSets: 3,
    defaultReps: "8-12",
    unit: "reps",
    category: "strength",
    section: "main",
    notes: "Progress with dumbbells",
    howTo:
      "Rear foot up on a bench (or just back behind you). Front knee tracks over your toes, lower until your back knee nearly touches the floor, then push through your front heel. Keep your torso tall.",
  },
  {
    id: "step-ups",
    name: "Step-ups",
    defaultSets: 3,
    defaultReps: "10",
    unit: "reps",
    category: "strength",
    section: "main",
    notes: "Raise box height over time",
    howTo:
      "Step fully onto the box leading with your injured leg — avoid pushing off the back foot to cheat the rep. Control the step back down, don't just drop.",
  },
  {
    id: "single-leg-press",
    name: "Single-leg press",
    defaultSets: 3,
    defaultReps: "8-12",
    unit: "reps",
    category: "strength",
    section: "main",
    notes: "Compare left vs right load",
    howTo:
      "Seat set so your knee bends to about 90°. Press through your whole foot, not just your toes. Control the way back down — don't let the weight stack slam.",
  },
  {
    id: "wall-sit",
    name: "Wall sit",
    defaultSets: 3,
    defaultReps: "30-45",
    unit: "seconds",
    category: "strength",
    section: "main",
    notes: "Quad isometric endurance",
    howTo:
      "Back against a wall, feet shoulder-width, slide down until your thighs are close to parallel with the floor, knees tracking over your toes, not caving in. Hold — breathe, don't hold your breath. Once this feels easy, add calf-raise pulses (rise onto your toes and back down) while staying in the hold.",
  },

  // Finisher — isolation and endurance work, fine to do a little fatigued.
  // The calf raise slot rotates through 5 variations so you're not doing
  // the same one every session; swap in whichever equipment is free.
  {
    id: "hamstring-curls",
    name: "Hamstring curls",
    defaultSets: 3,
    defaultReps: "10-12",
    unit: "reps",
    category: "strength",
    section: "finisher",
    howTo:
      "Keep your hips pressed into the pad or floor the whole time. Curl through a full range without letting your hips lift up.",
  },
  {
    id: "nordic-hamstring-curl",
    name: "Nordic hamstring curl (bench)",
    defaultSets: 3,
    defaultReps: "4-6",
    unit: "reps",
    category: "strength",
    section: "finisher",
    notes: "Advanced — only once regular hamstring curls feel easy",
    howTo:
      "Kneel on a pad with your ankles locked down (partner holds them, or use a Nordic bench/strap). Keeping your hips straight, lower your torso forward as slowly as you can control using your hamstrings, then push back up. Most people can only lower a little before losing control at first — that's normal, don't force the full range.",
  },
  {
    id: "standing-calf-raise",
    name: "Standing calf raise",
    defaultSets: 3,
    defaultReps: "15-20",
    unit: "reps",
    category: "strength",
    section: "finisher",
    variantGroup: "calf-raise",
    notes: "Bodyweight, straight-knee — gastrocnemius",
    howTo:
      "Stand on flat ground or a step edge, rise up onto your toes as high as you can, pause, lower slow and controlled. Off a step, let your heels drop below the edge for a deeper stretch.",
  },
  {
    id: "calf-raise-machine",
    name: "Calf raise (standing machine)",
    defaultSets: 3,
    defaultReps: "15-20",
    unit: "reps",
    category: "strength",
    section: "finisher",
    variantGroup: "calf-raise",
    notes: "Same movement as the bodyweight version, with added load",
    howTo:
      "Shoulders under the pads, rise onto your toes as high as you can, pause at the top, then lower under control past parallel for a full stretch at the bottom.",
  },
  {
    id: "leg-press-calf-raise",
    name: "Calf raise on leg press (angled)",
    defaultSets: 3,
    defaultReps: "15-20",
    unit: "reps",
    category: "strength",
    section: "finisher",
    variantGroup: "calf-raise",
    notes: "Good option when the calf machine's taken",
    howTo:
      "On the leg press, legs almost straight, place just the balls of your feet on the bottom edge of the platform. Push through your toes to extend your ankles, then lower until you feel a deep stretch in your calf.",
  },
  {
    id: "seated-calf-raise",
    name: "Seated calf raise",
    defaultSets: 3,
    defaultReps: "15-20",
    unit: "reps",
    category: "strength",
    section: "finisher",
    variantGroup: "calf-raise",
    notes: "Bent-knee — hits the soleus, which standing raises miss",
    howTo:
      "Sitting with knees bent about 90°, weight across your thighs (or use a seated calf machine), rise onto your toes and lower slowly under control.",
  },
  {
    id: "single-leg-calf-raise",
    name: "Single-leg calf raise",
    defaultSets: 3,
    defaultReps: "12-15 each side",
    unit: "reps",
    category: "strength",
    section: "finisher",
    variantGroup: "calf-raise",
    notes: "Progression once double-leg raises feel easy — also shows side-to-side gaps",
    howTo:
      "Same motion as a standing calf raise, on one leg at a time. Hold something for balance if needed, but keep the actual lift strict.",
  },

  // Recovery day — bike/walk rotate as the cardio choice, the mobility and
  // ROM work stays fixed since it's specifically targeting knee recovery.
  {
    id: "easy-bike",
    name: "Easy stationary bike",
    defaultSets: 1,
    defaultReps: "10-15",
    unit: "minutes",
    category: "recovery",
    variantGroup: "recovery-cardio",
    howTo:
      "Low resistance, easy spin. The goal is blood flow and joint lubrication, not effort — you should be able to hold a conversation the whole time.",
  },
  {
    id: "easy-walk",
    name: "Easy walk",
    defaultSets: 1,
    defaultReps: "15-20",
    unit: "minutes",
    category: "recovery",
    variantGroup: "recovery-cardio",
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
    id: "heel-slides",
    name: "Heel slides",
    defaultSets: 3,
    defaultReps: "10-15",
    unit: "reps",
    category: "recovery",
    notes: "Knee flexion range of motion",
    howTo:
      "Lie on your back, slide your heel toward your glutes by bending the knee as far as comfortable, hold a couple seconds, then slide back out. Go by feel — stretch, not pain.",
  },
  {
    id: "kneeling-heel-sit",
    name: "Kneeling heel-sit stretch",
    defaultSets: 3,
    defaultReps: "20-30",
    unit: "seconds",
    category: "recovery",
    notes: "Deep knee flexion — ease in, don't force it",
    howTo:
      "Kneel and slowly sit your hips back toward your heels, only as far as feels okay. This is a common way to regain full knee bend after surgery — small, frequent doses beat forcing one big stretch.",
  },
  {
    id: "hip-flexor-stretch",
    name: "Half-kneeling hip flexor stretch",
    defaultSets: 2,
    defaultReps: "30-45",
    unit: "seconds",
    category: "recovery",
    notes: "Tight hip flexors are common after months of altered gait",
    howTo:
      "Half-kneeling position, back knee down, front foot forward. Tuck your pelvis slightly and shift your weight forward until you feel a stretch in the front of the back hip — squeeze that back glute to deepen it.",
  },
];

export const DEFAULT_READINESS: ReadinessState = {
  noSwellingAfterTraining: false,
  fullRom: false,
  strength90Percent: false,
  painFreeJogging: false,
};
