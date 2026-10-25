"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExercises, useSessions } from "@/lib/store";
import { loadOverTime, symmetryOverTime } from "@/lib/calc";
import { Card, Field, PageTitle, Select } from "@/components/ui";

export default function ProgressPage() {
  const [exercises, , exercisesHydrated] = useExercises();
  const [sessions, , sessionsHydrated] = useSessions();
  const [exerciseId, setExerciseId] = useState<string>("");

  const loadData = useMemo(
    () => (exerciseId ? loadOverTime(sessions, exerciseId) : []),
    [sessions, exerciseId]
  );
  const symmetryData = useMemo(
    () => symmetryOverTime(sessions, exerciseId || undefined),
    [sessions, exerciseId]
  );

  if (!exercisesHydrated || !sessionsHydrated) {
    return <p className="text-sm text-zinc-400">Loading…</p>;
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <PageTitle title="Progress" subtitle="Load over time and limb symmetry" />
        <p className="py-6 text-center text-sm text-zinc-400">
          Log a few sessions to see charts here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageTitle title="Progress" subtitle="Load over time and limb symmetry" />

      <Field label="Exercise">
        <Select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
          <option value="">All exercises (symmetry only)</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </Select>
      </Field>

      {exerciseId && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold">Load over time</h2>
          {loadData.length === 0 ? (
            <p className="text-sm text-zinc-400">No logs yet for this exercise.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={loadData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="total" name="Total" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="injured" name="Injured" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="healthy" name="Healthy" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      )}

      <Card>
        <h2 className="mb-1 text-sm font-semibold">Limb symmetry</h2>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
          Injured-leg load as % of healthy-leg load{exerciseId ? "" : " (across all exercises)"}
        </p>
        {symmetryData.length === 0 ? (
          <p className="text-sm text-zinc-400">
            Log sets for both the injured and healthy side in the same session to see this.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={symmetryData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 120]} />
              <Tooltip />
              <Line type="monotone" dataKey="symmetry" name="Symmetry %" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
