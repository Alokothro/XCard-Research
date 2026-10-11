import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { CARDS, DEMO_OPTIMIZATION } from "../data";
import { spacing } from "../theme";
import { useTheme } from "../ThemeContext";
import ScoreRing from "../components/ScoreRing";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[styles.greeting, { color: colors.textPrimary }]}>Home</Text>
        <Text style={[styles.subheading, { color: colors.textMuted }]}>
          {CARDS.length} cards saved {"·"} research build
        </Text>

        <View style={[styles.scoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.scoreEyebrow, { color: colors.textMuted }]}>YOUR OPTIMIZATION</Text>
          <ScoreRing percent={DEMO_OPTIMIZATION.percent} />
          <Text style={[styles.scoreAmount, { color: colors.bronze }]}>
            ${DEMO_OPTIMIZATION.earned} of ${DEMO_OPTIMIZATION.possible} possible
          </Text>
          <Text style={[styles.scoreSub, { color: colors.textMuted }]}>
            this month {"·"} not wired to real data yet
          </Text>
        </View>

        <View style={styles.circleRow}>
          <Pressable
            style={[styles.circleButton, { backgroundColor: colors.bronze }]}
            // @ts-expect-error - simple tab navigation for this research build
            onPress={() => navigation.navigate("Recommend")}
          >
            <Text style={styles.circleIcon}>$</Text>
          </Pressable>
          <Text style={[styles.circleLabel, { color: colors.textPrimary }]}>Find Best Card</Text>
          <Text style={[styles.circleSub, { color: colors.textMuted }]}>
            Type a merchant, get the best card from your wallet
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>WHAT THIS BUILD DEMONSTRATES</Text>
        <View style={[styles.infoBox, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[styles.infoLine, { color: colors.textSecondary }]}>{"•"} React Navigation bottom tabs, light/dark theme</Text>
          <Text style={[styles.infoLine, { color: colors.textSecondary }]}>{"•"} TypeScript data models (Card, RewardRule)</Text>
          <Text style={[styles.infoLine, { color: colors.textSecondary }]}>
            {"•"} A real interactive flow: enter a merchant + amount, get a
            computed best-card recommendation
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  greeting: { fontSize: 26, fontWeight: "600" },
  subheading: { fontSize: 13, marginBottom: spacing.lg },
  scoreCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: "center",
  },
  scoreEyebrow: { fontSize: 11, letterSpacing: 1, marginBottom: spacing.md },
  scoreAmount: { fontSize: 16, fontWeight: "700", marginTop: spacing.md },
  scoreSub: { fontSize: 12, marginTop: 2 },
  circleRow: { alignItems: "center", marginTop: spacing.xl, marginBottom: spacing.sm },
  circleButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  circleIcon: { fontSize: 36, fontWeight: "700", color: "#14100A" },
  circleLabel: { fontWeight: "700", fontSize: 15, marginTop: spacing.sm },
  circleSub: { fontSize: 12, marginTop: 2, textAlign: "center", maxWidth: 260 },
  sectionLabel: { fontSize: 11, letterSpacing: 1, marginTop: spacing.xl, marginBottom: spacing.sm },
  infoBox: { borderRadius: 14, padding: spacing.md },
  infoLine: { fontSize: 13, marginBottom: spacing.xs },
});
