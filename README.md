# Leg Day

A personal strength training app for ACL recovery — the thing you open before a gym session, not a clinical tracker. Built for consistency and showing up, not for reporting progress to anyone.

Everything is saved on your own device. There's no account, no server, and no one else can see your data.

## What it does

- **Today** — a rotating line of encouragement, your mode for the day (Train / Recovery / Rest), and today's exercises grouped as Warm-up, Core & glutes, Main lifts, and Finisher.
- **Variety built in** — exercises that serve the same purpose (like calf raise variations, or glute activation moves) rotate automatically so you're not doing the exact same session every time.
- **Log a session** — record sets, reps, and weight for each exercise, for your injured side and healthy side separately, plus how your knee felt (pain and swelling).
- **Exercise library** — add, edit, reorder, and tag exercises by section — make it match whatever you're actually doing.
- **Progress** — charts showing training load over time and limb symmetry (injured leg vs. healthy leg), so you can see trends instead of guessing.
- **Readiness check** — an optional checklist (no swelling after training, full range of motion, ~90%+ strength, pain-free jogging) if you ever want to gauge where you're at. Not a requirement — some people use this app just to stay consistent, not to chase a return to sport.
- **Heads-up warnings** — if a logged session had high pain or noticeable swelling, the home screen reminds you to check in with your physio before pushing harder.

This app is a tracker, not medical advice. It doesn't clear you for anything — always confirm progression with your physio.

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Your data is stored locally in the browser, so it stays on whichever device you use it on.
