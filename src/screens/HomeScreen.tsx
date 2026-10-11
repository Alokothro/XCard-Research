import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { CARDS } from "../data";
import { spacing } from "../theme";
import { useTheme } from "../ThemeContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <Text style={[styles.greeting, { color: colors.textPrimary }]}>Home</Text>
      <Text style={[styles.subheading, { color: colors.textMuted }]}>
        {CARDS.length} cards saved · research build
      </Text>

      <Pressable
        style={[styles.teaser, { backgroundColor: colors.surface, borderColor: colors.border }]}
        // @ts-expect-error - simple tab navigation for this research build
        onPress={() => navigation.navigate("Recommend")}
      >
        <View>
          <Text style={[styles.teaserTitle, { color: colors.textPrimary }]}>Quick card pick</Text>
          <Text style={[styles.teaserSub, { color: colors.textMuted }]}>
            Type a merchant, get the best card from your wallet
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.textMuted }]}>{"›"}</Text>
      </Pressable>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>WHAT THIS BUILD DEMONSTRATES</Text>
      <View style={[styles.infoBox, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.infoLine, { color: colors.textSecondary }]}>{"•"} React Navigation bottom tabs, light/dark theme</Text>
        <Text style={[styles.infoLine, { color: colors.textSecondary }]}>{"•"} TypeScript data models (Card, RewardRule)</Text>
        <Text style={[styles.infoLine, { color: colors.textSecondary }]}>
          {"•"} A real interactive flow: enter a merchant + amount, get a
          computed best-card recommendation
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.md },
  greeting: { fontSize: 26, fontWeight: "600" },
  subheading: { fontSize: 13, marginBottom: spacing.lg },
  teaser: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teaserTitle: { fontWeight: "600", fontSize: 15 },
  teaserSub: { fontSize: 12, marginTop: 2, maxWidth: 260 },
  chevron: { fontSize: 22 },
  sectionLabel: { fontSize: 11, letterSpacing: 1, marginTop: spacing.xl, marginBottom: spacing.sm },
  infoBox: { borderRadius: 14, padding: spacing.md },
  infoLine: { fontSize: 13, marginBottom: spacing.xs },
});
