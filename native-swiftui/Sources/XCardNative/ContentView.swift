import SwiftUI

struct ContentView: View {
    @State private var merchant: String = ""
    @State private var amountText: String = ""
    @State private var category: Category?
    @State private var result: Recommendation?

    let bronze = Color(red: 0.878, green: 0.702, blue: 0.431) // #E0B36E
    let background = Color(red: 0.043, green: 0.039, blue: 0.031) // #0B0A08
    let surface = Color(red: 0.090, green: 0.075, blue: 0.063) // #171310

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Quick Recommendation")
                    .font(.system(size: 24, weight: .semibold, design: .monospaced))
                    .foregroundColor(.white)
                Text("Tell XCard where you're shopping.")
                    .font(.footnote)
                    .foregroundColor(.gray)

                Text("MERCHANT OR PURCHASE")
                    .font(.caption2)
                    .foregroundColor(.gray)
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
                        Text("AUTO-CATEGORIZED").font(.caption2).foregroundColor(.gray)
                        Text("\(merchant.isEmpty ? "This purchase" : merchant) → \(category.rawValue)")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Not right? Pick a different category below.")
                            .font(.caption)
                            .foregroundColor(.gray)

                        HStack {
                            ForEach(Category.allCases) { c in
                                Button(c.rawValue) {
                                    self.category = c
                                    result = nil
                                }
                                .font(.caption)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 5)
                                .background(c == category ? bronze : Color.clear)
                                .foregroundColor(c == category ? .black : .gray)
                                .clipShape(Capsule())
                                .overlay(Capsule().stroke(Color.gray.opacity(0.4)))
                            }
                        }
                    }
                    .padding()
                    .background(surface)
                    .cornerRadius(14)
                }

                Text("AMOUNT").font(.caption2).foregroundColor(.gray)
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
                .background(category == nil ? bronze.opacity(0.4) : bronze)
                .foregroundColor(.black)
                .cornerRadius(14)

                if let result {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("BEST MATCH").font(.caption2).foregroundColor(bronze)
                        Text(result.card.name)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                        Text("Estimated reward: $\(String(format: "%.2f", result.estimatedReward))")
                            .foregroundColor(bronze)
                        Text(result.reason)
                            .font(.footnote)
                            .foregroundColor(.gray)
                    }
                    .padding()
                    .background(surface)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(bronze.opacity(0.6)))
                }
            }
            .padding(20)
        }
        .frame(minWidth: 380, minHeight: 560)
        .background(background)
        .preferredColorScheme(.dark)
    }
}
