import XCTest
@testable import XCardCore

final class RecommendationEngineTests: XCTestCase {
    let amberDining = Card(
        name: "Amber Dining+", lastFour: "4821",
        rules: [RewardRule(category: .dining, rate: 0.04)], baseRate: 0.01,
        earnedThisMonth: 0
    )
    let horizonTravel = Card(
        name: "Horizon Travel", lastFour: "1190",
        rules: [RewardRule(category: .travel, rate: 0.03)], baseRate: 0.01,
        earnedThisMonth: 0
    )
    let flatBlue = Card(
        name: "Flat Blue", lastFour: "5502",
        rules: [], baseRate: 0.02,
        earnedThisMonth: 0
    )

    var wallet: [Card] { [amberDining, horizonTravel, flatBlue] }

    func testPicksHighestRateCardForCategory() {
        let result = RecommendationEngine.recommendCard(from: wallet, category: .dining, amount: 50)
        XCTAssertEqual(result?.card.name, "Amber Dining+")
    }

    func testCalculatesEstimatedRewardAsAmountTimesRate() {
        let result = RecommendationEngine.recommendCard(from: wallet, category: .dining, amount: 50)
        XCTAssertEqual(result?.estimatedReward ?? 0, 2.0, accuracy: 0.001)
    }

    func testFallsBackToBaseRateWhenNoDirectRuleMatches() {
        // No card has a direct Gas rule; Flat Blue's 2% base rate beats
        // Amber/Horizon's 1% base rate.
        let result = RecommendationEngine.recommendCard(from: wallet, category: .gas, amount: 100)
        XCTAssertEqual(result?.card.name, "Flat Blue")
        XCTAssertEqual(result?.estimatedReward ?? 0, 2.0, accuracy: 0.001)
    }

    func testExplainsDirectRuleMatchInReason() {
        let result = RecommendationEngine.recommendCard(from: wallet, category: .travel, amount: 100)
        XCTAssertTrue(result?.reason.contains("Horizon Travel") ?? false)
        XCTAssertTrue(result?.reason.contains("best matching rate") ?? false)
    }

    func testExplainsBaseRateFallbackInReason() {
        let result = RecommendationEngine.recommendCard(from: wallet, category: .gas, amount: 100)
        XCTAssertTrue(result?.reason.contains("no gas bonus") ?? false)
    }

    func testReturnsNilForZeroAmount() {
        XCTAssertNil(RecommendationEngine.recommendCard(from: wallet, category: .dining, amount: 0))
    }

    func testReturnsNilForNegativeAmount() {
        XCTAssertNil(RecommendationEngine.recommendCard(from: wallet, category: .dining, amount: -10))
    }

    func testReturnsNilForEmptyWallet() {
        XCTAssertNil(RecommendationEngine.recommendCard(from: [], category: .dining, amount: 50))
    }

    func testEstimatedRewardScalesLinearlyWithAmount() {
        let small = RecommendationEngine.recommendCard(from: wallet, category: .dining, amount: 10)
        let large = RecommendationEngine.recommendCard(from: wallet, category: .dining, amount: 100)
        XCTAssertEqual(large?.estimatedReward ?? 0, (small?.estimatedReward ?? 0) * 10, accuracy: 0.001)
    }
}
