import type { Session } from "@/lib/types";
import { shouldWarn } from "@/lib/calc";

export default function WarningBanner({ latestSession }: { latestSession?: Session }) {
  if (!latestSession || !shouldWarn(latestSession.pain, latestSession.swelling)) return null;

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
      <p className="font-semibold">Check with your physio</p>
      <p className="mt-0.5 text-amber-800 dark:text-amber-300">
        Your last session logged pain {latestSession.pain}/10
        {latestSession.swelling === "moderate" ? " with moderate swelling" : ""}. Consider
        easing load and checking in before your next session.
      </p>
    </div>
  );
}
