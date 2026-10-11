import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../ThemeContext";
import { CARDS, SPEND_BY_CATEGORY, RECENT_ACTIVITY, INSIGHT_TIP } from "../data";
import { spacing } from "../theme";
import DonutChart from "../components/DonutChart";

export default function InsightsScreen() {
  const { colors } = useTheme();
  const maxEarned = Math.max(...CARDS.map((c) => c.earnedThisMonth));

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Insights</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Where it went</Text>
            <Text style={[styles.cardEyebrow, { color: colors.textMuted }]}>TOTAL SPEND</Text>
          </View>
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
            Every dollar spent this month, by category
          </Text>
          <View style={{ marginTop: spacing.md }}>
            <DonutChart data={SPEND_BY_CATEGORY} />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: spacing.md }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Best-performing cards</Text>
            <Text style={[styles.cardEyebrow, { color: colors.textMuted }]}>EARNED THIS MONTH</Text>
          </View>
          {CARDS.slice()
            .sort((a, b) => b.earnedThisMonth - a.earnedThisMonth)
            .map((card) => (
              <View key={card.id} style={styles.rankRow}>
                <Text style={[styles.rankName, { color: colors.textSecondary }]} numberOfLines={1}>
                  {card.name}
                </Text>
                <View style={[styles.rankTrack, { backgroundColor: colors.surfaceAlt }]}>
                  <View
                    style={[
                      styles.rankFill,
                      {
                        width: `${(card.earnedThisMonth / maxEarned) * 100}%`,
                        backgroundColor: colors.bronzeStrong,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.rankAmount, { color: colors.textSecondary }]}>${card.earnedThisMonth}</Text>
              </View>
            ))}
        </View>

        <View style={[styles.tip, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderStrong }]}>
          <Text style={{ color: colors.textSecondary, lineHeight: 19 }}>
            <Text style={{ color: colors.bronze, fontWeight: "700" }}>
              {INSIGHT_TIP.split(".")[0]}.{" "}
            </Text>
            {INSIGHT_TIP.split(".").slice(1).join(".").trim()}
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Recent activity</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {RECENT_ACTIVITY.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.activityRow,
                i < RECENT_ACTIVITY.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={[styles.activityDot, { backgroundColor: item.wasBestCard ? colors.good : colors.critical }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.activityName, { color: colors.textPrimary }]}>{item.merchant}</Text>
                <Text style={[styles.activityMeta, { color: colors.textMuted }]}>
                  {item.category} · {item.cardName}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.activityAmount, { color: colors.textPrimary }]}>-${item.amount.toFixed(2)}</Text>
                <Text style={{ fontSize: 10.5, color: item.wasBestCard ? colors.good : colors.critical, marginTop: 2 }}>
                  {item.wasBestCard ? "Best card" : item.missedNote}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  heading: { fontSize: 26, fontWeight: "600", marginBottom: spacing.md },
  card: { borderWidth: 1, borderRadius: 16, padding: spacing.md },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardEyebrow: { fontSize: 10, letterSpacing: 1 },
  cardSub: { fontSize: 12.5, marginTop: 2 },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: spacing.sm },
  rankName: { width: 96, fontSize: 12 },
  rankTrack: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  rankFill: { height: "100%", borderRadius: 4 },
  rankAmount: { width: 40, textAlign: "right", fontSize: 12 },
  tip: { borderWidth: 1, borderRadius: 14, padding: spacing.md, marginTop: spacing.md },
  sectionLabel: { fontSize: 16, fontWeight: "700", marginTop: spacing.lg, marginBottom: spacing.sm },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 11 },
  activityDot: { width: 10, height: 10, borderRadius: 3 },
  activityName: { fontSize: 13.5, fontWeight: "500" },
  activityMeta: { fontSize: 11.5, marginTop: 1 },
  activityAmount: { fontSize: 13.5, fontFamily: "Courier" },
});
