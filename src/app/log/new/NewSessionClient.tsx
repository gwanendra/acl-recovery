"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useExercises, useSessions } from "@/lib/store";
import { categoryForMode, exerciseCategory, pickDailyExercises } from "@/lib/calc";
import type { Session, SessionType } from "@/lib/types";
import SessionForm from "@/components/SessionForm";
import { PageTitle } from "@/components/ui";

const TITLE: Record<SessionType, string> = {
  train: "Log training",
  recovery: "Log recovery",
  rest: "Log rest day",
};

const SUBTITLE: Record<SessionType, string> = {
  train: "Record sets, reps, and weight.",
  recovery: "Light work — log what you did and how it felt.",
  rest: "No training today — just log how you're feeling.",
};

function readType(value: string | null): SessionType {
  return value === "recovery" || value === "rest" ? value : "train";
}

export default function NewSessionClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = readType(searchParams.get("type"));

  const [exercises, , exercisesHydrated] = useExercises();
  const [sessions, setSessions, sessionsHydrated] = useSessions();

  if (!exercisesHydrated || !sessionsHydrated) {
    return <p className="text-sm text-zinc-400">Loading…</p>;
  }

  function handleSave(session: Session) {
    setSessions((prev) => [...prev, session]);
    router.push("/log");
  }

  const categoryFiltered =
    type === "rest"
      ? []
      : exercises.filter((e) => !e.archived && exerciseCategory(e) === categoryForMode(type));
  // Same rotation as the home screen, so what you log here matches what it showed you.
  const relevantExercises = pickDailyExercises(categoryFiltered, sessions);

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title={TITLE[type]} subtitle={SUBTITLE[type]} />
      <SessionForm exercises={relevantExercises} type={type} sessions={sessions} onSave={handleSave} />
    </div>
  );
}
