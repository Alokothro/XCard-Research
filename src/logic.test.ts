import { recommendCard } from "./logic";
import { Card } from "./data";

const amberDining: Card = {
  id: "amber-dining",
  name: "Amber Dining+",
  lastFour: "4821",
  accent: "#E0B36E",
  rules: [{ category: "Dining", rate: 0.04 }],
  baseRate: 0.01,
  earnedThisMonth: 0,
};

const horizonTravel: Card = {
  id: "horizon-travel",
  name: "Horizon Travel",
  lastFour: "1190",
  accent: "#B9B0A2",
  rules: [{ category: "Travel", rate: 0.03 }],
  baseRate: 0.01,
  earnedThisMonth: 0,
};

const flatBlue: Card = {
  id: "flat-blue",
  name: "Flat Blue",
  lastFour: "5502",
  accent: "#82786A",
  rules: [],
  baseRate: 0.02,
  earnedThisMonth: 0,
};

const wallet = [amberDining, horizonTravel, flatBlue];

describe("recommendCard", () => {
  it("picks the card with the highest reward rate for the purchase category", () => {
    const result = recommendCard(wallet, "Dining", 50);
    expect(result?.card.name).toBe("Amber Dining+");
  });

  it("calculates the estimated reward as amount * rate, rounded to cents", () => {
    const result = recommendCard(wallet, "Dining", 50);
    expect(result?.estimatedReward).toBeCloseTo(2.0, 2);
  });

  it("falls back to a card's base rate when no card has a direct rule for the category", () => {
    // Gas has no direct rule on any card in this wallet; Flat Blue's 2% base
    // rate beats Amber/Horizon's 1% base rate.
    const result = recommendCard(wallet, "Gas", 100);
    expect(result?.card.name).toBe("Flat Blue");
    expect(result?.estimatedReward).toBeCloseTo(2.0, 2);
  });

  it("explains a direct-rule match in its reason text", () => {
    const result = recommendCard(wallet, "Travel", 100);
    expect(result?.reason).toContain("Horizon Travel");
    expect(result?.reason).toContain("best matching rate");
  });

  it("explains a base-rate fallback in its reason text", () => {
    const result = recommendCard(wallet, "Gas", 100);
    expect(result?.reason).toContain("no gas bonus");
  });

  it("returns null for a zero amount", () => {
    expect(recommendCard(wallet, "Dining", 0)).toBeNull();
  });

  it("returns null for a negative amount", () => {
    expect(recommendCard(wallet, "Dining", -10)).toBeNull();
  });

  it("returns null for an empty wallet", () => {
    expect(recommendCard([], "Dining", 50)).toBeNull();
  });

  it("scales the estimated reward linearly with the purchase amount", () => {
    const small = recommendCard(wallet, "Dining", 10);
    const large = recommendCard(wallet, "Dining", 100);
    expect(large?.estimatedReward).toBeCloseTo((small?.estimatedReward ?? 0) * 10, 2);
  });
});
