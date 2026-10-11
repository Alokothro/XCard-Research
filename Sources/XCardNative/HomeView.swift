import SwiftUI
import XCardCore

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

                VStack(spacing: 8) {
                    Text("YOUR OPTIMIZATION")
                        .font(.caption2)
                        .tracking(1)
                        .foregroundColor(palette.textMuted)
                    ScoreRing(percent: DemoOptimization.percent, palette: palette)
                    Text("$\(DemoOptimization.earned) of $\(DemoOptimization.possible) possible")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(palette.bronze)
                    Text("this month \u{00b7} not wired to real data yet")
                        .font(.caption2)
                        .foregroundColor(palette.textMuted)
                }
                .frame(maxWidth: .infinity)
                .padding(24)
                .background(palette.surface)
                .cornerRadius(20)
                .overlay(RoundedRectangle(cornerRadius: 20).stroke(palette.border))

                VStack(spacing: 8) {
                    Button { showRecommend = true } label: {
                        Text("$")
                            .font(.system(size: 36, weight: .bold))
                            .foregroundColor(Color(hex: "#14100A"))
                            .frame(width: 88, height: 88)
                            .background(palette.bronze)
                            .clipShape(Circle())
                            .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
                    }
                    .buttonStyle(.plain)
                    Text("Find Best Card")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(palette.textPrimary)
                    Text("Type a merchant, get the best card from your wallet")
                        .font(.caption)
                        .foregroundColor(palette.textMuted)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 12)

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
