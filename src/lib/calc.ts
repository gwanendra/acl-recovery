import type { ExerciseLog, Session, SetEntry } from "./types";

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
