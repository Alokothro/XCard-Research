import { Card, Category } from "./data";

export type Recommendation = {
  card: Card;
  rate: number;
  estimatedReward: number;
  reason: string;
};

function rateFor(card: Card, category: Category): number {
  const match = card.rules.find((r) => r.category === category);
  return match ? match.rate : card.baseRate;
}

// Pure, independently-testable recommendation function: given a wallet of
// cards, a spending category, and an amount, find the best eligible card.
// This mirrors XCard's rule-based reward engine (no AI performs this math).
export function recommendCard(
  cards: Card[],
  category: Category,
  amount: number
): Recommendation | null {
  if (cards.length === 0 || amount <= 0) return null;

  let best: Recommendation | null = null;
  for (const card of cards) {
    const rate = rateFor(card, category);
    const estimatedReward = Math.round(amount * rate * 100) / 100;
    const hasDirectRule = card.rules.some((r) => r.category === category);
    const reason = hasDirectRule
      ? `${card.name} earns ${(rate * 100).toFixed(0)}% on ${category.toLowerCase()}, its best matching rate.`
      : `${card.name} has no ${category.toLowerCase()} bonus, so it falls back to its ${(rate * 100).toFixed(0)}% base rate.`;

    if (!best || estimatedReward > best.estimatedReward) {
      best = { card, rate, estimatedReward, reason };
    }
  }
  return best;
}
