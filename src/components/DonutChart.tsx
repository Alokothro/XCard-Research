import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../ThemeContext";
import { SpendSlice } from "../data";

const SIZE = 150;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ data }: { data: SpendSlice[] }) {
  const { colors, categoryColors } = useTheme();
  const total = data.reduce((sum, s) => sum + s.amount, 0);

  let offsetSoFar = 0;
  const arcs = data.map((slice) => {
    const fraction = slice.amount / total;
    const dash = fraction * CIRCUMFERENCE;
    const arc = {
      category: slice.category,
      color: categoryColors[slice.category] ?? colors.textMuted,
      dashArray: `${dash} ${CIRCUMFERENCE - dash}`,
      dashOffset: -offsetSoFar,
    };
    offsetSoFar += dash;
    return arc;
  });

  return (
    <View style={styles.row}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {arcs.map((arc) => (
            <Circle
              key={arc.category}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={arc.color}
              strokeWidth={STROKE}
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              fill="none"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          ))}
        </Svg>
        <View style={styles.centerLabel}>
          <Text style={[styles.amount, { color: colors.textPrimary }]}>${total}</Text>
          <Text style={[styles.label, { color: colors.textMuted }]}>SPENT</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {data.map((slice) => (
          <View key={slice.category} style={styles.legendRow}>
            <View
              style={[styles.swatch, { backgroundColor: categoryColors[slice.category] ?? colors.textMuted }]}
            />
            <Text style={[styles.legendName, { color: colors.textSecondary }]} numberOfLines={1}>
              {slice.category}
            </Text>
            <Text style={[styles.legendPct, { color: colors.textPrimary }]}>
              {Math.round((slice.amount / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 18 },
  centerLabel: {
    position: "absolute",
    top: STROKE,
    left: STROKE,
    right: STROKE,
    bottom: STROKE,
    borderRadius: (SIZE - STROKE * 2) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  amount: { fontSize: 18, fontWeight: "700" },
  label: { fontSize: 9, letterSpacing: 1, marginTop: 2 },
  legend: { flex: 1, gap: 7 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  swatch: { width: 9, height: 9, borderRadius: 2.5 },
  legendName: { flex: 1, fontSize: 12 },
  legendPct: { fontSize: 12, fontWeight: "600" },
});
