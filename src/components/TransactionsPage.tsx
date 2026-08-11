import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RADIUS, SPACING, TYPOGRAPHY, type AppColors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useTransactions, type Transaction } from "@/context/TransactionsContext";

type FilterKey = "All" | "Income" | "Expenses" | "Savings";

const FILTERS: FilterKey[] = ["All", "Income", "Expenses", "Savings"];

function formatMoney(value: number): string {
  const sign = value < 0 ? "-" : "";
  const formatted = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}$${formatted}`;
}

export default function TransactionsPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { transactions, addTransaction, totals } = useTransactions();

  const [filter, setFilter] = useState<FilterKey>("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = transactions;
    switch (filter) {
      case "Income":
        list = list.filter((t) => t.amount > 0);
        break;
      case "Expenses":
        list = list.filter((t) => t.amount < 0);
        break;
      case "Savings":
        list = list.filter((t) => t.category === "Savings");
        break;
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [transactions, filter, query]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.pageTitleRow}>
              <Text style={styles.pageTitle}>Transactions</Text>
              <TouchableOpacity
                onPress={() => setSearchOpen((prev) => !prev)}
                activeOpacity={0.7}
                hitSlop={8}
              >
                <MaterialIcons
                  name={searchOpen ? "close" : "search"}
                  size={22}
                  color={colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            {searchOpen && (
              <View style={styles.searchBar}>
                <MaterialIcons name="search" size={18} color={colors.onSurfaceVariant} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search by title or category"
                  placeholderTextColor={colors.onSurfaceVariant}
                  style={styles.searchInput}
                  autoFocus
                />
              </View>
            )}

            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
              <Text style={styles.balanceAmount}>{formatMoney(totals.balance)}</Text>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceRow}>
                <View style={styles.balanceStat}>
                  <View style={styles.balanceStatLabelRow}>
                    <MaterialIcons name="arrow-downward" size={13} color="#bcd8f7" />
                    <Text style={styles.balanceStatLabel}>Total Income</Text>
                  </View>
                  <Text style={styles.balanceStatAmount}>{formatMoney(totals.income)}</Text>
                </View>
                <View style={styles.balanceStat}>
                  <View style={styles.balanceStatLabelRow}>
                    <MaterialIcons name="arrow-upward" size={13} color="#bcd8f7" />
                    <Text style={styles.balanceStatLabel}>Total Expenses</Text>
                  </View>
                  <Text style={styles.balanceStatAmount}>{formatMoney(totals.expenses)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.chipRow}>
              {FILTERS.map((item) => {
                const active = item === filter;
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setFilter(item)}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>RECENT ACTIVITY</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => <TransactionRow item={item} styles={styles} colors={colors} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions in this filter yet.</Text>
        }
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => setAddOpen(true)}>
        <MaterialIcons name="add" size={26} color={colors.onPrimary} />
      </TouchableOpacity>

      <AddTransactionModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(t) => {
          addTransaction(t);
          setAddOpen(false);
        }}
        styles={styles}
        colors={colors}
      />
    </View>
  );
}

function TransactionRow({
  item,
  styles,
  colors,
}: {
  item: Transaction;
  styles: ReturnType<typeof createStyles>;
  colors: AppColors;
}) {
  const isExpense = item.amount < 0;
  return (
    <View style={styles.txnCard}>
      <View
        style={[
          styles.txnIndicator,
          { backgroundColor: isExpense ? colors.error : colors.secondary },
        ]}
      />
      <View style={styles.txnIconWrap}>
        <MaterialIcons name={item.icon} size={20} color={colors.onSurfaceVariant} />
      </View>
      <View style={styles.txnInfo}>
        <Text style={styles.txnTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.txnSubtitle} numberOfLines={1}>
          {item.date} · {item.category}
        </Text>
      </View>
      <View style={styles.txnAmountWrap}>
        <Text
          style={[
            styles.txnAmount,
            { color: isExpense ? colors.error : colors.secondary },
          ]}
        >
          {formatMoney(item.amount)}
        </Text>
        <Text style={styles.txnStatus}>{item.status}</Text>
      </View>
    </View>
  );
}

function AddTransactionModal({
  visible,
  onClose,
  onSubmit,
  styles,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (t: { title: string; category: string; amount: number; icon: keyof typeof MaterialIcons.glyphMap }) => void;
  styles: ReturnType<typeof createStyles>;
  colors: AppColors;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amountText, setAmountText] = useState("");
  const [kind, setKind] = useState<"Income" | "Expense">("Expense");

  const reset = () => {
    setTitle("");
    setCategory("");
    setAmountText("");
    setKind("Expense");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    const parsed = parseFloat(amountText);
    if (!title.trim() || isNaN(parsed) || parsed <= 0) return;
    onSubmit({
      title: title.trim(),
      category: category.trim() || "Others",
      amount: kind === "Expense" ? -Math.abs(parsed) : Math.abs(parsed),
      icon: kind === "Expense" ? "shopping-cart" : "payments",
    });
    reset();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.modalBackdrop} onPress={handleClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>Add Transaction</Text>

          <View style={styles.kindRow}>
            {(["Expense", "Income"] as const).map((k) => (
              <TouchableOpacity
                key={k}
                onPress={() => setKind(k)}
                style={[styles.kindChip, kind === k && styles.kindChipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.kindChipText, kind === k && styles.kindChipTextActive]}>
                  {k}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title (e.g. Coffee)"
            placeholderTextColor={colors.onSurfaceVariant}
            style={styles.modalInput}
          />
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Category (optional)"
            placeholderTextColor={colors.onSurfaceVariant}
            style={styles.modalInput}
          />
          <TextInput
            value={amountText}
            onChangeText={setAmountText}
            placeholder="Amount"
            placeholderTextColor={colors.onSurfaceVariant}
            keyboardType="decimal-pad"
            style={styles.modalInput}
          />

          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={handleClose} activeOpacity={0.7}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (COLORS: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    listContent: {
      padding: SPACING.containerPadding,
      paddingBottom: SPACING.xl * 2,
    },
    pageTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: SPACING.md,
    },
    pageTitle: {
      ...TYPOGRAPHY.bodyLg,
      fontWeight: "600",
      color: COLORS.onSurface,
    },

    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.xs,
      backgroundColor: COLORS.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.sm,
      height: 40,
      marginBottom: SPACING.md,
    },
    searchInput: {
      flex: 1,
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurface,
    },

    balanceCard: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
    },
    balanceLabel: {
      ...TYPOGRAPHY.labelMd,
      color: "#bcd8f7",
      marginBottom: SPACING.xs,
    },
    balanceAmount: {
      fontSize: 34,
      fontWeight: "700",
      color: COLORS.onPrimary,
    },
    balanceDivider: {
      height: 1,
      backgroundColor: "rgba(255,255,255,0.2)",
      marginVertical: SPACING.md,
    },
    balanceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    balanceStat: {
      gap: 4,
    },
    balanceStatLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    balanceStatLabel: {
      ...TYPOGRAPHY.bodyMd,
      color: "#e3edf9",
    },
    balanceStatAmount: {
      ...TYPOGRAPHY.bodyLg,
      fontWeight: "700",
      color: COLORS.onPrimary,
    },

    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.xs,
      marginBottom: SPACING.lg,
    },
    chip: {
      paddingHorizontal: SPACING.md,
      height: 32,
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
      alignItems: "center",
      justifyContent: "center",
    },
    chipActive: {
      backgroundColor: COLORS.secondaryContainer,
      borderColor: COLORS.secondaryContainer,
    },
    chipText: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
    },
    chipTextActive: {
      color: COLORS.onSecondaryContainer,
      fontWeight: "600",
    },

    sectionHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    sectionHeader: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.onSurfaceVariant,
    },

    txnCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.surfaceContainerLowest,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
      marginBottom: SPACING.sm,
      overflow: "hidden",
      minHeight: 72,
    },
    txnIndicator: {
      width: 4,
      alignSelf: "stretch",
    },
    txnIconWrap: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.md,
      backgroundColor: COLORS.surfaceContainerHigh,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: SPACING.sm,
    },
    txnInfo: {
      flex: 1,
      marginLeft: SPACING.sm,
      paddingVertical: SPACING.sm,
    },
    txnTitle: {
      ...TYPOGRAPHY.bodyLg,
      color: COLORS.onSurface,
      fontWeight: "600",
    },
    txnSubtitle: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
      marginTop: 2,
    },
    txnAmountWrap: {
      alignItems: "flex-end",
      paddingHorizontal: SPACING.md,
    },
    txnAmount: {
      ...TYPOGRAPHY.bodyLg,
      fontWeight: "700",
    },
    txnStatus: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.onSurfaceVariant,
      marginTop: 2,
    },

    emptyText: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
      textAlign: "center",
      marginTop: SPACING.xl,
    },

    fab: {
      position: "absolute",
      right: SPACING.lg,
      bottom: SPACING.lg,
      width: 56,
      height: 56,
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },

    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center",
      justifyContent: "center",
      padding: SPACING.lg,
    },
    modalCard: {
      width: "100%",
      maxWidth: 420,
      backgroundColor: COLORS.surfaceContainerLowest,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      gap: SPACING.sm,
    },
    modalTitle: {
      ...TYPOGRAPHY.titleLg,
      color: COLORS.onSurface,
      marginBottom: SPACING.xs,
    },
    kindRow: {
      flexDirection: "row",
      gap: SPACING.sm,
      marginBottom: SPACING.xs,
    },
    kindChip: {
      flex: 1,
      height: 36,
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
      alignItems: "center",
      justifyContent: "center",
    },
    kindChipActive: {
      backgroundColor: COLORS.secondaryContainer,
      borderColor: COLORS.secondaryContainer,
    },
    kindChipText: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
    },
    kindChipTextActive: {
      color: COLORS.onSecondaryContainer,
      fontWeight: "600",
    },
    modalInput: {
      height: 44,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      color: COLORS.onSurface,
      ...TYPOGRAPHY.bodyMd,
    },
    modalButtonRow: {
      flexDirection: "row",
      gap: SPACING.sm,
      marginTop: SPACING.sm,
    },
    modalCancelButton: {
      flex: 1,
      height: 44,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
      alignItems: "center",
      justifyContent: "center",
    },
    modalCancelText: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurface,
      fontWeight: "600",
    },
    modalSaveButton: {
      flex: 1,
      height: 44,
      borderRadius: RADIUS.md,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    modalSaveText: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onPrimary,
      fontWeight: "600",
    },
  });
