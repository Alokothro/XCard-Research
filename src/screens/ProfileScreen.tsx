import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../ThemeContext";
import { spacing } from "../theme";

const ROWS = ["Personal info", "Linked cards (4)", "Notifications", "Security & privacy"];

export default function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.head}>
        <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderStrong }]}>
          <Text style={[styles.avatarLetter, { color: colors.bronze }]}>D</Text>
        </View>
        <Text style={[styles.name, { color: colors.textPrimary }]}>Denise Alvarez</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>Member since Sept 2026</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.md }}>
        {ROWS.map((label, i) => (
          <View
            key={label}
            style={[
              styles.row,
              i < ROWS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 14 }}>{label}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 18 }}>{"›"}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  head: { alignItems: "center", paddingTop: spacing.xl, paddingBottom: spacing.md },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarLetter: { fontSize: 24, fontWeight: "600" },
  name: { fontSize: 19, fontWeight: "600" },
  sub: { fontSize: 12.5, marginTop: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
});
