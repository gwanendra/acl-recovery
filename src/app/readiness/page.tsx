"use client";

import { useReadiness } from "@/lib/store";
import { READINESS_ITEMS } from "@/lib/types";
import { Card, PageTitle } from "@/components/ui";

export default function ReadinessPage() {
  const [readiness, setReadiness, hydrated] = useReadiness();

  if (!hydrated) return <p className="text-sm text-zinc-400">Loading…</p>;

  const metCount = READINESS_ITEMS.filter((item) => readiness[item.key]).length;
  const allMet = metCount === READINESS_ITEMS.length;

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Readiness check"
        subtitle="Check these off yourself — this is a tracker, not a clearance. Confirm with your physio before progressing."
      />

      <Card>
        <p className="text-2xl font-bold">
          {metCount}/{READINESS_ITEMS.length}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">criteria checked</p>
      </Card>

      <ul className="flex flex-col gap-2">
        {READINESS_ITEMS.map((item) => (
          <Card key={item.key}>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={readiness[item.key]}
                onChange={(e) =>
                  setReadiness((prev) => ({ ...prev, [item.key]: e.target.checked }))
                }
                className="h-5 w-5 accent-emerald-600"
              />
              <span className="text-sm font-medium">{item.label}</span>
            </label>
          </Card>
        ))}
      </ul>

      {allMet && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
          All criteria checked. If you ever want to push toward running or sport, loop in your
          physio — otherwise, this is a great place to be.
        </div>
      )}
    </div>
  );
}
