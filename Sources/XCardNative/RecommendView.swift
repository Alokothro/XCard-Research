import SwiftUI
import XCardCore

struct RecommendView: View {
    @EnvironmentObject var themeManager: ThemeManager
    var palette: ThemePalette { themeManager.palette }
    @Environment(\.dismiss) private var dismiss

    @State private var merchant: String = ""
    @State private var amountText: String = ""
    @State private var category: SpendCategory?
    @State private var result: Recommendation?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(palette.textSecondary)
                        .frame(width: 32, height: 32)
                        .background(palette.surfaceAlt)
                        .clipShape(Circle())
                }
                .buttonStyle(.plain)

                Text("Quick Recommendation")
                    .font(.system(size: 24, weight: .semibold, design: .monospaced))
                    .foregroundColor(palette.textPrimary)
                Text("Tell XCard where you're shopping.")
                    .font(.footnote)
                    .foregroundColor(palette.textMuted)

                Text("MERCHANT OR PURCHASE")
                    .font(.caption2)
                    .foregroundColor(palette.textMuted)
                TextField("Starbucks", text: $merchant)
                    .textFieldStyle(.roundedBorder)
                    .onChange(of: merchant) { _, newValue in
                        result = nil
                        category = newValue.trimmingCharacters(in: .whitespaces).isEmpty
                            ? nil
                            : SampleData.inferCategory(from: newValue)
                    }

                if let category {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("AUTO-CATEGORIZED").font(.caption2).foregroundColor(palette.textMuted)
                        Text("\(merchant.isEmpty ? "This purchase" : merchant) \u{2192} \(category.rawValue)")
                            .font(.headline)
                            .foregroundColor(palette.textPrimary)
                        Text("Not right? Pick a different category below.")
                            .font(.caption)
                            .foregroundColor(palette.textSecondary)

                        HStack {
                            ForEach(SpendCategory.allCases) { c in
                                let active = c == category
                                Button(c.rawValue) {
                                    self.category = c
                                    result = nil
                                }
                                .font(.caption)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 5)
                                .background(active ? palette.bronze : Color.clear)
                                .foregroundColor(active ? Color(hex: "#14100A") : palette.textMuted)
                                .clipShape(Capsule())
                                .overlay(Capsule().stroke(palette.border))
                            }
                        }
                    }
                    .padding()
                    .background(palette.surfaceAlt)
                    .cornerRadius(14)
                }

                Text("AMOUNT").font(.caption2).foregroundColor(palette.textMuted)
                TextField("25.00", text: $amountText)
                    .textFieldStyle(.roundedBorder)
                    .onChange(of: amountText) { _, _ in result = nil }

                Button("Find best card") {
                    guard let category, let amount = Double(amountText), amount > 0 else { return }
                    result = RecommendationEngine.recommendCard(from: SampleData.cards, category: category, amount: amount)
                }
                .disabled(category == nil)
                .frame(maxWidth: .infinity)
                .padding()
                .background(category == nil ? palette.bronze.opacity(0.4) : palette.bronze)
                .foregroundColor(Color(hex: "#14100A"))
                .cornerRadius(14)

                if let result {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("BEST MATCH").font(.caption2).foregroundColor(palette.bronze)
                        Text(result.card.name)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(palette.textPrimary)
                        Text("Estimated reward: $\(String(format: "%.2f", result.estimatedReward))")
                            .foregroundColor(palette.bronze)
                        Text(result.reason)
                            .font(.footnote)
                            .foregroundColor(palette.textSecondary)
                    }
                    .padding()
                    .background(palette.surface)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(palette.bronze.opacity(0.6)))
                }
            }
            .padding(20)
        }
        .background(palette.background.ignoresSafeArea())
    }
}
