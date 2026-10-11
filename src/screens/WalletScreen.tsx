import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Switch, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CARDS, Card } from "../data";
import { fetchCardsFromSupabase } from "../remoteCards";
import { spacing } from "../theme";
import { useTheme } from "../ThemeContext";

// The physical card face always renders dark, like a real wallet app,
// regardless of the app's own light/dark theme.
const CARD_FACE = "#15110c";
const CARD_TEXT = "#F2EDE4";
const CARD_NEUTRAL = "#B9B0A2";

function CardTile({ card }: { card: Card }) {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(true);
  const badge =
    card.rules.length > 0
      ? `${(card.rules[0].rate * 100).toFixed(0)}% · ${card.rules[0].category}`
      : `${(card.baseRate * 100).toFixed(0)}% · Everywhere`;

  return (
    <View style={[styles.card, { backgroundColor: CARD_FACE, borderLeftColor: card.accent }]}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.cardName}>{card.name}</Text>
          {card.isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: "rgba(224,179,110,0.18)" }]}>
              <Text style={[styles.defaultBadgeText, { color: colors.bronze }]}>DEFAULT</Text>
            </View>
          )}
        </View>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: "#3D362A", true: colors.bronze }}
          thumbColor="#F2EDE4"
        />
      </View>
      <Text style={styles.cardNumber}>{"••••"} {card.lastFour}</Text>
      <View style={[styles.cardBadge, { borderColor: "rgba(255,255,255,0.12)" }]}>
        <Text style={[styles.cardBadgeText, { color: card.accent }]}>{badge}</Text>
      </View>
    </View>
  );
}

type LoadState = "loading" | "live" | "offline";

export default function WalletScreen() {
  const { colors } = useTheme();
  const [cards, setCards] = useState<Card[]>(CARDS);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    fetchCardsFromSupabase()
      .then((remote) => {
        if (cancelled) return;
        // A fresh project with RLS enabled but no rows yet would also
        // resolve successfully with an empty array; treat that the same as
        // a failure so the user always sees real card data, not a blank list.
        if (remote.length === 0) throw new Error("No cards returned");
        setCards(remote);
        setState("live");
      })
      .catch(() => {
        if (cancelled) return;
        // Required 11.5 (Failure Safety): a failed request must never leave
        // the user with a blank or broken screen, so we fall back to the
        // bundled sample data instead of surfacing an error state here.
        setCards(CARDS);
        setState("offline");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <Text style={[styles.eyebrow, { color: colors.textMuted }]}>YOUR CARDS</Text>
      <View style={styles.headingRow}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Wallet</Text>
        <StatusPill state={state} />
      </View>
      <FlatList
        data={cards}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CardTile card={item} />}
        contentContainerStyle={{ padding: spacing.md }}
      />
    </SafeAreaView>
  );
}

function StatusPill({ state }: { state: LoadState }) {
  const { colors } = useTheme();
  if (state === "loading") {
    return <ActivityIndicator size="small" color={colors.textMuted} style={{ marginRight: spacing.md }} />;
  }
  const label = state === "live" ? "LIVE · SUPABASE" : "OFFLINE · SAMPLE DATA";
  const color = state === "live" ? colors.good : colors.warning;
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  eyebrow: { fontSize: 11, letterSpacing: 1, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  heading: { fontSize: 24, fontWeight: "600" },
  pill: { borderWidth: 1, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
  pillText: { fontSize: 9.5, fontWeight: "700", letterSpacing: 0.5 },
  card: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderLeftWidth: 4,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 150,
    justifyContent: "space-between",
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardName: { color: CARD_TEXT, fontSize: 17, fontWeight: "600" },
  defaultBadge: { alignSelf: "flex-start", borderRadius: 5, paddingVertical: 3, paddingHorizontal: 7, marginTop: 4 },
  defaultBadgeText: { fontSize: 9, letterSpacing: 0.5, fontWeight: "700" },
  cardNumber: { color: CARD_NEUTRAL, fontSize: 15, letterSpacing: 1.5, marginTop: spacing.md },
  cardBadge: { alignSelf: "flex-start", borderWidth: 1, borderRadius: 7, paddingVertical: 5, paddingHorizontal: 9 },
  cardBadgeText: { fontSize: 11, fontWeight: "600" },
});
