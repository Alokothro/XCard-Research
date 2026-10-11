import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../ThemeContext";
import { spacing } from "../theme";

const ROWS = ["Notifications", "Security & privacy", "Connected accounts", "Help & support"];

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <Text style={[styles.heading, { color: colors.textPrimary }]}>Settings</Text>

      <View
        style={[
          styles.row,
          { borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.md },
        ]}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 14 }}>Appearance</Text>
        <View style={[styles.segment, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Pressable
            onPress={() => setMode("dark")}
            style={[styles.segmentOption, mode === "dark" && { backgroundColor: colors.bronze }]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: mode === "dark" ? "#14100A" : colors.textMuted },
              ]}
            >
              DARK
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("light")}
            style={[styles.segmentOption, mode === "light" && { backgroundColor: colors.bronze }]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: mode === "light" ? "#14100A" : colors.textMuted },
              ]}
            >
              LIGHT
            </Text>
          </Pressable>
        </View>
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
        <View style={styles.row}>
          <Text style={{ color: colors.critical, fontSize: 14 }}>Log out</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  heading: { fontSize: 26, fontWeight: "600", padding: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
  segment: { flexDirection: "row", borderWidth: 1, borderRadius: 999, padding: 2 },
  segmentOption: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999 },
  segmentText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
});
