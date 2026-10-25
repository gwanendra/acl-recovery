"use client";

import { useRouter } from "next/navigation";
import { useExercises, useSessions } from "@/lib/store";
import type { Session } from "@/lib/types";
import SessionForm from "@/components/SessionForm";
import { PageTitle } from "@/components/ui";

export default function NewSessionPage() {
  const router = useRouter();
  const [exercises, , exercisesHydrated] = useExercises();
  const [, setSessions, sessionsHydrated] = useSessions();

  if (!exercisesHydrated || !sessionsHydrated) {
    return <p className="text-sm text-zinc-400">Loading…</p>;
  }

  function handleSave(session: Session) {
    setSessions((prev) => [...prev, session]);
    router.push("/log");
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Log session" subtitle="Record sets, reps, weight, and how you felt" />
      <SessionForm exercises={exercises.filter((e) => !e.archived)} onSave={handleSave} />
    </div>
  );
}
