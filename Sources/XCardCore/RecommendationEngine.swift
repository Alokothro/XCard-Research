import Foundation

public struct Recommendation {
    public let card: Card
    public let rate: Double
    public let estimatedReward: Double
    public let reason: String
}

// Pure, independently-testable recommendation function, mirroring logic.ts
// from the Expo build: no AI involved, just rule-based arithmetic against
// each card's stored reward rules.
public enum RecommendationEngine {
    public static func recommendCard(from cards: [Card], category: SpendCategory, amount: Double) -> Recommendation? {
        guard !cards.isEmpty, amount > 0 else { return nil }

        var best: Recommendation?
        for card in cards {
            let rate = card.rate(for: category)
            let estimatedReward = (amount * rate * 100).rounded() / 100
            let reason: String
            if card.hasDirectRule(for: category) {
                reason = "\(card.name) earns \(Int(rate * 100))% on \(category.rawValue.lowercased()), its best matching rate."
            } else {
                reason = "\(card.name) has no \(category.rawValue.lowercased()) bonus, so it falls back to its \(Int(rate * 100))% base rate."
            }

            if best == nil || estimatedReward > best!.estimatedReward {
                best = Recommendation(card: card, rate: rate, estimatedReward: estimatedReward, reason: reason)
            }
        }
        return best
    }
}
