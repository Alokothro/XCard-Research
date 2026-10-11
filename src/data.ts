export type Category =
  | "Dining"
  | "Travel"
  | "Groceries"
  | "Gas"
  | "Other";

export const CATEGORIES: Category[] = ["Dining", "Travel", "Groceries", "Gas", "Other"];

export type RewardRule = {
  category: Category;
  rate: number; // e.g. 0.04 = 4%
};

export type Card = {
  id: string;
  name: string;
  lastFour: string;
  accent: string;
  rules: RewardRule[];
  baseRate: number; // fallback rate for any category not explicitly listed
  isDefault?: boolean;
  earnedThisMonth: number;
};

export const CARDS: Card[] = [
  {
    id: "amber-dining",
    name: "Amber Dining+",
    lastFour: "4821",
    accent: "#E0B36E",
    rules: [{ category: "Dining", rate: 0.04 }],
    baseRate: 0.01,
    isDefault: true,
    earnedThisMonth: 18,
  },
  {
    id: "horizon-travel",
    name: "Horizon Travel",
    lastFour: "1190",
    accent: "#B9B0A2",
    rules: [{ category: "Travel", rate: 0.03 }],
    baseRate: 0.01,
    earnedThisMonth: 22,
  },
  {
    id: "everyday-cash",
    name: "EveryDay Cash",
    lastFour: "7734",
    accent: "#B9B0A2",
    rules: [{ category: "Groceries", rate: 0.05 }],
    baseRate: 0.01,
    earnedThisMonth: 9,
  },
  {
    id: "flat-blue",
    name: "Flat Blue",
    lastFour: "5502",
    accent: "#82786A",
    rules: [],
    baseRate: 0.02,
    earnedThisMonth: 7,
  },
];

export type SpendSlice = { category: string; amount: number };

export const SPEND_BY_CATEGORY: SpendSlice[] = [
  { category: "Travel", amount: 620 },
  { category: "Dining", amount: 410 },
  { category: "Groceries", amount: 340 },
  { category: "Online Shopping", amount: 180 },
  { category: "Gas", amount: 150 },
  { category: "Drugstores", amount: 95 },
  { category: "Streaming", amount: 60 },
  { category: "Other", amount: 45 },
];

export type ActivityItem = {
  id: string;
  merchant: string;
  category: Category;
  cardName: string;
  amount: number;
  wasBestCard: boolean;
  missedNote?: string;
};

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: "a1", merchant: "Trader Joe's", category: "Groceries", cardName: "EveryDay Cash", amount: 42.1, wasBestCard: true },
  { id: "a2", merchant: "Delta Air Lines", category: "Travel", cardName: "Horizon Travel", amount: 310.0, wasBestCard: true },
  { id: "a3", merchant: "Olive Garden", category: "Dining", cardName: "Flat Blue", amount: 58.2, wasBestCard: false, missedNote: "Missed 2% — try Amber Dining+" },
  { id: "a4", merchant: "Shell", category: "Gas", cardName: "Flat Blue", amount: 34.0, wasBestCard: true },
];

export const INSIGHT_TIP = "Try EveryDay Cash for groceries. You used Flat Blue for 3 grocery runs this month and missed an estimated $9.60 in rotating-category rewards.";

// Minimal keyword -> category lookup, mirroring XCard's "type a merchant,
// get an inferred category" quick-recommendation flow.
const MERCHANT_CATEGORY_HINTS: Record<string, Category> = {
  starbucks: "Dining",
  "olive garden": "Dining",
  chipotle: "Dining",
  delta: "Travel",
  marriott: "Travel",
  uber: "Travel",
  "trader joe": "Groceries",
  kroger: "Groceries",
  publix: "Groceries",
  "whole foods": "Groceries",
  shell: "Gas",
  chevron: "Gas",
  exxon: "Gas",
  "home depot": "Other",
};

export function inferCategory(merchant: string): Category {
  const key = merchant.trim().toLowerCase();
  for (const hint of Object.keys(MERCHANT_CATEGORY_HINTS)) {
    if (key.includes(hint)) return MERCHANT_CATEGORY_HINTS[hint];
  }
  return "Other";
}
