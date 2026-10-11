import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// The publishable key is safe to ship in client code by design — it is
// protected by the Row Level Security policies defined on each table, not
// by being kept secret. See the SQL schema in README.md for the actual
// policies (public read-only access on `cards` and `reward_rules` for this
// prototype, since there is no auth system here).
const SUPABASE_URL = "https://sjrrtdziegiiiqoumhoj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_TTIhxxY22wJ7fIkAjwBslA_nUKXWJ_R";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
