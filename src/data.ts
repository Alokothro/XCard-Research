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
};

export const CARDS: Card[] = [
  {
    id: "amber-dining",
    name: "Amber Dining+",
    lastFour: "4821",
    accent: "#E0B36E",
    rules: [{ category: "Dining", rate: 0.04 }],
    baseRate: 0.01,
  },
  {
    id: "horizon-travel",
    name: "Horizon Travel",
    lastFour: "1190",
    accent: "#B9B0A2",
    rules: [{ category: "Travel", rate: 0.03 }],
    baseRate: 0.01,
  },
  {
    id: "everyday-cash",
    name: "EveryDay Cash",
    lastFour: "7734",
    accent: "#B9B0A2",
    rules: [{ category: "Groceries", rate: 0.05 }],
    baseRate: 0.01,
  },
  {
    id: "flat-blue",
    name: "Flat Blue",
    lastFour: "5502",
    accent: "#82786A",
    rules: [],
    baseRate: 0.02,
  },
];

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
  shell: "Gas",
  chevron: "Gas",
  exxon: "Gas",
};

export function inferCategory(merchant: string): Category {
  const key = merchant.trim().toLowerCase();
  for (const hint of Object.keys(MERCHANT_CATEGORY_HINTS)) {
    if (key.includes(hint)) return MERCHANT_CATEGORY_HINTS[hint];
  }
  return "Other";
}
