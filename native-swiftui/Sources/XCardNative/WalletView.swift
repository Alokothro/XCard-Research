import SwiftUI

struct WalletView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 10) {
                Text("Wallet")
                    .font(.system(size: 24, weight: .semibold, design: .monospaced))
                    .foregroundColor(.white)
                Text("Your saved cards")
                    .font(.footnote)
                    .foregroundColor(.gray)
                    .padding(.bottom, 8)

                ForEach(SampleData.cards) { card in
                    CardTile(card: card)
                }
            }
            .padding(20)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}

private struct CardTile: View {
    let card: Card

    var badge: String {
        if let first = card.rules.first {
            return "\(Int(first.rate * 100))% \u{00b7} \(first.category.rawValue)"
        }
        return "\(Int(card.baseRate * 100))% \u{00b7} Everywhere"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(card.name).font(.headline).foregroundColor(.white)
                Spacer()
                Text("\u{2022}\u{2022}\u{2022}\u{2022} \(card.lastFour)")
                    .font(.footnote)
                    .foregroundColor(Theme.textSecondary)
            }
            Text(badge)
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundColor(Theme.bronze)
        }
        .padding()
        .background(Theme.surface)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Theme.border, lineWidth: 1)
        )
    }
}
