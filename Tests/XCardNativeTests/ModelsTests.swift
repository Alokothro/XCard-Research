import XCTest
@testable import XCardCore

final class ModelsTests: XCTestCase {
    func testCategorizesStarbucksAsDining() {
        XCTAssertEqual(SampleData.inferCategory(from: "Starbucks"), .dining)
    }

    func testCategorizesShellAsGas() {
        XCTAssertEqual(SampleData.inferCategory(from: "Shell"), .gas)
    }

    func testCategorizesTraderJoesAsGroceries() {
        XCTAssertEqual(SampleData.inferCategory(from: "Trader Joe's"), .groceries)
    }

    func testCategorizesWholeFoodsAsGroceries() {
        XCTAssertEqual(SampleData.inferCategory(from: "Whole Foods"), .groceries)
    }

    func testCategorizesDeltaAsTravel() {
        XCTAssertEqual(SampleData.inferCategory(from: "Delta Air Lines"), .travel)
    }

    func testCategorizesHomeDepotAsOther() {
        XCTAssertEqual(SampleData.inferCategory(from: "Home Depot"), .other)
    }

    func testFallsBackToOtherForUnrecognizedMerchant() {
        XCTAssertEqual(SampleData.inferCategory(from: "Some Random Shop"), .other)
    }

    func testIsCaseInsensitive() {
        XCTAssertEqual(SampleData.inferCategory(from: "STARBUCKS"), .dining)
        XCTAssertEqual(SampleData.inferCategory(from: "sTaRbUcKs"), .dining)
    }

    func testMatchesMerchantHintAsSubstring() {
        XCTAssertEqual(SampleData.inferCategory(from: "Starbucks Coffee #4471"), .dining)
    }

    func testTrimsSurroundingWhitespace() {
        XCTAssertEqual(SampleData.inferCategory(from: "   Shell   "), .gas)
    }

    func testReturnsOtherForEmptyString() {
        XCTAssertEqual(SampleData.inferCategory(from: ""), .other)
    }

    func testSampleCardsHaveExactlyOneDefault() {
        let defaults = SampleData.cards.filter(\.isDefault)
        XCTAssertEqual(defaults.count, 1)
    }

    func testSampleCardsHaveNonNegativeBaseRates() {
        for card in SampleData.cards {
            XCTAssertGreaterThanOrEqual(card.baseRate, 0)
        }
    }
}
