import SwiftUI

private struct DonutSlice: Shape {
    let startFraction: Double
    let endFraction: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2
        let startAngle = Angle(degrees: -90 + 360 * startFraction)
        let endAngle = Angle(degrees: -90 + 360 * endFraction)
        path.addArc(center: center, radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: false)
        return path
    }
}

struct InsightsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    var palette: ThemePalette { themeManager.palette }

    var totalSpend: Double {
        SampleData.spendByCategory.reduce(0) { $0 + $1.amount }
    }

    var maxEarned: Double {
        SampleData.cards.map(\.earnedThisMonth).max() ?? 1
    }

    var donutArcs: [(category: String, start: Double, end: Double)] {
        var acc = 0.0
        return SampleData.spendByCategory.map { slice in
            let start = acc
            acc += slice.amount / totalSpend
            return (slice.category, start, acc)
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Insights")
                    .font(.system(size: 26, weight: .semibold, design: .monospaced))
                    .foregroundColor(palette.textPrimary)

                // Where it went
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text("Where it went").font(.headline).foregroundColor(palette.textPrimary)
                        Spacer()
                        Text("TOTAL SPEND").font(.caption2).foregroundColor(palette.textMuted)
                    }
                    Text("Every dollar spent this month, by category")
                        .font(.caption)
                        .foregroundColor(palette.textSecondary)

                    HStack(spacing: 18) {
                        ZStack {
                            ForEach(donutArcs, id: \.category) { arc in
                                DonutSlice(startFraction: arc.start, endFraction: arc.end)
                                    .stroke(
                                        palette.categoryColors[arc.category] ?? palette.textMuted,
                                        style: StrokeStyle(lineWidth: 22, lineCap: .butt)
                                    )
                            }
                            VStack(spacing: 2) {
                                Text("$\(Int(totalSpend))")
                                    .font(.system(size: 17, weight: .bold))
                                    .foregroundColor(palette.textPrimary)
                                Text("SPENT")
                                    .font(.system(size: 9))
                                    .foregroundColor(palette.textMuted)
                            }
                        }
                        .frame(width: 140, height: 140)

                        VStack(alignment: .leading, spacing: 7) {
                            ForEach(SampleData.spendByCategory) { slice in
                                HStack(spacing: 8) {
                                    Circle()
                                        .fill(palette.categoryColors[slice.category] ?? palette.textMuted)
                                        .frame(width: 9, height: 9)
                                    Text(slice.category)
                                        .font(.caption)
                                        .foregroundColor(palette.textSecondary)
                                    Spacer()
                                    Text("\(Int((slice.amount / totalSpend) * 100))%")
                                        .font(.caption)
                                        .fontWeight(.semibold)
                                        .foregroundColor(palette.textPrimary)
                                }
                            }
                        }
                    }
                    .padding(.top, 8)
                }
                .padding()
                .background(palette.surface)
                .cornerRadius(16)
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(palette.border))

                // Best-performing cards
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Text("Best-performing cards").font(.headline).foregroundColor(palette.textPrimary)
                        Spacer()
                        Text("EARNED THIS MONTH").font(.caption2).foregroundColor(palette.textMuted)
                    }
                    ForEach(SampleData.cards.sorted(by: { $0.earnedThisMonth > $1.earnedThisMonth })) { card in
                        HStack(spacing: 10) {
                            Text(card.name)
                                .font(.caption)
                                .foregroundColor(palette.textSecondary)
                                .frame(width: 96, alignment: .leading)
                                .lineLimit(1)
                            GeometryReader { geo in
                                ZStack(alignment: .leading) {
                                    Capsule().fill(palette.surfaceAlt)
                                    Capsule()
                                        .fill(palette.bronzeStrong)
                                        .frame(width: geo.size.width * (card.earnedThisMonth / maxEarned))
                                }
                            }
                            .frame(height: 8)
                            Text("$\(Int(card.earnedThisMonth))")
                                .font(.caption)
                                .foregroundColor(palette.textSecondary)
                                .frame(width: 36, alignment: .trailing)
                        }
                    }
                }
                .padding()
                .background(palette.surface)
                .cornerRadius(16)
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(palette.border))

                // Tip callout
                (Text(SampleData.insightTipHighlight + " ").foregroundColor(palette.bronze).fontWeight(.bold)
                    + Text(SampleData.insightTipRest).foregroundColor(palette.textSecondary))
                    .font(.footnote)
                    .padding()
                    .background(palette.surfaceAlt)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(palette.borderStrong))

                // Recent activity
                Text("Recent activity").font(.headline).foregroundColor(palette.textPrimary).padding(.top, 8)
                VStack(spacing: 0) {
                    ForEach(Array(SampleData.recentActivity.enumerated()), id: \.element.id) { index, item in
                        HStack(spacing: 12) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(item.wasBestCard ? palette.good : palette.critical)
                                .frame(width: 10, height: 10)
                            VStack(alignment: .leading, spacing: 1) {
                                Text(item.merchant).font(.system(size: 13.5, weight: .medium)).foregroundColor(palette.textPrimary)
                                Text("\(item.category.rawValue) \u{00b7} \(item.cardName)")
                                    .font(.system(size: 11.5))
                                    .foregroundColor(palette.textMuted)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 2) {
                                Text("-$\(String(format: "%.2f", item.amount))")
                                    .font(.system(size: 13.5, design: .monospaced))
                                    .foregroundColor(palette.textPrimary)
                                Text(item.wasBestCard ? "Best card" : (item.missedNote ?? ""))
                                    .font(.system(size: 10.5))
                                    .foregroundColor(item.wasBestCard ? palette.good : palette.critical)
                            }
                        }
                        .padding(.vertical, 11)
                        if index < SampleData.recentActivity.count - 1 {
                            Divider().background(palette.border)
                        }
                    }
                }
                .padding()
                .background(palette.surface)
                .cornerRadius(16)
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(palette.border))
            }
            .padding(20)
        }
        .background(palette.background.ignoresSafeArea())
    }
}
