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
    var isDefault: Bool = false
    let earnedThisMonth: Double

    func rate(for category: Category) -> Double {
        rules.first(where: { $0.category == category })?.rate ?? baseRate
    }

    func hasDirectRule(for category: Category) -> Bool {
        rules.contains(where: { $0.category == category })
    }
}

struct SpendSlice: Identifiable {
    var id: String { category }
    let category: String
    let amount: Double
}

struct ActivityItem: Identifiable {
    let id = UUID()
    let merchant: String
    let category: Category
    let cardName: String
    let amount: Double
    let wasBestCard: Bool
    let missedNote: String?
}

enum SampleData {
    static let cards: [Card] = [
        Card(name: "Amber Dining+", lastFour: "4821",
             rules: [RewardRule(category: .dining, rate: 0.04)], baseRate: 0.01,
             isDefault: true, earnedThisMonth: 18),
        Card(name: "Horizon Travel", lastFour: "1190",
             rules: [RewardRule(category: .travel, rate: 0.03)], baseRate: 0.01,
             earnedThisMonth: 22),
        Card(name: "EveryDay Cash", lastFour: "7734",
             rules: [RewardRule(category: .groceries, rate: 0.05)], baseRate: 0.01,
             earnedThisMonth: 9),
        Card(name: "Flat Blue", lastFour: "5502",
             rules: [], baseRate: 0.02,
             earnedThisMonth: 7),
    ]

    static let spendByCategory: [SpendSlice] = [
        SpendSlice(category: "Travel", amount: 620),
        SpendSlice(category: "Dining", amount: 410),
        SpendSlice(category: "Groceries", amount: 340),
        SpendSlice(category: "Online Shopping", amount: 180),
        SpendSlice(category: "Gas", amount: 150),
        SpendSlice(category: "Drugstores", amount: 95),
        SpendSlice(category: "Streaming", amount: 60),
        SpendSlice(category: "Other", amount: 45),
    ]

    static let recentActivity: [ActivityItem] = [
        ActivityItem(merchant: "Trader Joe's", category: .groceries, cardName: "EveryDay Cash", amount: 42.10, wasBestCard: true, missedNote: nil),
        ActivityItem(merchant: "Delta Air Lines", category: .travel, cardName: "Horizon Travel", amount: 310.00, wasBestCard: true, missedNote: nil),
        ActivityItem(merchant: "Olive Garden", category: .dining, cardName: "Flat Blue", amount: 58.20, wasBestCard: false, missedNote: "Missed 2% \u{2014} try Amber Dining+"),
        ActivityItem(merchant: "Shell", category: .gas, cardName: "Flat Blue", amount: 34.00, wasBestCard: true, missedNote: nil),
    ]

    static let insightTipHighlight = "Try EveryDay Cash for groceries."
    static let insightTipRest = "You used Flat Blue for 3 grocery runs this month and missed an estimated $9.60 in rotating-category rewards."

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
