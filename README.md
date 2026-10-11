# XCard Research

Individual Research Milestone sample app (CSCE 490/492). I built the same
minimal feature set (merchant input, inferred category, best-card
recommendation) twice, in two different tech stacks, so the comparison
below is based on firsthand experience rather than just reading
documentation.

| | Stack | Branch | What it is |
|---|---|---|---|
| **App 1** | React Native + Expo + TypeScript | `main` (this branch) | The stack the StoneCap/XCard team is actually using. |
| **App 2** | Native Swift + SwiftUI | [`native-swiftui-stack`](../../tree/native-swiftui-stack) | Explored because I have a Mac and some teammates don't, a stack they can't easily try themselves. |

## Demo video

<video src="https://github.com/Alokothro/XCard-Research/releases/download/research-milestone-demo/xcard-research-demo.mov" controls width="400"></video>

Walkthrough of both apps, ending with a live use of the Find Best Card
recommendation flow.

## App 1: React Native + Expo (this branch)

A real multi-screen app, not a "Hello World." Five tabs, matching the
team's actual XCard design (Wallet, Insights, Home, Profile, Settings),
plus a modal recommendation flow:

- **Wallet** (`src/screens/WalletScreen.tsx`) loads its cards from a real
  **PostgreSQL database hosted on Supabase**, not hardcoded local data, and
  shows a live status pill so it's clear whether the data is live or
  fallback sample data. See "Backend: PostgreSQL via Supabase" below.
- **Insights** (`src/screens/InsightsScreen.tsx`) shows spend-by-category
  as a hand-drawn SVG donut chart, ranks best-performing cards, and surfaces
  a plain-language reward tip. Sample data for now, not yet computed from
  real transaction history.
- **Home** (`src/screens/HomeScreen.tsx`) leads with the Optimization
  Score, the app's core concept: a ring showing how much I'm earning in
  rewards versus how much I could be earning. Below it, a circular
  "Find Best Card" button opens the recommendation flow.
- **Profile** and **Settings** (`src/screens/ProfileScreen.tsx`,
  `SettingsScreen.tsx`) round out the tab bar. Settings has a fully
  working light/dark theme toggle that repaints every screen live; most
  of Profile's rows are static for this prototype.
- **Recommend** (`src/screens/RecommendScreen.tsx`), opened from Home: type
  a merchant name, the app infers a spending category (correctable), enter
  a purchase amount, and it computes which saved card earns the best
  reward, showing the card, the estimated dollar reward, and a
  plain-language reason.
- The recommendation math (`src/logic.ts`) is a small, pure, independently
  testable function. No AI does this arithmetic.
- A typed data model in TypeScript (`src/data.ts`): cards, reward rules,
  categories.
- 22 automated Jest unit tests (`src/*.test.ts`) and a GitHub Actions
  workflow that runs them on every push.

Every color in the app comes from the team's actual color system, not a
one-off palette, so this build matches the real XCard/Figma design.

```bash
npm install
npm run web    # or: npm run ios / npm run android
```

## Backend: PostgreSQL via Supabase

The team's Requirements.md already commits to Node.js + Express + PostgreSQL
+ Supabase as the backend stack. App 1 exercises the database piece of that
for real: `cards` and `reward_rules` are tables in an actual Postgres
database (hosted free on Supabase), not hardcoded arrays. The Wallet screen
fetches them live on load and shows a **LIVE · SUPABASE** or
**OFFLINE · SAMPLE DATA** pill depending on whether that request succeeded.
If the network call fails, it falls back to the bundled sample data instead
of showing a broken screen, per Requirements.md 11.5 (Failure Safety).

Schema (run once in the Supabase SQL editor to reproduce):

```sql
create table cards (
  id bigint generated always as identity primary key,
  name text not null,
  last_four text not null,
  base_rate numeric(5,4) not null,
  is_default boolean not null default false
);

create table reward_rules (
  id bigint generated always as identity primary key,
  card_id bigint not null references cards(id) on delete cascade,
  category text not null,
  rate numeric(5,4) not null
);

alter table cards enable row level security;
alter table reward_rules enable row level security;

-- Sample-data prototype, no auth yet: readable by anyone holding the
-- public anon/publishable key, same idea Requirements.md 11.3 extends once
-- real user accounts exist (RLS scoped to auth.uid() instead of `true`).
create policy "Public read access" on cards for select using (true);
create policy "Public read access" on reward_rules for select using (true);
```

