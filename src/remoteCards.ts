import { supabase } from "./supabase";
import { Card, Category, RewardRule } from "./data";

type CardRow = {
  id: number;
  name: string;
  last_four: string;
  base_rate: string | number;
  is_default: boolean;
};

type RewardRuleRow = {
  id: number;
  card_id: number;
  category: string;
  rate: string | number;
};

const ACCENTS = ["#E0B36E", "#B9B0A2", "#B9B0A2", "#82786A"];

// Fetches real card + reward-rule rows from the Postgres database hosted on
// Supabase (see README.md for the schema and RLS policies), rather than the
// hardcoded local CARDS array in data.ts. This exercises the actual
// Node/Postgres/Supabase piece of the team's chosen backend stack, not just
// the React Native frontend.
export async function fetchCardsFromSupabase(): Promise<Card[]> {
  const { data: cardRows, error: cardsError } = await supabase
    .from("cards")
    .select("id, name, last_four, base_rate, is_default")
    .order("id");

  if (cardsError) {
    throw new Error(`Failed to load cards: ${cardsError.message}`);
  }

  const { data: ruleRows, error: rulesError } = await supabase
    .from("reward_rules")
    .select("id, card_id, category, rate");

  if (rulesError) {
    throw new Error(`Failed to load reward rules: ${rulesError.message}`);
  }

  return (cardRows as CardRow[]).map((row, index) => {
    const rules: RewardRule[] = (ruleRows as RewardRuleRow[])
      .filter((r) => r.card_id === row.id)
      .map((r) => ({
        category: r.category as Category,
        rate: Number(r.rate),
      }));

    const card: Card = {
      id: String(row.id),
      name: row.name,
      lastFour: row.last_four,
      accent: ACCENTS[index % ACCENTS.length],
      rules,
      baseRate: Number(row.base_rate),
      isDefault: row.is_default,
      earnedThisMonth: 0, // not tracked in the database yet; demo-only field
    };
    return card;
  });
}
