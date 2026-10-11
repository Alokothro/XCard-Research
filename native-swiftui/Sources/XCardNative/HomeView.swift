import SwiftUI

struct HomeView: View {
    let bronze = Theme.bronze
    let surface = Theme.surface
    let surfaceAlt = Theme.surfaceAlt

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Home")
                    .font(.system(size: 26, weight: .semibold, design: .monospaced))
                    .foregroundColor(.white)
                Text("\(SampleData.cards.count) cards saved · native research build")
                    .font(.footnote)
                    .foregroundColor(.gray)

                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Quick card pick").font(.headline).foregroundColor(.white)
                        Text("Type a merchant, get the best card from your wallet")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    Spacer()
                    Image(systemName: "chevron.right").foregroundColor(.gray)
                }
                .padding()
                .background(surface)
                .cornerRadius(14)

                Text("WHAT THIS BUILD DEMONSTRATES")
                    .font(.caption2)
                    .foregroundColor(.gray)
                    .padding(.top, 8)

                VStack(alignment: .leading, spacing: 6) {
                    Text("• Native SwiftUI TabView navigation")
                    Text("• Swift structs/enums as data models (Card, RewardRule)")
                    Text("• A real interactive flow: enter a merchant + amount, get a computed best-card recommendation")
                }
                .font(.footnote)
                .foregroundColor(Theme.textSecondary)
                .padding()
                .background(surfaceAlt)
                .cornerRadius(14)
            }
            .padding(20)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}
