import SwiftUI

extension Color {
    init(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
        var rgb: UInt64 = 0
        Scanner(string: hexSanitized).scanHexInt64(&rgb)
        self.init(
            red: Double((rgb & 0xFF0000) >> 16) / 255.0,
            green: Double((rgb & 0x00FF00) >> 8) / 255.0,
            blue: Double(rgb & 0x0000FF) / 255.0
        )
    }
}

struct ThemePalette {
    let background: Color
    let surface: Color
    let surfaceAlt: Color
    let border: Color
    let borderStrong: Color
    let textPrimary: Color
    let textSecondary: Color
    let textMuted: Color
    let bronze: Color
    let bronzeStrong: Color
    let good: Color
    let warning: Color
    let critical: Color
    let categoryColors: [String: Color]
}

// Exact tokens from the StoneCap wiki's Color-Scheme.md — both themes.
enum Theme {
    static let light = ThemePalette(
        background: Color(hex: "#F1EEE4"),
        surface: Color(hex: "#FFFFFF"),
        surfaceAlt: Color(hex: "#E7E1D2"),
        border: Color(hex: "#D8D0BC"),
        borderStrong: Color(hex: "#C4B99C"),
        textPrimary: Color(hex: "#0B0A08"),
        textSecondary: Color(hex: "#6B655D"),
        textMuted: Color(hex: "#6B655D"),
        bronze: Color(hex: "#A97B45"),
        bronzeStrong: Color(hex: "#8B5F2E"),
        good: Color(hex: "#256B3E"),
        warning: Color(hex: "#8F5C08"),
        critical: Color(hex: "#B33434"),
        categoryColors: [
            "Travel": Color(hex: "#1B53C4"),
            "Dining": Color(hex: "#DC5F80"),
            "Groceries": Color(hex: "#009333"),
            "Gas": Color(hex: "#6B6000"),
            "Drugstores": Color(hex: "#0091AF"),
            "Streaming": Color(hex: "#9B71F1"),
            "Online Shopping": Color(hex: "#953466"),
            "Other": Color(hex: "#6B655D"),
        ]
    )

    static let dark = ThemePalette(
        background: Color(hex: "#0B0A08"),
        surface: Color(hex: "#171310"),
        surfaceAlt: Color(hex: "#201A14"),
        border: Color(hex: "#2E2A22"),
        borderStrong: Color(hex: "#3D362A"),
        textPrimary: Color(hex: "#F2EDE4"),
        textSecondary: Color(hex: "#B9B0A2"),
        textMuted: Color(hex: "#82786A"),
        bronze: Color(hex: "#E0B36E"),
        bronzeStrong: Color(hex: "#C6913C"),
        good: Color(hex: "#3FB558"),
        warning: Color(hex: "#E0A83E"),
        critical: Color(hex: "#C43B3B"),
        categoryColors: [
            "Travel": Color(hex: "#468BFE"),
            "Dining": Color(hex: "#DC5F80"),
            "Groceries": Color(hex: "#4DA823"),
            "Gas": Color(hex: "#686800"),
            "Drugstores": Color(hex: "#00A8AB"),
            "Streaming": Color(hex: "#6347C4"),
            "Online Shopping": Color(hex: "#974263"),
            "Other": Color(hex: "#B9B0A2"),
        ]
    )
}

final class ThemeManager: ObservableObject {
    @Published var mode: ColorScheme = .dark

    var palette: ThemePalette {
        mode == .light ? Theme.light : Theme.dark
    }
}
