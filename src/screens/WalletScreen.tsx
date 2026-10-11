import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CARDS, Card } from "../data";
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

export default function WalletScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <Text style={[styles.eyebrow, { color: colors.textMuted }]}>YOUR CARDS</Text>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Wallet</Text>
      <FlatList
        data={CARDS}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <CardTile card={item} />}
        contentContainerStyle={{ padding: spacing.md }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  eyebrow: { fontSize: 11, letterSpacing: 1, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  heading: { fontSize: 24, fontWeight: "600", paddingHorizontal: spacing.md, marginBottom: spacing.sm },
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
