# XCard Research

Individual Research Milestone sample app (CSCE 490/492). Two implementations
of the same minimal feature — merchant input → inferred category → best-card
recommendation — built in two different stacks, so the comparison is based on
firsthand experience rather than just reading documentation.

1. **`/` (root)** — React Native + Expo + TypeScript, the stack chosen for the StoneCap/XCard team project.
2. **`native-swiftui/`** — native Swift + SwiftUI, explored because I have a Mac and teammates without one can't easily try this stack themselves.

## What the Expo app demonstrates

- A multi-screen app using **React Navigation** (bottom tabs), not a single "Hello World" view.
- A real data model in TypeScript (`src/data.ts`): cards, reward rules, categories.
- A real interactive flow (`src/screens/RecommendScreen.tsx`): the user types a merchant name, the app infers a spending category, the user can correct it, enters a purchase amount, and the app computes which saved card earns the best reward — showing the recommended card, the estimated dollar reward, and a plain-language reason.
- The recommendation math itself (`src/logic.ts`) is a small, pure, independently testable function, mirroring the rule-based (non-AI) reward calculation the actual XCard app will use.

```bash
npm install
npm run web    # or: npm run ios / npm run android
```

## What the native SwiftUI app demonstrates

Same feature, same sample data, built in Swift instead: `native-swiftui/Sources/XCardNative/`.

- `Models.swift` — the same `Card`/`RewardRule`/`Category` shape as `data.ts`, as Swift `struct`s and `enum`s.
- `RecommendationEngine.swift` — the same pure recommendation function as `logic.ts`.
- `ContentView.swift` — the same merchant-input → auto-category → best-card UI, in SwiftUI.

This runs as a native macOS window via Swift Package Manager (`swift run` from
`native-swiftui/`) rather than in the iOS Simulator — hand-authoring a full
Xcode iOS-simulator project file isn't reliably scriptable outside Xcode's own
GUI project wizard, and macOS SwiftUI shares the same language, declarative
view syntax (`@State`, view modifiers, `Button`/`TextField`/`VStack`), and
general framework concepts as iOS SwiftUI, so it's a fair stand-in for what
native iOS development with this framework actually feels like.

```bash
cd native-swiftui
swift run
```

## Relationship to the team project

This is a personal learning exercise for the Research Milestone, not the team's actual StoneCap/XCard codebase (github.com/SCCapstone/Stonecap). It uses the same tech stack the team selected so the research is directly transferable.

## Technology research

XCard needs: a single app that runs on both iOS and Android, a custom dark/bronze
themed UI with charts (donut, line, bar) rather than default platform widgets,
a CSV file picker, a Plaid-based bank-linking flow, and (per the team's
Requirements doc) accessibility and automated-testing standards. These needs
drove the comparisons below.

### Platform: React Native (Expo) vs. Flutter vs. full native

| | React Native + Expo | Flutter | Native (Swift + Kotlin) |
|---|---|---|---|
| Codebases for iOS + Android | 1 | 1 | 2 |
| Language | TypeScript (same as our Node/Express backend) | Dart (new language, no backend overlap) | Swift + Kotlin (two new languages) |
| Plaid support | Official first-party SDK (`react-native-plaid-link-sdk`) | Community package only | Official native SDKs, but doubles integration work |
| Device testing without a full native toolchain | Yes — Expo Go, no Xcode/Android Studio required per teammate | No — needs Flutter SDK + platform toolchains | No — needs full Xcode and Android Studio |
| Cloud builds without owning a Mac | Yes — EAS Build | Possible via CI, more setup | iOS build requires a Mac |
| Charting | Good (react-native-svg, Victory Native) | Very good (fl_chart), custom rendering engine | Best (SwiftUI Charts / Compose), but per-platform |
| Raw performance | Good, JS bridge/New Architecture overhead | Very good, compiles to native ARM | Best |

**Why this matters for a 5-person student team on one semester:** building and
testing this project on iPhone just in this session required installing a
~10GB Xcode toolchain and still hit a broken Simulator.app on a fresh install.
Expo Go sidesteps that entirely — any teammate can scan a QR code and run the
real app on their own phone with zero native tooling installed, and EAS Build
can produce an installable iOS/Android build without every teammate owning a
Mac. Flutter's rendering engine and chart libraries are genuinely excellent
and would be my second choice, but Dart doesn't share any code or types with
the Node/Express/TypeScript backend the team already committed to, and
Plaid's Flutter support is community-maintained rather than official — a real
risk for a project that touches real financial-account linking. Full native
gives the best performance and polish but doubles the actual engineering
work across two codebases, which doesn't fit a single-semester proof of
concept. **React Native + Expo is the right call for this team, not just the
first option we wrote down.**

### Navigation: Expo Router vs. React Navigation

This research app uses **React Navigation** directly (`createBottomTabNavigator`
in `App.tsx`) rather than Expo Router, deliberately: Expo Router is built on
top of React Navigation, so learning React Navigation's primitives (stacks,
tab navigators, the `useNavigation` hook) first is the more useful starting
point for understanding how navigation actually works underneath, rather than
starting from file-based routing's conventions.

For the actual team app, though, **Expo Router is the better choice**: it
gives deep-linking out of the box, which XCard needs for several Required
features — the emailed verification link (1.2), the emailed password-reset
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
  `useState` solve the same problem the same way — a value change triggers a
  re-render of whatever reads it. Someone who learns one picks up the other's
  state model almost immediately.
- **Styling was the biggest day-to-day difference.** React Native's
  `StyleSheet.create` is a separate JS object referenced by `style={...}`;
  SwiftUI styles inline as chained view modifiers (`.padding()`, `.background()`,
  `.cornerRadius()`). SwiftUI's version reads faster once you're used to it,
  but React Native's separation keeps large screens easier to scan.
- **Swift's compiler caught more at build time.** The Swift version wouldn't
  compile until every `Category` case was handled and every optional was
  unwrapped; the TypeScript version is also strongly typed, but a few UI
  states (like the disabled-button condition) were things I had to remember
  to check manually rather than the compiler forcing it.
- **Build/iterate loop:** `swift build` for this small app was ~6 seconds
  cold; Metro's first bundle for the Expo app was ~5–6 seconds too, but Expo's
  actual payoff is Fast Refresh updating a running app/phone instantly on
  save, no restart. For a UI-heavy app built by a team iterating constantly on
  screens, that matters more than either cold-build number.
- **Packaging reality check:** the Expo app can genuinely run on both a
  phone (Expo Go) and web with one codebase today. The SwiftUI app only runs
  on this Mac — getting it onto an actual iPhone or an Android device at all
  requires either Xcode's full iOS project tooling (iOS only, ever) or a
  complete rewrite in Kotlin for Android. That gap is the real reason the
  team isn't using it, not a knock on Swift as a language.

None of this changes the recommendation above — React Native + Expo is still
the right call for the team project — but it's now based on having written
the same logic twice, not just a comparison table.
