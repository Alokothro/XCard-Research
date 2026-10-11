import { inferCategory, CARDS } from "./data";

describe("inferCategory", () => {
  it("categorizes Starbucks as Dining", () => {
    expect(inferCategory("Starbucks")).toBe("Dining");
  });

  it("categorizes Shell as Gas", () => {
    expect(inferCategory("Shell")).toBe("Gas");
  });

  it("categorizes Trader Joe's as Groceries", () => {
    expect(inferCategory("Trader Joe's")).toBe("Groceries");
  });

  it("categorizes Whole Foods as Groceries", () => {
    expect(inferCategory("Whole Foods")).toBe("Groceries");
  });

  it("categorizes Delta as Travel", () => {
    expect(inferCategory("Delta Air Lines")).toBe("Travel");
  });

  it("categorizes Home Depot as Other", () => {
    expect(inferCategory("Home Depot")).toBe("Other");
  });

  it("falls back to Other for an unrecognized merchant", () => {
    expect(inferCategory("Some Random Shop")).toBe("Other");
  });

  it("is case-insensitive", () => {
    expect(inferCategory("STARBUCKS")).toBe("Dining");
    expect(inferCategory("sTaRbUcKs")).toBe("Dining");
  });

  it("matches a merchant hint as a substring, not just an exact match", () => {
    expect(inferCategory("Starbucks Coffee #4471")).toBe("Dining");
  });

  it("trims surrounding whitespace before matching", () => {
    expect(inferCategory("   Shell   ")).toBe("Gas");
  });

  it("returns Other for an empty string", () => {
    expect(inferCategory("")).toBe("Other");
  });
});

describe("sample card data", () => {
  it("has exactly one default card", () => {
    const defaults = CARDS.filter((c) => c.isDefault);
    expect(defaults).toHaveLength(1);
  });

  it("gives every card a non-negative base rate", () => {
    for (const card of CARDS) {
      expect(card.baseRate).toBeGreaterThanOrEqual(0);
    }
  });
});
