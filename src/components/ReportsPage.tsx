import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { RADIUS, SPACING, TYPOGRAPHY, type AppColors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useTransactions } from "@/context/TransactionsContext";

// Screens at or above this width get the two-column layout used in the
// original html mockup instead of a stacked single column.
const WIDE_BREAKPOINT = 700;

// Placeholder monthly budget until the app has a real budgeting feature.
const MONTHLY_BUDGET = 3000;

interface DonutSegment {
  label: string;
  amount: number;
  percent: number;
  color: string;
}

function DonutChart({
  segments,
  trackColor,
  size = 176,
}: {
  segments: DonutSegment[];
  trackColor: string;
  size?: number;
}) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {segments.map((segment) => {
        const dash = (segment.percent / 100) * circumference;
        const node = (
          <Circle
            key={segment.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={segment.color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        );
        offset += dash;
        return node;
      })}
    </Svg>
  );
}

function formatMoney(value: number): string {
  return `$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function ReportsPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { transactions, totals } = useTransactions();

  const spendBreakdown = useMemo<DonutSegment[]>(() => {
    const palette = [colors.primary, colors.secondary, colors.tertiary, colors.error, colors.outline];
    const byCategory = new Map<string, number>();
    transactions
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + Math.abs(t.amount));
      });
    const entries = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, amt]) => sum + amt, 0);
    return entries.map(([label, amount], index) => ({
      label,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: palette[index % palette.length],
    }));
  }, [transactions, colors]);

  const topCategory = spendBreakdown[0];
  const budgetPercent = MONTHLY_BUDGET > 0 ? Math.min(100, Math.round((totals.expenses / MONTHLY_BUDGET) * 100)) : 0;
  const budgetRemaining = Math.max(0, MONTHLY_BUDGET - totals.expenses);

  const maxBar = Math.max(totals.income, totals.expenses, 1);

  const insights = useMemo(() => {
    const items: { icon: string; color: string; title: string; body: string }[] = [];
    if (topCategory) {
      items.push({
        icon: "💰",
        color: colors.primary,
        title: "Top Spending Category",
        body: `${topCategory.label} makes up ${topCategory.percent}% of your spending (${formatMoney(topCategory.amount)}).`,
      });
    }
    items.push({
      icon: totals.balance >= 0 ? "✔️" : "⚠️",
      color: totals.balance >= 0 ? colors.secondary : colors.error,
      title: totals.balance >= 0 ? "Positive Balance" : "Spending More Than Earning",
      body:
        totals.balance >= 0
          ? `You're up ${formatMoney(totals.balance)} across all logged transactions.`
          : `You're down ${formatMoney(totals.balance)} across all logged transactions.`,
    });
    items.push({
      icon: "📊",
      color: colors.tertiary,
      title: "Activity",
      body: `${transactions.length} transaction${transactions.length === 1 ? "" : "s"} logged so far.`,
    });
    return items;
  }, [topCategory, totals, transactions.length, colors]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Budget status */}
      <View style={styles.card}>
        <View style={styles.budgetHeaderRow}>
          <Text style={styles.cardTitle}>Main Budget</Text>
          <Text style={styles.budgetPercent}>{budgetPercent}% Spent</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${budgetPercent}%` }]} />
        </View>
        <Text style={styles.caption}>
          You have {formatMoney(budgetRemaining)} left of your {formatMoney(MONTHLY_BUDGET)} budget.
        </Text>
      </View>

      {/* Spend breakdown + income vs expenses */}
      <View style={[styles.row, isWide && styles.rowWide]}>
        <View style={[styles.card, styles.outlinedCard, isWide && styles.halfWidth]}>
          <Text style={[styles.cardTitle, styles.blockTitle]}>Spend Breakdown</Text>
          {spendBreakdown.length > 0 ? (
            <>
              <View style={styles.donutWrap}>
                <DonutChart segments={spendBreakdown} trackColor={colors.surfaceVariant} />
                <View style={styles.donutCenter}>
                  <Text style={styles.donutLabel}>TOTAL</Text>
                  <Text style={styles.donutAmount}>{formatMoney(totals.expenses)}</Text>
                </View>
              </View>
              <View style={styles.legendGrid}>
                {spendBreakdown.map((segment) => (
                  <View key={segment.label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
                    <Text style={styles.legendText}>
                      {segment.label} ({segment.percent}%)
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.caption}>No expenses logged yet.</Text>
          )}
        </View>

        <View style={[styles.card, styles.outlinedCard, isWide && styles.halfWidth]}>
          <Text style={[styles.cardTitle, styles.blockTitle]}>Income vs Expenses</Text>
          <View style={styles.barChartRow}>
            <View style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[styles.bar, styles.barPrimary, { height: `${(totals.income / maxBar) * 100}%` }]}
                />
              </View>
              <Text style={styles.barCaption}>Income</Text>
              <Text style={[styles.barAmount, { color: colors.primary }]}>{formatMoney(totals.income)}</Text>
            </View>
            <View style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[styles.bar, styles.barMuted, { height: `${(totals.expenses / maxBar) * 100}%` }]}
                />
              </View>
              <Text style={styles.barCaption}>Expenses</Text>
              <Text style={styles.barAmount}>{formatMoney(totals.expenses)}</Text>
            </View>
          </View>
          <View style={styles.insightBanner}>
            <Text style={[{ fontSize: 20, lineHeight: 24 }, { color: colors.onSecondaryContainer }]}>
              {totals.balance >= 0 ? "↑" : "↓"}
            </Text>
            <Text style={styles.insightBannerText}>
              Net balance is{" "}
              <Text style={{ fontWeight: "700" }}>{formatMoney(totals.balance)}</Text>
              {totals.balance >= 0 ? " in your favor." : " in the red."}
            </Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={[styles.row, isWide && styles.rowWide]}>
        {insights.map((insight) => (
          <View key={insight.title} style={[styles.insightCard, isWide && styles.thirdWidth]}>
            <Text style={[{ fontSize: 22, lineHeight: 28 }, { color: insight.color }]}>{insight.icon}</Text>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightBody}>{insight.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (COLORS: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      padding: SPACING.containerPadding,
      gap: SPACING.lg,
      paddingBottom: SPACING.xl * 2,
    },

    card: {
      backgroundColor: COLORS.surfaceContainerLow,
      borderRadius: RADIUS.xl,
      padding: SPACING.md,
    },
    outlinedCard: {
      backgroundColor: COLORS.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
    },
    cardTitle: {
      ...TYPOGRAPHY.titleLg,
      color: COLORS.onSurface,
    },
    blockTitle: {
      marginBottom: SPACING.md,
    },

    budgetHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    budgetPercent: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.primary,
    },
    progressTrack: {
      height: 12,
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.surfaceVariant,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.primary,
    },
    caption: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
      marginTop: SPACING.sm,
    },

    row: {
      gap: SPACING.md,
    },
    rowWide: {
      flexDirection: "row",
    },
    halfWidth: {
      flex: 1,
    },
    thirdWidth: {
      flex: 1,
    },

    donutWrap: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SPACING.lg,
    },
    donutCenter: {
      position: "absolute",
      alignItems: "center",
    },
    donutLabel: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.onSurfaceVariant,
    },
    donutAmount: {
      ...TYPOGRAPHY.headlineMd,
      color: COLORS.onSurface,
    },
    legendGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.sm,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.xs,
      width: "45%",
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: RADIUS.full,
    },
    legendText: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurface,
    },

    barChartRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: SPACING.lg,
      marginBottom: SPACING.md,
    },
    barColumn: {
      flex: 1,
      alignItems: "center",
      gap: SPACING.xs,
    },
    barTrack: {
      width: "100%",
      height: 140,
      borderRadius: RADIUS.md,
      backgroundColor: COLORS.surfaceContainerHigh,
      justifyContent: "flex-end",
      overflow: "hidden",
    },
    bar: {
      width: "100%",
      borderRadius: RADIUS.md,
    },
    barMuted: {
      backgroundColor: COLORS.outlineVariant,
    },
    barPrimary: {
      backgroundColor: COLORS.primary,
    },
    barCaption: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.onSurfaceVariant,
    },
    barAmount: {
      ...TYPOGRAPHY.bodyMd,
      fontWeight: "700",
      color: COLORS.onSurface,
    },

    insightBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
      backgroundColor: COLORS.secondaryContainer,
      borderRadius: RADIUS.md,
      padding: SPACING.sm,
    },
    insightBannerText: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSecondaryContainer,
      flex: 1,
      flexWrap: "wrap",
    },

    insightCard: {
      backgroundColor: COLORS.surfaceContainer,
      borderRadius: RADIUS.xl,
      padding: SPACING.md,
      gap: SPACING.xs,
    },
    insightTitle: {
      ...TYPOGRAPHY.bodyLg,
      fontWeight: "700",
      color: COLORS.onSurface,
    },
    insightBody: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
    },
  });
