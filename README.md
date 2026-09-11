# Detective Game

A narrative detective game built with React and TypeScript — investigate crime scenes, gather digital and physical evidence, interrogate suspects, pin a corkboard theory together, and build a real case (means, motive, opportunity) across four distinct cases.

## Gameplay flow

```
MainMenu → CaseSelection → CaseIntro → CrimeScene → Interrogation → EvidenceBoard → DigitalForensics → Accusation → Resolution
```

Each stage is driven by dedicated engines rather than being hardcoded per scene:

- **`CaseEngine`** — case state, progression through the flow above, and the means/motive/opportunity accusation evaluation behind the game's four possible endings
- **`EvidenceEngine`** — evidence collection/classification and the connectable evidence board (pin a piece of evidence to the suspect it implicates; scored against the case's real solution at Resolution)
- **`InterrogationEngine`** — suspect dialogue, emotional state, and suspicion level
- **`DigitalForensicsEngine`** — the phone/PIN/app mechanic: locked devices, apps, message threads and notes, some of which get permanently locked if the player takes too long (a real stakes mechanic, always with a redundant path to anything the case actually requires)
- **`RankEngine`** — a detective rank that only ever climbs across a session (Novato → Investigador → Detective → Detective Senior → Mente Maestra)

4 full cases are implemented as data (`src/data/cases/`), decoupled from the engines that run them. One of them — "Cuarenta y Ocho Horas" — is built entirely around digital evidence recovered from a victim's phone.

## Stack

- React 19 + TypeScript + Vite
- Zustand for global game state
- Framer Motion for scene transitions/animations
- Tailwind CSS
- Vitest + Testing Library for tests

## Testing

```bash
npm install
npm test
```

Covers all five engines, the Zustand store, data integrity across all four cases (including automated guards that every piece of evidence is actually obtainable, and that no locked digital thread/note can ever be the only path to evidence a case's accusation requires), full game-flow integration, and a dedicated QA suite (`src/__tests__/qa.test.ts`).

## Running it

```bash
npm install
npm run dev
```

## Why the QA suite is tagged the way it is

`src/__tests__/qa.test.ts` isn't just more coverage — each test is labeled `[BUG]`, `[GUARD]`, or `[EDGE]` depending on whether it's pinning down a confirmed bad behavior, confirming a defense that already works, or documenting an edge case whose "correct" behavior is genuinely debatable. I added that convention after a completeness audit turned up real reachability/redundancy/scoring bugs (see the `bf5db10` commit) — evidence data for a mystery game is exactly the kind of content that can go subtly wrong (a locked phone thread nobody can recover, a piece of key evidence the case's accusation logic never checks for) without anything crashing or looking obviously broken. The tags make it clear at a glance whether a red test on this file means "found a new bug" or "this case's edge behavior needs a product decision," instead of every failure looking the same.
