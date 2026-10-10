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
import { CARDS, CATEGORIES, Category, inferCategory } from "../data";
import { recommendCard, Recommendation } from "../logic";
import { colors, spacing } from "../theme";

export default function RecommendScreen() {
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
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Quick Recommendation</Text>
          <Text style={styles.subheading}>Tell XCard where you're shopping.</Text>

          <Text style={styles.label}>MERCHANT OR PURCHASE</Text>
          <TextInput
            value={merchant}
            onChangeText={handleMerchantChange}
            placeholder="Starbucks"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          {category && (
            <View style={styles.categoryBox}>
              <Text style={styles.categoryLabel}>AUTO-CATEGORIZED</Text>
              <Text style={styles.categoryValue}>
                {merchant.trim() || "This purchase"} → {category}
              </Text>
              <Text style={styles.categoryHint}>
                Not right? Pick a different category below.
              </Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => {
                      setCategory(c);
                      setResult(null);
                    }}
                    style={[
                      styles.categoryChip,
                      c === category && styles.categoryChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        c === category && styles.categoryChipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <Text style={styles.label}>AMOUNT</Text>
          <TextInput
            value={amount}
            onChangeText={(t) => {
              setAmount(t);
              setResult(null);
            }}
            placeholder="25.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          {showAmountError && (
            <Text style={styles.errorText}>Enter an amount greater than $0.</Text>
          )}

          <Pressable
            style={[styles.button, !category && styles.buttonDisabled]}
            onPress={handleFindCard}
            disabled={!category}
          >
            <Text style={styles.buttonText}>Find best card</Text>
          </Pressable>

          {result && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>BEST MATCH</Text>
              <Text style={styles.resultCard}>{result.card.name}</Text>
              <Text style={styles.resultReward}>
                Estimated reward: ${result.estimatedReward.toFixed(2)}
              </Text>
              <Text style={styles.resultReason}>{result.reason}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  heading: { fontSize: 24, fontWeight: "600", color: colors.textPrimary },
  subheading: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.lg },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
  errorText: { color: colors.critical, fontSize: 12, marginTop: spacing.xs },
  categoryBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  categoryLabel: { fontSize: 10, color: colors.textMuted, letterSpacing: 1 },
  categoryValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  categoryHint: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.sm },
  categoryChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  categoryChipActive: { backgroundColor: colors.bronze, borderColor: colors.bronze },
  categoryChipText: { color: colors.textSecondary, fontSize: 12 },
  categoryChipTextActive: { color: "#14100A", fontWeight: "600" },
  button: {
    backgroundColor: colors.bronze,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: "#14100A", fontWeight: "600", fontSize: 15 },
  resultBox: {
    backgroundColor: colors.surface,
    borderColor: colors.bronzeStrong,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  resultLabel: { fontSize: 11, color: colors.bronze, letterSpacing: 1 },
  resultCard: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  resultReward: { fontSize: 15, color: colors.bronze, marginTop: spacing.xs },
  resultReason: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm },
});