`src/supabase.ts` holds the client, created with the **publishable** key
(Supabase's current name for what used to be called the `anon` key). This
key is designed to be safe in client-side code; it's Row Level Security, not
key secrecy, that actually protects the data. `src/remoteCards.ts` queries
both tables and maps the rows into the same `Card` shape the rest of the app
already uses, so no other screen needed to change.

**A deliberately different architecture than just copying a classmate's
Express setup.** One teammate's research prototype built custom Express
endpoints (`/cards`, `/recommend`) that just query Postgres and return JSON.
That's exactly what Supabase already generates automatically from the
schema (PostgREST), with RLS enforcing access at the database level instead
of trusting each hand-written endpoint to filter correctly. So App 1 calls
Supabase **directly** from the client for plain reads, and reserves actual
custom server code for the one thing that genuinely requires a trusted
backend: Plaid's token exchange, where the resulting `access_token` is a
secret that must never reach the mobile client. Less code to write and
maintain, while still exercising every piece of the stack the team already
committed to.

## App 2: Native Swift + SwiftUI

See the [`native-swiftui-stack`](../../tree/native-swiftui-stack) branch for
the full app and its own README. Same five screens, same sample data, built
in Swift instead of TypeScript.

## Technology research

XCard needs a single app that runs on both iOS and Android, a custom
dark/bronze themed UI with charts (donut, line, bar) rather than default
platform widgets, a CSV file picker, a Plaid-based bank-linking flow, and
(per the team's Requirements doc) accessibility and automated-testing
standards. These needs drove the comparisons below.

### Platform: React Native (Expo) vs. Flutter vs. full native

| | React Native + Expo | Flutter | Native (Swift + Kotlin) |
|---|---|---|---|
| Codebases for iOS + Android | 1 | 1 | 2 |
| Language | TypeScript (same as our Node/Express backend) | Dart (new language, no backend overlap) | Swift + Kotlin (two new languages) |
| Plaid support | Official first-party SDK (`react-native-plaid-link-sdk`) | Community package only | Official native SDKs, but doubles integration work |
| Device testing without a full native toolchain | Yes, Expo Go, no Xcode/Android Studio required per teammate | No, needs Flutter SDK + platform toolchains | No, needs full Xcode and Android Studio |
| Cloud builds without owning a Mac | Yes, EAS Build | Possible via CI, more setup | iOS build requires a Mac |
| Charting | Good (react-native-svg, Victory Native) | Very good (fl_chart), custom rendering engine | Best (SwiftUI Charts / Compose), but per-platform |
| Raw performance | Good, JS bridge/New Architecture overhead | Very good, compiles to native ARM | Best |

**Why this matters for a 5-person student team on one semester:** building
and testing App 2 on the iOS Simulator this session required installing a
~10GB Xcode toolchain, hitting a broken Simulator.app on first install, and
then hand-wrapping a Swift Package build into a proper `.app` bundle just to
get it to install. None of that is needed for App 1. Expo Go sidesteps all
of it: any teammate can scan a QR code and run the real app on their own
phone with zero native tooling installed, and EAS Build can produce an
installable iOS/Android build without every teammate owning a Mac. Flutter's
rendering engine and chart libraries are genuinely excellent and would be my
second choice, but Dart doesn't share any code or types with the
Node/Express/TypeScript backend the team already committed to, and Plaid's
Flutter support is community-maintained rather than official, a real risk
for a project that touches real financial-account linking. Full native
gives the best performance and polish but doubles the actual engineering
work across two codebases, which doesn't fit a single-semester proof of
concept. **React Native + Expo is the right call for this team, not just the
first option we wrote down.**

### Navigation: Expo Router vs. React Navigation

App 1 uses **React Navigation** directly (`createBottomTabNavigator` in
`App.tsx`) rather than Expo Router, deliberately: Expo Router is built on top
of React Navigation, so learning React Navigation's primitives (stacks, tab
navigators, the `useNavigation` hook) first is the more useful starting point
for understanding how navigation actually works underneath, rather than
starting from file-based routing's conventions.

For the actual team app, though, **Expo Router is the better choice**: it
gives deep-linking out of the box, which XCard needs for several Required
features. The emailed verification link (1.2), the emailed password-reset
link (1.3), and Plaid Link's OAuth redirect back into the app (5.1, 9.2) all
need the app to correctly handle an external link opening a specific screen.
React Navigation can do this too, but it requires manually configuring a
linking config object; Expo Router handles it by file convention with less
room for a misconfigured route to drop a user on the wrong screen after they
tap a sensitive link like a password reset.

## Firsthand comparison: building the same feature twice

After actually building the identical recommendation flow in both stacks,
not just reading about them:

- **State management felt nearly identical.** SwiftUI's `@State` and React's
  `useState` solve the same problem the same way: a value change triggers a
  re-render of whatever reads it. Someone who learns one picks up the other's
  state model almost immediately.
- **Styling was the biggest day-to-day difference.** React Native's
  `StyleSheet.create` is a separate JS object referenced by `style={...}`;
  SwiftUI styles inline as chained view modifiers (`.padding()`, `.background()`,
  `.cornerRadius()`). SwiftUI's version reads faster once you're used to it,
  but React Native's separation keeps large screens easier to scan.
- **Swift's compiler caught more at build time.** App 2 wouldn't compile
  until every `SpendCategory` case was handled and every optional was
  unwrapped. TypeScript is also strongly typed, but a few UI states (like a
  disabled-button condition) were things I had to remember to check manually
  rather than the compiler forcing it.
- **Build/iterate loop:** `swift build` for App 2 was about 6 seconds cold;
  Metro's first bundle for App 1 was similar, but Expo's actual payoff is
  Fast Refresh updating a running app/phone instantly on save, with no
  restart. For a UI-heavy app built by a team iterating constantly on
  screens, that matters more than either cold-build number.
- **Packaging reality check, the single biggest gap.** App 1 genuinely runs
  on a phone (Expo Go) and the web from one codebase, today. Getting App 2
  onto the iOS Simulator at all required installing full Xcode, then
  manually constructing an `.app` bundle (Info.plist, code signing) around
  the Swift Package's build output, since `swift build` alone only produces
  a bare executable. Getting it onto Android would mean a complete rewrite
  in Kotlin; there's no shared-codebase story the way Expo gives you for
  free. That packaging gap, not any shortcoming in Swift as a language, is
  the real reason the team isn't using this stack.

None of this changes the recommendation above: React Native + Expo is still
the right call for the team project, but it's now based on having written
the same logic twice, not just a comparison table.
