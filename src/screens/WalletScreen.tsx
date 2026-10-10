import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CARDS, Card } from "../data";
import { colors, spacing } from "../theme";

function CardTile({ card }: { card: Card }) {
  const badge =
    card.rules.length > 0
      ? `${(card.rules[0].rate * 100).toFixed(0)}% · ${card.rules[0].category}`
      : `${(card.baseRate * 100).toFixed(0)}% · Everywhere`;

  return (
    <View style={[styles.card, { borderLeftColor: card.accent }]}>
      <View style={styles.cardTop}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardNumber}>•••• {card.lastFour}</Text>
      </View>
      <Text style={[styles.cardBadge, { color: card.accent }]}>{badge}</Text>
    </View>
  );
}

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Text style={styles.heading}>Wallet</Text>
      <Text style={styles.subheading}>Your saved cards</Text>
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
  screen: { flex: 1, backgroundColor: colors.background },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  subheading: {
    fontSize: 13,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  cardName: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  cardNumber: { color: colors.textSecondary, fontSize: 13 },
  cardBadge: { fontSize: 12, fontWeight: "600" },
});
