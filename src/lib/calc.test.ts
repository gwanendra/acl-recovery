import { describe, expect, it } from "vitest";
import { mainFocusForToday, pickDailyExercises } from "./calc";
import type { Exercise, Session } from "./types";

function exercise(overrides: Partial<Exercise> & Pick<Exercise, "id">): Exercise {
  return {
    name: overrides.id,
    defaultSets: 3,
    defaultReps: "8-12",
    unit: "reps",
    ...overrides,
  };
}

function session(overrides: Partial<Session> & Pick<Session, "id" | "date" | "createdAt">): Session {
  return {
    exercises: [],
    pain: 0,
    swelling: "none",
    type: "train",
    ...overrides,
  };
}

function loggedExercise(exerciseId: string) {
  return { exerciseId, exerciseName: exerciseId, sets: [] };
}

describe("pickDailyExercises", () => {
  it("always includes exercises with no variantGroup", () => {
    const exercises = [exercise({ id: "a" }), exercise({ id: "b" })];
    const picks = pickDailyExercises(exercises, []);
    expect(picks.map((e) => e.id).sort()).toEqual(["a", "b"]);
  });

  it("picks one exercise from a variantGroup, defaulting to the first", () => {
    const exercises = [
      exercise({ id: "a", variantGroup: "g" }),
      exercise({ id: "b", variantGroup: "g" }),
      exercise({ id: "c", variantGroup: "g" }),
    ];
    const picks = pickDailyExercises(exercises, []);
    expect(picks.map((e) => e.id)).toEqual(["a"]);
  });

  it("rotates to the exercise after the most recently logged one in the group", () => {
    const exercises = [
      exercise({ id: "a", variantGroup: "g" }),
      exercise({ id: "b", variantGroup: "g" }),
      exercise({ id: "c", variantGroup: "g" }),
    ];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T10:00:00.000Z",
        exercises: [loggedExercise("b")],
      }),
    ];
    const picks = pickDailyExercises(exercises, sessions);
    expect(picks.map((e) => e.id)).toEqual(["c"]);
  });

  it("wraps back to the first exercise after the last in the group", () => {
    const exercises = [
      exercise({ id: "a", variantGroup: "g" }),
      exercise({ id: "b", variantGroup: "g" }),
    ];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T10:00:00.000Z",
        exercises: [loggedExercise("b")],
      }),
    ];
    const picks = pickDailyExercises(exercises, sessions);
    expect(picks.map((e) => e.id)).toEqual(["a"]);
  });

  it("uses createdAt, not array order, to break a same-date tie", () => {
    // Regression test: two sessions logged the same calendar day — the
    // later-created one (by createdAt) must win, not whichever happens to
    // sort first when dates compare equal.
    const exercises = [
      exercise({ id: "a", variantGroup: "g" }),
      exercise({ id: "b", variantGroup: "g" }),
      exercise({ id: "c", variantGroup: "g" }),
    ];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T08:00:00.000Z",
        exercises: [loggedExercise("a")],
      }),
      session({
        id: "s2",
        date: "2026-01-01",
        createdAt: "2026-01-01T20:00:00.000Z",
        exercises: [loggedExercise("b")],
      }),
    ];
    const picks = pickDailyExercises(exercises, sessions);
    // Most recently *created* log was "b" -> next should be "c", not "b" (which
    // array/date-only ordering would have produced by picking "a" as "latest").
    expect(picks.map((e) => e.id)).toEqual(["c"]);
  });

  it("filters main-section exercises to today's mainFocus", () => {
    const exercises = [
      exercise({ id: "quad-lift", section: "main", mainFocus: "quad" }),
      exercise({ id: "hip-lift", section: "main", mainFocus: "hip" }),
      exercise({ id: "core-move", section: "core" }),
    ];
    const picks = pickDailyExercises(exercises, []);
    expect(picks.map((e) => e.id).sort()).toEqual(["core-move", "quad-lift"]);
  });

  it("flips main focus after a train session logs the other focus", () => {
    const exercises = [
      exercise({ id: "quad-lift", section: "main", mainFocus: "quad" }),
      exercise({ id: "hip-lift", section: "main", mainFocus: "hip" }),
    ];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T10:00:00.000Z",
        exercises: [loggedExercise("quad-lift")],
      }),
    ];
    const picks = pickDailyExercises(exercises, sessions);
    expect(picks.map((e) => e.id)).toEqual(["hip-lift"]);
  });

  it("ignores recovery/rest sessions when determining main focus", () => {
    const exercises = [
      exercise({ id: "quad-lift", section: "main", mainFocus: "quad" }),
      exercise({ id: "hip-lift", section: "main", mainFocus: "hip" }),
    ];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T10:00:00.000Z",
        type: "recovery",
        exercises: [loggedExercise("quad-lift")],
      }),
    ];
    // "quad-lift" only appears in a recovery session (shouldn't happen via the
    // UI, but the function should still ignore it) -> stays on the default.
    const picks = pickDailyExercises(exercises, sessions);
    expect(picks.map((e) => e.id)).toEqual(["quad-lift"]);
  });

  it("relax mode trims to warm-up + essential exercises only", () => {
    const exercises = [
      exercise({ id: "bike", section: "warmup" }),
      exercise({ id: "balance", section: "core", essential: true }),
      exercise({ id: "other-core", section: "core" }),
      exercise({ id: "press", section: "main", mainFocus: "quad", essential: true }),
      exercise({ id: "other-main", section: "main" }),
      exercise({ id: "finisher-move", section: "finisher" }),
    ];
    const picks = pickDailyExercises(exercises, [], { relax: true });
    expect(picks.map((e) => e.id).sort()).toEqual(["balance", "bike", "press"]);
  });

  it("relax mode keeps an essential main exercise regardless of today's mainFocus", () => {
    const exercises = [
      exercise({ id: "quad-press", section: "main", mainFocus: "quad", essential: true }),
      exercise({ id: "hip-lift", section: "main", mainFocus: "hip" }),
    ];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T10:00:00.000Z",
        exercises: [loggedExercise("quad-press")],
      }),
    ];
    // A normal train day would flip to "hip" here and drop quad-press entirely.
    const trainPicks = pickDailyExercises(exercises, sessions);
    expect(trainPicks.map((e) => e.id)).toEqual(["hip-lift"]);

    // Relax mode skips that filter, so the essential quad exercise survives.
    const relaxPicks = pickDailyExercises(exercises, sessions, { relax: true });
    expect(relaxPicks.map((e) => e.id)).toEqual(["quad-press"]);
  });
});

