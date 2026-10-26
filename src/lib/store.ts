"use client";

import { useLocalStorage } from "./useLocalStorage";
import { DEFAULT_EXERCISES, DEFAULT_READINESS, migrateExercises } from "./defaults";
import type { Exercise, ReadinessState, Session } from "./types";

export function useExercises() {
  return useLocalStorage<Exercise[]>("acl.exercises.v1", DEFAULT_EXERCISES, migrateExercises);
}

export function useSessions() {
  return useLocalStorage<Session[]>("acl.sessions.v1", []);
}

export function useReadiness() {
  return useLocalStorage<ReadinessState>("acl.readiness.v1", DEFAULT_READINESS);
}
