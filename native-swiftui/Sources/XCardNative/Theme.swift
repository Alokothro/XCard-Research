import SwiftUI

// Mirrors src/theme.ts from the Expo app's color tokens.
enum Theme {
    static let background = Color(red: 0.043, green: 0.039, blue: 0.031) // #0B0A08
    static let surface = Color(red: 0.090, green: 0.075, blue: 0.063)    // #171310
    static let surfaceAlt = Color(red: 0.125, green: 0.102, blue: 0.078) // #201A14
    static let border = Color(red: 0.180, green: 0.165, blue: 0.133)     // #2E2A22
    static let textSecondary = Color(red: 0.725, green: 0.690, blue: 0.635) // #B9B0A2
    static let textMuted = Color(red: 0.510, green: 0.471, blue: 0.416)    // #82786A
    static let bronze = Color(red: 0.878, green: 0.702, blue: 0.431)     // #E0B36E
    static let bronzeStrong = Color(red: 0.776, green: 0.569, blue: 0.235) // #C6913C
}
