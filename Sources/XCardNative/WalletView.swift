import SwiftUI
import XCardCore

// The physical card face always renders dark, like a real wallet app,
// regardless of the app's own light/dark theme.
private let cardFace = Color(hex: "#15110c")
private let cardText = Color(hex: "#F2EDE4")
private let cardNeutral = Color(hex: "#B9B0A2")

struct WalletView: View {
    @EnvironmentObject var themeManager: ThemeManager
    var palette: ThemePalette { themeManager.palette }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 4) {
                Text("YOUR CARDS")
                    .font(.system(size: 11))
                    .tracking(1)
                    .foregroundColor(palette.textMuted)
                Text("Wallet")
                    .font(.system(size: 24, weight: .semibold, design: .monospaced))
                    .foregroundColor(palette.textPrimary)
                    .padding(.bottom, 8)

                ForEach(SampleData.cards) { card in
                    CardTile(card: card, bronze: palette.bronze)
                }
            }
            .padding(20)
        }
        .background(palette.background.ignoresSafeArea())
    }
}

private struct CardTile: View {
    let card: Card
    let bronze: Color
    @State private var enabled = true

    var badge: String {
        if let first = card.rules.first {
            return "\(Int(first.rate * 100))% \u{00b7} \(first.category.rawValue)"
        }
        return "\(Int(card.baseRate * 100))% \u{00b7} Everywhere"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(card.name).font(.system(size: 17, weight: .semibold)).foregroundColor(cardText)
                    if card.isDefault {
                        Text("DEFAULT")
                            .font(.system(size: 9, weight: .bold))
                            .tracking(0.5)
                            .foregroundColor(bronze)
                            .padding(.vertical, 3)
                            .padding(.horizontal, 7)
                            .background(bronze.opacity(0.18))
                            .cornerRadius(5)
                    }
                }
                Spacer()
                Toggle("", isOn: $enabled)
                    .labelsHidden()
                    .tint(bronze)
            }
            Text("\u{2022}\u{2022}\u{2022}\u{2022} \(card.lastFour)")
                .font(.system(size: 15, design: .monospaced))
                .tracking(1.5)
                .foregroundColor(cardNeutral)
            Text(badge)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(bronze)
                .padding(.vertical, 5)
                .padding(.horizontal, 9)
                .background(Color.white.opacity(0.06))
                .cornerRadius(7)
        }
        .padding()
        .frame(minHeight: 140, alignment: .topLeading)
        .background(cardFace)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.white.opacity(0.08), lineWidth: 1)
        )
        .overlay(
            Rectangle()
                .fill(bronze)
                .frame(width: 4)
                .cornerRadius(2)
            , alignment: .leading
        )
        .padding(.bottom, 4)
    }
}
