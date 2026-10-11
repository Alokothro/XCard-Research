import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { CARDS, CATEGORIES, Category, inferCategory } from "../data";
import { recommendCard, Recommendation } from "../logic";
import { spacing } from "../theme";
import { useTheme } from "../ThemeContext";

export default function RecommendScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [touched, setTouched] = useState(false);

  function handleMerchantChange(text: string) {
    setMerchant(text);
    setResult(null);
    if (text.trim().length > 0) {
      setCategory(inferCategory(text));
    } else {
      setCategory(null);
    }
  }

  function handleFindCard() {
    setTouched(true);
    const parsedAmount = parseFloat(amount);
    if (!category || isNaN(parsedAmount) || parsedAmount <= 0) {
      setResult(null);
      return;
    }
    setResult(recommendCard(CARDS, category, parsedAmount));
  }

  const showAmountError = touched && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.closeButton, { backgroundColor: colors.surfaceAlt }]}
            hitSlop={8}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 18, lineHeight: 18 }}>{"✕"}</Text>
          </Pressable>

          <Text style={[styles.heading, { color: colors.textPrimary }]}>Quick Recommendation</Text>
          <Text style={[styles.subheading, { color: colors.textMuted }]}>Tell XCard where you're shopping.</Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>MERCHANT OR PURCHASE</Text>
          <TextInput
            value={merchant}
            onChangeText={handleMerchantChange}
            placeholder="Starbucks"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          />

          {category && (
            <View style={[styles.categoryBox, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.categoryLabel, { color: colors.textMuted }]}>AUTO-CATEGORIZED</Text>
              <Text style={[styles.categoryValue, { color: colors.textPrimary }]}>
                {merchant.trim() || "This purchase"} {"→"} {category}
              </Text>
              <Text style={[styles.categoryHint, { color: colors.textSecondary }]}>
                Not right? Pick a different category below.
              </Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((c) => {
                  const active = c === category;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => {
                        setCategory(c);
                        setResult(null);
                      }}
                      style={[
                        styles.categoryChip,
                        { borderColor: colors.border },
                        active && { backgroundColor: colors.bronze, borderColor: colors.bronze },
                      ]}
                    >
                      <Text style={{ color: active ? "#14100A" : colors.textSecondary, fontSize: 12, fontWeight: active ? "600" : "400" }}>
                        {c}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <Text style={[styles.label, { color: colors.textMuted }]}>AMOUNT</Text>
          <TextInput
            value={amount}
            onChangeText={(t) => {
              setAmount(t);
              setResult(null);
            }}
            placeholder="25.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
          />
          {showAmountError && (
            <Text style={{ color: colors.critical, fontSize: 12, marginTop: spacing.xs }}>
              Enter an amount greater than $0.
            </Text>
          )}

          <Pressable
            style={[
              styles.button,
              { backgroundColor: category ? colors.bronze : colors.bronze + "66" },
            ]}
            onPress={handleFindCard}
            disabled={!category}
          >
            <Text style={styles.buttonText}>Find best card</Text>
          </Pressable>

          {result && (
            <View style={[styles.resultBox, { backgroundColor: colors.surface, borderColor: colors.bronzeStrong }]}>
              <Text style={[styles.resultLabel, { color: colors.bronze }]}>BEST MATCH</Text>
              <Text style={[styles.resultCard, { color: colors.textPrimary }]}>{result.card.name}</Text>
              <Text style={[styles.resultReward, { color: colors.bronze }]}>
                Estimated reward: ${result.estimatedReward.toFixed(2)}
              </Text>
              <Text style={[styles.resultReason, { color: colors.textSecondary }]}>{result.reason}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  heading: { fontSize: 24, fontWeight: "600" },
  subheading: { fontSize: 13, marginBottom: spacing.lg },
  label: { fontSize: 11, letterSpacing: 1, marginBottom: spacing.xs, marginTop: spacing.md },
  input: { borderWidth: 1, borderRadius: 12, padding: spacing.md, fontSize: 16 },
  categoryBox: { borderRadius: 14, padding: spacing.md, marginTop: spacing.md },
  categoryLabel: { fontSize: 10, letterSpacing: 1 },
  categoryValue: { fontSize: 15, fontWeight: "600", marginTop: spacing.xs },
  categoryHint: { fontSize: 12, marginTop: spacing.xs },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.sm },
  categoryChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  button: { borderRadius: 14, padding: spacing.md, alignItems: "center", marginTop: spacing.lg },
  buttonText: { color: "#14100A", fontWeight: "600", fontSize: 15 },
  resultBox: { borderWidth: 1, borderRadius: 14, padding: spacing.md, marginTop: spacing.lg },
  resultLabel: { fontSize: 11, letterSpacing: 1 },
  resultCard: { fontSize: 20, fontWeight: "700", marginTop: spacing.xs },
  resultReward: { fontSize: 15, marginTop: spacing.xs },
  resultReason: { fontSize: 13, marginTop: spacing.sm },
});