describe("mainFocusForToday", () => {
  it("defaults to quad with no train history", () => {
    expect(mainFocusForToday([], [])).toBe("quad");
  });

  it("flips based on the most recent train session's tagged exercise", () => {
    const exercises = [exercise({ id: "hip-lift", section: "main", mainFocus: "hip" })];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T10:00:00.000Z",
        exercises: [loggedExercise("hip-lift")],
      }),
    ];
    expect(mainFocusForToday(exercises, sessions)).toBe("quad");
  });

  it("breaks a same-date tie by createdAt", () => {
    const exercises = [
      exercise({ id: "quad-lift", section: "main", mainFocus: "quad" }),
      exercise({ id: "hip-lift", section: "main", mainFocus: "hip" }),
    ];
    const sessions = [
      session({
        id: "s1",
        date: "2026-01-01",
        createdAt: "2026-01-01T08:00:00.000Z",
        exercises: [loggedExercise("quad-lift")],
      }),
      session({
        id: "s2",
        date: "2026-01-01",
        createdAt: "2026-01-01T20:00:00.000Z",
        exercises: [loggedExercise("hip-lift")],
      }),
    ];
    // Later-created session logged "hip" -> today should flip to "quad".
    expect(mainFocusForToday(exercises, sessions)).toBe("quad");
  });
});
