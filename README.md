# XCard Research — Tech Stack 2: Native Swift + SwiftUI

This branch is **App 2** of my two-stack Research Milestone comparison (CSCE 490/492). The other stack lives on `main` — see [Tech Stack 1: React Native + Expo](../../tree/main).

I explored this stack specifically because I have a Mac and some of my teammates don't, so this is a stack they can't easily try themselves. It's not what the team is using — see the comparison on `main` for why React Native + Expo won out.

## What's here

A real iOS app, not a "Hello World": a tabbed app (Home / Wallet / Recommend) built with native SwiftUI, running on the iOS Simulator. Same feature as App 1, built in Swift instead of TypeScript, so the comparison is based on firsthand experience.

- **`Sources/XCardNative/Models.swift`** — `Card`, `RewardRule`, `Category`, and merchant-to-category inference, as Swift `struct`s and `enum`s.
- **`Sources/XCardNative/RecommendationEngine.swift`** — the same pure, rule-based recommendation function as App 1's `logic.ts`. No AI does this math.
- **`Sources/XCardNative/RootTabView.swift`** — bottom tab bar navigation (Home, Wallet, Recommend), mirroring App 1's React Navigation structure.
- **`Sources/XCardNative/HomeView.swift`**, **`WalletView.swift`**, **`RecommendView.swift`** — the three tabs. Recommend is the interactive flow: type a merchant ("Starbucks"), it auto-categorizes as Dining (correctable), enter an amount, get the best card from the wallet with an estimated dollar reward and a plain-language reason.
- **`Theme.swift`** — the same dark/bronze color tokens as App 1's `theme.ts`.

## Running it

This is a Swift Package, not a full Xcode project — Xcode's GUI "New Project" wizard isn't scriptable, so this takes a couple extra manual steps compared to Xcode's own File → New flow:

```bash
# 1. Build for the iOS Simulator
xcodebuild -scheme XCardNative -destination "platform=iOS Simulator,name=iPhone 16" build

# 2. Find the built product (path printed by the build, under DerivedData/.../Debug-iphonesimulator/)
# 3. Wrap it in a minimal .app bundle (see the Info.plist this repo's history shows), then:
xcrun simctl install booted /path/to/XCardNative.app
xcrun simctl launch booted com.alokothro.xcardresearch.native
```

Easiest in practice: open `Package.swift` directly in Xcode (`open Package.swift`), pick an iPhone simulator as the run destination, and hit Run — Xcode handles the bundle/signing/install/launch automatically.

## What building this taught me

- SwiftUI's `@State` and React's `useState` solve the same problem the same way — whoever learns one picks up the other's state model almost immediately.
- Styling is the biggest day-to-day difference: SwiftUI chains view modifiers inline (`.padding()`, `.background()`, `.cornerRadius()`); React Native keeps a separate `StyleSheet.create` object. SwiftUI reads faster once you're used to it; React Native's separation keeps large screens easier to scan.
- Swift's compiler caught more at build time — it wouldn't compile until every `Category` case was handled and every optional was unwrapped. TypeScript is also strongly typed, but a few UI states (like a disabled-button condition) were things I had to remember to check manually rather than the compiler forcing it.
- The real limitation isn't the language, it's distribution: this app only runs on iOS (Simulator or a real iPhone via Xcode). Getting it onto Android at all would mean a from-scratch rewrite in Kotlin — there's no shared-codebase story the way Expo gives you for free. That's the actual reason the team isn't using this stack, not a knock on Swift itself.

See `main`'s README for the full platform comparison table (React Native vs. Flutter vs. native) and the reasoning behind picking React Native + Expo for the team project.
