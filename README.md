# ACL Recovery Tracker

A simple, private app for tracking strength training during ACL rehab — right now tuned for **Phase 3: Strength & Control**.

Everything is saved on your own device. There's no account, no server, and no one else can see your data.

## What it does

- **Today's plan** — see your current exercise list at a glance, and a quick snapshot of your limb symmetry and Phase 4 readiness.
- **Log a session** — record sets, reps, and weight for each exercise, for your injured side and healthy side separately, plus how your knee felt (pain and swelling).
- **Exercise library** — add, edit, archive, or remove exercises to match whatever your physio has you doing.
- **Progress** — charts showing training load over time and limb symmetry (injured leg vs. healthy leg), so you can see trends instead of guessing.
- **Phase 4 readiness** — a checklist of the usual criteria (no swelling after training, full range of motion, ~90%+ strength, pain-free jogging) to track against before talking to your physio about progressing.
- **Heads-up warnings** — if a logged session had high pain or noticeable swelling, the home screen reminds you to check in with your physio before pushing harder.

This app is a tracker, not medical advice. It doesn't clear you for anything — always confirm progression with your physio.

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Your data is stored locally in the browser, so it stays on whichever device you use it on.
