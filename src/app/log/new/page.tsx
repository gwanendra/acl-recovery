import { Suspense } from "react";
import NewSessionClient from "./NewSessionClient";

export default function NewSessionPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-400">Loading…</p>}>
      <NewSessionClient />
    </Suspense>
  );
}
