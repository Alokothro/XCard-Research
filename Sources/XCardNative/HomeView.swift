import SwiftUI

struct HomeView: View {
    @EnvironmentObject var themeManager: ThemeManager
    var palette: ThemePalette { themeManager.palette }
    @State private var showRecommend = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Home")
                    .font(.system(size: 26, weight: .semibold, design: .monospaced))
                    .foregroundColor(palette.textPrimary)
                Text("\(SampleData.cards.count) cards saved \u{00b7} native research build")
                    .font(.footnote)
                    .foregroundColor(palette.textMuted)

                Button { showRecommend = true } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Quick card pick").font(.headline).foregroundColor(palette.textPrimary)
                            Text("Type a merchant, get the best card from your wallet")
                                .font(.caption)
                                .foregroundColor(palette.textMuted)
                        }
                        Spacer()
                        Image(systemName: "chevron.right").foregroundColor(palette.textMuted)
                    }
                    .padding()
                    .background(palette.surface)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(palette.border))
                }
                .buttonStyle(.plain)

                Text("WHAT THIS BUILD DEMONSTRATES")
                    .font(.caption2)
                    .tracking(1)
                    .foregroundColor(palette.textMuted)
                    .padding(.top, 8)

                VStack(alignment: .leading, spacing: 6) {
                    Text("\u{2022} Native SwiftUI TabView navigation, light/dark theme")
                    Text("\u{2022} Swift structs/enums as data models (Card, RewardRule)")
                    Text("\u{2022} A real interactive flow: enter a merchant + amount, get a computed best-card recommendation")
                }
                .font(.footnote)
                .foregroundColor(palette.textSecondary)
                .padding()
                .background(palette.surfaceAlt)
                .cornerRadius(14)
            }
            .padding(20)
        }
        .background(palette.background.ignoresSafeArea())
        .sheet(isPresented: $showRecommend) {
            RecommendView().environmentObject(themeManager)
        }
    }
}
