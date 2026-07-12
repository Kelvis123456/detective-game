# Detective Game

A narrative detective game built with React and TypeScript — investigate crime scenes, gather evidence, interrogate suspects, and make an accusation across three distinct cases.

## Gameplay flow

```
MainMenu → CaseSelection → CaseIntro → CrimeScene → Interrogation → EvidenceBoard → Accusation → Resolution
```

Each stage is driven by dedicated engines rather than being hardcoded per scene:

- **`CaseEngine`** — case state, progression through the flow above
- **`EvidenceEngine`** — evidence collection and evaluation
- **`InterrogationEngine`** — suspect dialogue and interrogation logic

3 full cases are implemented as data (`src/data/cases/`), decoupled from the engines that run them.

## Stack

- React 19 + TypeScript + Vite
- Zustand for global game state
- Framer Motion for scene transitions/animations
- Howler for audio
- Tailwind CSS
- Vitest + Testing Library for tests

## Testing

```bash
npm install
npm test
```

Covers the case, evidence, and interrogation engines, data integrity, full game-flow integration, and a dedicated QA suite (`src/__tests__/`).

## Running it

```bash
npm install
npm run dev
```
