import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { CARDS } from "../data";
import { colors, spacing } from "../theme";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Text style={styles.greeting}>Home</Text>
      <Text style={styles.subheading}>
        {CARDS.length} cards saved · research build
      </Text>

      <Pressable
        style={styles.teaser}
        // @ts-expect-error - simple tab navigation for this research build
        onPress={() => navigation.navigate("Recommend")}
      >
        <View>
          <Text style={styles.teaserTitle}>Quick card pick</Text>
          <Text style={styles.teaserSub}>
            Type a merchant, get the best card from your wallet
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>WHAT THIS BUILD DEMONSTRATES</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoLine}>• React Navigation bottom tabs</Text>
        <Text style={styles.infoLine}>• TypeScript data models (Card, RewardRule)</Text>
        <Text style={styles.infoLine}>
          • A real interactive flow: enter a merchant + amount, get a
          computed best-card recommendation
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  greeting: { fontSize: 26, fontWeight: "600", color: colors.textPrimary },
  subheading: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.lg },
  teaser: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teaserTitle: { color: colors.textPrimary, fontWeight: "600", fontSize: 15 },
  teaserSub: { color: colors.textMuted, fontSize: 12, marginTop: 2, maxWidth: 260 },
  chevron: { color: colors.textMuted, fontSize: 22 },
  sectionLabel: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  infoBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: spacing.md,
  },
  infoLine: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.xs },
});
