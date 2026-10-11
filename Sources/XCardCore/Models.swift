import Foundation

public enum SpendCategory: String, CaseIterable, Identifiable {
    case dining = "Dining"
    case travel = "Travel"
    case groceries = "Groceries"
    case gas = "Gas"
    case other = "Other"

    public var id: String { rawValue }
}

public struct RewardRule {
    public let category: SpendCategory
    public let rate: Double // e.g. 0.04 = 4%

    public init(category: SpendCategory, rate: Double) {
        self.category = category
        self.rate = rate
    }
}

public struct Card: Identifiable {
    public let id = UUID()
    public let name: String
    public let lastFour: String
    public let rules: [RewardRule]
    public let baseRate: Double
    public var isDefault: Bool = false
    public let earnedThisMonth: Double

    public init(name: String, lastFour: String, rules: [RewardRule], baseRate: Double, isDefault: Bool = false, earnedThisMonth: Double) {
        self.name = name
        self.lastFour = lastFour
        self.rules = rules
        self.baseRate = baseRate
        self.isDefault = isDefault
        self.earnedThisMonth = earnedThisMonth
    }

    public func rate(for category: SpendCategory) -> Double {
        rules.first(where: { $0.category == category })?.rate ?? baseRate
    }

    public func hasDirectRule(for category: SpendCategory) -> Bool {
        rules.contains(where: { $0.category == category })
    }
}

public struct SpendSlice: Identifiable {
    public var id: String { category }
    public let category: String
    public let amount: Double

    public init(category: String, amount: Double) {
        self.category = category
        self.amount = amount
    }
}

public struct ActivityItem: Identifiable {
    public let id = UUID()
    public let merchant: String
    public let category: SpendCategory
    public let cardName: String
    public let amount: Double
    public let wasBestCard: Bool
    public let missedNote: String?

    public init(merchant: String, category: SpendCategory, cardName: String, amount: Double, wasBestCard: Bool, missedNote: String?) {
        self.merchant = merchant
        self.category = category
        self.cardName = cardName
        self.amount = amount
        self.wasBestCard = wasBestCard
        self.missedNote = missedNote
    }
}

public enum SampleData {
    public static let cards: [Card] = [
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

    public static let spendByCategory: [SpendSlice] = [
        SpendSlice(category: "Travel", amount: 620),
        SpendSlice(category: "Dining", amount: 410),
        SpendSlice(category: "Groceries", amount: 340),
        SpendSlice(category: "Online Shopping", amount: 180),
        SpendSlice(category: "Gas", amount: 150),
        SpendSlice(category: "Drugstores", amount: 95),
        SpendSlice(category: "Streaming", amount: 60),
        SpendSlice(category: "Other", amount: 45),
    ]

    public static let recentActivity: [ActivityItem] = [
        ActivityItem(merchant: "Trader Joe's", category: .groceries, cardName: "EveryDay Cash", amount: 42.10, wasBestCard: true, missedNote: nil),
        ActivityItem(merchant: "Delta Air Lines", category: .travel, cardName: "Horizon Travel", amount: 310.00, wasBestCard: true, missedNote: nil),
        ActivityItem(merchant: "Olive Garden", category: .dining, cardName: "Flat Blue", amount: 58.20, wasBestCard: false, missedNote: "Missed 2% \u{2014} try Amber Dining+"),
        ActivityItem(merchant: "Shell", category: .gas, cardName: "Flat Blue", amount: 34.00, wasBestCard: true, missedNote: nil),
    ]

    public static let insightTipHighlight = "Try EveryDay Cash for groceries."
    public static let insightTipRest = "You used Flat Blue for 3 grocery runs this month and missed an estimated $9.60 in rotating-category rewards."

    // Minimal keyword -> category lookup, mirroring the merchant-to-category
    // inference in the Expo build's quick-recommendation flow.
    public static let merchantHints: [String: SpendCategory] = [
        "starbucks": .dining, "olive garden": .dining, "chipotle": .dining,
        "delta": .travel, "marriott": .travel, "uber": .travel,
        "trader joe": .groceries, "kroger": .groceries, "publix": .groceries, "whole foods": .groceries,
        "shell": .gas, "chevron": .gas, "exxon": .gas,
        "home depot": .other,
    ]

    public static func inferCategory(from merchant: String) -> SpendCategory {
        let key = merchant.trimmingCharacters(in: .whitespaces).lowercased()
        for (hint, category) in merchantHints where key.contains(hint) {
            return category
        }
        return .other
    }
}
