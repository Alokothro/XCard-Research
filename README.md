# XCard Research: Tech Stack 2, Native Swift + SwiftUI

This branch is **App 2** of my two-stack Research Milestone comparison
(CSCE 490/492). The other stack lives on `main`, see
[Tech Stack 1: React Native + Expo](../../tree/main).

I explored this stack specifically because I have a Mac and some of my
teammates don't, so this is a stack they can't easily try themselves. It's
not what the team is using, see the comparison on `main` for why React
Native + Expo won out.

## What's here

A real iOS app, not a "Hello World." Five tabs, mirroring App 1's screens
exactly so the comparison is based on firsthand experience:

- **`Sources/XCardNative/WalletView.swift`**: the card list, same sample
  data as App 1.
- **`Sources/XCardNative/InsightsView.swift`**: a hand-drawn donut chart
  (`Path.addArc`, not Swift Charts) for spend-by-category, best-performing
  cards, and a reward tip.
- **`Sources/XCardNative/HomeView.swift`**: leads with the Optimization
  Score (`ScoreRing.swift`, a `Circle().trim()` progress ring), plus a
  circular "Find Best Card" button that opens Recommend as a sheet.
- **`Sources/XCardNative/ProfileView.swift`**, **`SettingsView.swift`**:
  round out the tab bar. Settings has a working Dark/Light picker bound to
  `ThemeManager`; most of Profile's rows are static for this prototype.
- **`Sources/XCardNative/RecommendView.swift`**: the interactive flow: type
  a merchant ("Starbucks"), it auto-categorizes as Dining (correctable),
  enter an amount, get the best card from the wallet with an estimated
  dollar reward and a plain-language reason. Dismissible with a close button
  (`@Environment(\.dismiss)`).
- **`Sources/XCardNative/RootTabView.swift`**: the 5-tab `TabView`,
  mirroring App 1's React Navigation structure.
- **`Sources/XCardNative/Theme.swift`**: the same dark/bronze color tokens
  as App 1's `theme.ts`, down to the exact hex values.

The actual logic is split into its own library target so it can be unit
tested independently of the UI:

- **`Sources/XCardCore/Models.swift`**: `Card`, `RewardRule`,
  `SpendCategory`, and merchant-to-category inference, as Swift `struct`s
  and `enum`s.
- **`Sources/XCardCore/RecommendationEngine.swift`**: the same pure,
  rule-based recommendation function as App 1's `logic.ts`. No AI does this
  math.
- **`Tests/XCardNativeTests/`**: 22 XCTest cases covering both files,
  mirroring App 1's Jest suite one-for-one. A GitHub Actions workflow runs
  them on every push.

## Running it

This is a Swift Package, not a full Xcode project. Xcode's GUI "New
Project" wizard isn't scriptable, so this takes a couple extra manual steps
compared to Xcode's own File → New flow:

```bash
# 1. Build for the iOS Simulator
xcodebuild -scheme XCardNative -destination "platform=iOS Simulator,name=iPhone 16" build

# 2. Find the built product (path printed by the build, under DerivedData/.../Debug-iphonesimulator/)
# 3. Wrap it in a minimal .app bundle (Info.plist, code signing), then:
xcrun simctl install booted /path/to/XCardNative.app
xcrun simctl launch booted com.alokothro.xcardresearch.native
```

Easiest in practice: open `Package.swift` directly in Xcode
(`open Package.swift`), pick an iPhone simulator as the run destination,
and hit Run. Xcode handles the bundle/signing/install/launch automatically.

To run the tests:

```bash
xcodebuild test -scheme XCardNative -destination "platform=iOS Simulator,id=<simulator UDID>"
```

Plain `swift test` won't work here: it always builds for the host Mac, and
the UI target depends on UIKit APIs that don't exist on macOS. That's the
whole reason the logic lives in a separate `XCardCore` target that the test
target depends on instead of the UI target.

## What building this taught me

- SwiftUI's `@State` and React's `useState` solve the same problem the same
  way, whoever learns one picks up the other's state model almost
  immediately.
- Styling is the biggest day-to-day difference: SwiftUI chains view
  modifiers inline (`.padding()`, `.background()`, `.cornerRadius()`); React
  Native keeps a separate `StyleSheet.create` object. SwiftUI reads faster
  once you're used to it; React Native's separation keeps large screens
  easier to scan.
- Swift's compiler caught more at build time. It wouldn't compile until
  every `SpendCategory` case was handled and every optional was unwrapped.
  TypeScript is also strongly typed, but a few UI states (like a
  disabled-button condition) were things I had to remember to check
  manually rather than the compiler forcing it.
- The real limitation isn't the language, it's distribution: this app only
  runs on iOS (Simulator or a real iPhone via Xcode). Getting it onto
  Android at all would mean a from-scratch rewrite in Kotlin, there's no
  shared-codebase story the way Expo gives you for free. That's the actual
  reason the team isn't using this stack, not a knock on Swift itself.

See `main`'s README for the full platform comparison table (React Native
vs. Flutter vs. native) and the reasoning behind picking React Native +
Expo for the team project.
