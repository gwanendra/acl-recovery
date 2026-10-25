import type {
  Exercise,
  ExerciseCategory,
  ExerciseLog,
  ExerciseSection,
  Session,
  SessionType,
  SetEntry,
} from "./types";

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function exerciseCategory(exercise: Exercise): ExerciseCategory {
  return exercise.category ?? "strength";
}

export function exerciseSection(exercise: Exercise): ExerciseSection {
  return exercise.section ?? "main";
}

// Picks one exercise per day from a list that may include interchangeable
// variants (same `variantGroup`), so you don't see every alternative every
// session. Exercises with no `variantGroup` always show. Within a group,
// rotates to whichever exercise comes after the one most recently logged —
// defaults to the first in the list if the group has never been logged.
export function pickDailyExercises(exercises: Exercise[], sessions: Session[]): Exercise[] {
  const order = new Map(exercises.map((e, i) => [e.id, i]));
  const groups = new Map<string, Exercise[]>();
  const picks: Exercise[] = [];

  for (const ex of exercises) {
    if (!ex.variantGroup) {
      picks.push(ex);
      continue;
    }
    const group = groups.get(ex.variantGroup) ?? [];
    group.push(ex);
    groups.set(ex.variantGroup, group);
  }

  for (const group of groups.values()) {
    picks.push(group.length === 1 ? group[0] : pickNextInGroup(group, sessions));
  }

  return picks.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
}

function pickNextInGroup(group: Exercise[], sessions: Session[]): Exercise {
  const groupIds = new Set(group.map((e) => e.id));
  const sortedSessions = sessions.slice().sort((a, b) => b.date.localeCompare(a.date));

  for (const session of sortedSessions) {
    const loggedId = session.exercises.find((log) => groupIds.has(log.exerciseId))?.exerciseId;
    if (loggedId) {
      const idx = group.findIndex((e) => e.id === loggedId);
      return group[(idx + 1) % group.length];
    }
  }

  return group[0];
}

// "train"/"recovery" day modes map to "strength"/"recovery" exercise categories —
// the names differ (a session you log vs. an exercise you file), don't compare them directly.
export function categoryForMode(mode: "train" | "recovery"): ExerciseCategory {
  return mode === "train" ? "strength" : "recovery";
}

export function sessionType(session: Session): SessionType {
  return session.type ?? "train";
}

// Alternates train <-> recovery based on the most recently logged session,
// so a hard training day is always followed by a suggested light day.
export function suggestedMode(sessions: Session[]): "train" | "recovery" {
  if (sessions.length === 0) return "train";
  const latest = sessions.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  return sessionType(latest) === "train" ? "recovery" : "train";
}

// Consecutive days (ending today, or yesterday if today isn't logged yet)
// with any session logged — train, recovery, or rest all count as "showed up".
export function currentStreak(sessions: Session[], today: string = todayIso()): number {
  const dates = new Set(sessions.map((s) => s.date));
  if (dates.size === 0) return 0;

  const cursor = new Date(`${today}T00:00:00`);
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Load proxy for a single set: weighted sets use reps*weight, bodyweight sets use reps.
export function setLoad(set: SetEntry): number {
  return set.weight > 0 ? set.reps * set.weight : set.reps;
}

export function logLoad(log: ExerciseLog, side?: "injured" | "healthy"): number {
  return log.sets
    .filter((s) => !side || s.side === side)
    .reduce((sum, s) => sum + setLoad(s), 0);
}

export interface LoadPoint {
  date: string;
  total: number;
  injured: number;
  healthy: number;
}

export function loadOverTime(sessions: Session[], exerciseId: string): LoadPoint[] {
  return sessions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((session) => {
      const log = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (!log) return null;
      return {
        date: session.date,
        total: logLoad(log),
        injured: logLoad(log, "injured"),
        healthy: logLoad(log, "healthy"),
      };
    })
    .filter((p): p is LoadPoint => p !== null);
}

export interface SymmetryPoint {
  date: string;
  symmetry: number | null; // percent, null if no healthy-side data to compare
}

export function symmetryOverTime(sessions: Session[], exerciseId?: string): SymmetryPoint[] {
  return sessions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((session) => {
      const logs = exerciseId
        ? session.exercises.filter((e) => e.exerciseId === exerciseId)
        : session.exercises;
      let injured = 0;
      let healthy = 0;
      for (const log of logs) {
        injured += logLoad(log, "injured");
        healthy += logLoad(log, "healthy");
      }
      return {
        date: session.date,
        symmetry: healthy > 0 ? Math.round((injured / healthy) * 1000) / 10 : null,
      };
    })
    .filter((p) => p.symmetry !== null) as SymmetryPoint[];
}

export function latestSymmetry(sessions: Session[]): number | null {
  const points = symmetryOverTime(sessions);
  if (points.length === 0) return null;
  return points[points.length - 1].symmetry;
}

export function shouldWarn(pain: number, swelling: "none" | "mild" | "moderate"): boolean {
  return pain >= 5 || swelling === "moderate";
}
