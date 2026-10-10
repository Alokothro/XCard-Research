# XCard Research

Individual Research Milestone sample app (CSCE 490/492), built to learn the technology stack chosen for the StoneCap/XCard capstone project: **React Native + Expo + TypeScript**.

## What this demonstrates

- A multi-screen app using **React Navigation** (bottom tabs), not a single "Hello World" view.
- A real data model in TypeScript (`src/data.ts`): cards, reward rules, categories.
- A real interactive flow (`src/screens/RecommendScreen.tsx`): the user types a merchant name, the app infers a spending category, the user can correct it, enters a purchase amount, and the app computes which saved card earns the best reward — showing the recommended card, the estimated dollar reward, and a plain-language reason.
- The recommendation math itself (`src/logic.ts`) is a small, pure, independently testable function, mirroring the rule-based (non-AI) reward calculation the actual XCard app will use.

## Running it

```bash
npm install
npm run web    # or: npm run ios / npm run android
```

## Relationship to the team project

This is a personal learning exercise for the Research Milestone, not the team's actual StoneCap/XCard codebase (github.com/SCCapstone/Stonecap). It uses the same tech stack the team selected so the research is directly transferable.
