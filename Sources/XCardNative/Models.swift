import Foundation

enum Category: String, CaseIterable, Identifiable {
    case dining = "Dining"
    case travel = "Travel"
    case groceries = "Groceries"
    case gas = "Gas"
    case other = "Other"

    var id: String { rawValue }
}

struct RewardRule {
    let category: Category
    let rate: Double // e.g. 0.04 = 4%
}

struct Card: Identifiable {
    let id = UUID()
    let name: String
    let lastFour: String
    let rules: [RewardRule]
    let baseRate: Double

    func rate(for category: Category) -> Double {
        rules.first(where: { $0.category == category })?.rate ?? baseRate
    }

    func hasDirectRule(for category: Category) -> Bool {
        rules.contains(where: { $0.category == category })
    }
}

enum SampleData {
    static let cards: [Card] = [
        Card(name: "Amber Dining+", lastFour: "4821",
             rules: [RewardRule(category: .dining, rate: 0.04)], baseRate: 0.01),
        Card(name: "Horizon Travel", lastFour: "1190",
             rules: [RewardRule(category: .travel, rate: 0.03)], baseRate: 0.01),
        Card(name: "EveryDay Cash", lastFour: "7734",
             rules: [RewardRule(category: .groceries, rate: 0.05)], baseRate: 0.01),
        Card(name: "Flat Blue", lastFour: "5502",
             rules: [], baseRate: 0.02),
    ]

    // Minimal keyword -> category lookup, mirroring the merchant-to-category
    // inference in the Expo build's quick-recommendation flow.
    static let merchantHints: [String: Category] = [
        "starbucks": .dining, "olive garden": .dining, "chipotle": .dining,
        "delta": .travel, "marriott": .travel, "uber": .travel,
        "trader joe": .groceries, "kroger": .groceries, "publix": .groceries,
        "shell": .gas, "chevron": .gas, "exxon": .gas,
    ]

    static func inferCategory(from merchant: String) -> Category {
        let key = merchant.trimmingCharacters(in: .whitespaces).lowercased()
        for (hint, category) in merchantHints where key.contains(hint) {
            return category
        }
        return .other
    }
}
