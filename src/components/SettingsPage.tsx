import { RADIUS, SPACING, TYPOGRAPHY, type AppColors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useTransactions } from "@/context/TransactionsContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Row {
  key: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  title: string;
  titleColor?: string;
  subtitle: string;
  accessory?: "chevron" | "chevron-down";
}

const PREFERENCE_ROWS: Row[] = [
  {
    key: "currency",
    icon: "attach-money",
    title: "Base Currency",
    subtitle: "US Dollar (USD)",
    accessory: "chevron-down",
  },
  {
    key: "history",
    icon: "history",
    title: "Calculation History",
    subtitle: "Store for 30 days",
    accessory: "chevron",
  },
];

export default function SettingsPage() {
  const { colors, isDark, toggleDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { transactions, clearAll } = useTransactions();

  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const handleBackup = () => {
    const now = new Date();
    setLastBackup(
      now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    );
  };

  const handleClearData = () => {
    if (transactions.length === 0) return;
    Alert.alert(
      "Clear All Data",
      `This will permanently delete all ${transactions.length} transaction${transactions.length === 1 ? "" : "s"}. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear Data", style: "destructive", onPress: clearAll },
      ],
    );
  };

  function SectionLabel({ children }: { children: string }) {
    return <Text style={styles.sectionLabel}>{children}</Text>;
  }

  function Card({ children }: { children: ReactNode }) {
    return <View style={styles.card}>{children}</View>;
  }

  function Divider() {
    return <View style={styles.divider} />;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Account */}
      <SectionLabel>ACCOUNT</SectionLabel>
      <Card>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AT</Text>
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Alex Thompson</Text>
            <Text style={styles.rowSubtitle}>alex.thompson@calq.finance</Text>
          </View>
        </View>
      </Card>

      {/* Preferences */}
      <SectionLabel>PREFERENCES</SectionLabel>
      <Card>
        {PREFERENCE_ROWS.map((item, index) => (
          <View key={item.key}>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={item.iconColor ?? colors.primary}
                />
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            {index < PREFERENCE_ROWS.length - 1 && <Divider />}
          </View>
        ))}
        <Divider />
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="dark-mode" size={20} color={colors.primary} />
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Dark Mode</Text>
            <Text style={styles.rowSubtitle}>{isDark ? "On" : "Off"}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleDark}
            trackColor={{
              false: colors.surfaceContainerHigh,
              true: colors.primary,
            }}
            thumbColor={colors.surfaceContainerLowest}
          />
        </View>
      </Card>

      {/* Data */}
      <SectionLabel>DATA</SectionLabel>
      <Card>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="storage" size={20} color={colors.primary} />
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Local Backup</Text>
            <Text style={styles.rowSubtitle}>
              {lastBackup ? `Last backup: ${lastBackup}` : "Never backed up"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.backupButton}
            activeOpacity={0.8}
            onPress={handleBackup}
          >
            <Text style={styles.backupButtonText}>BACKUP</Text>
          </TouchableOpacity>
        </View>
        <Divider />
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={handleClearData}
        >
          <View style={[styles.iconWrap, styles.iconWrapError]}>
            <MaterialIcons
              name="delete-forever"
              size={20}
              color={colors.error}
            />
          </View>
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.error }]}>
              Clear All Data
            </Text>
            <Text style={styles.rowSubtitle}>
              {transactions.length} transaction
              {transactions.length === 1 ? "" : "s"} stored · permanent action
            </Text>
          </View>
        </TouchableOpacity>
      </Card>

      {/* About */}
      <SectionLabel>ABOUT</SectionLabel>
      <Card>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>App Version</Text>
            <Text style={[styles.rowSubtitle, styles.mono]}>v2.4.1-stable</Text>
          </View>
        </View>
        <Divider />
        <View style={[styles.row, styles.aboutRow]}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Developed by</Text>
            <Text style={styles.rowSubtitle}>HBE Team © 2024</Text>
            <Text style={styles.aboutBody}>
              CalQ is built to provide maximum financial clarity through
              high-precision calculations and robust local data storage.
            </Text>
          </View>
        </View>
      </Card>
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
      paddingBottom: SPACING.xl * 2,
    },

    sectionLabel: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.primary,
      marginTop: SPACING.lg,
      marginBottom: SPACING.sm,
    },

    card: {
      backgroundColor: COLORS.surfaceContainerLowest,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: COLORS.outlineVariant,
      overflow: "hidden",
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.outlineVariant,
      marginLeft: SPACING.md + 40 + SPACING.md, // aligns with text, not the icon
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      padding: SPACING.md,
      gap: SPACING.md,
    },
    aboutRow: {
      alignItems: "flex-start",
    },

    avatar: {
      width: 44,
      height: 44,
      borderRadius: RADIUS.full,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      ...TYPOGRAPHY.bodyMd,
      fontWeight: "700",
      color: COLORS.onPrimary,
    },

    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.md,
      backgroundColor: COLORS.surfaceContainerHigh,
      alignItems: "center",
      justifyContent: "center",
    },
    iconWrapError: {
      backgroundColor: COLORS.errorContainer,
    },

    rowInfo: {
      flex: 1,
      gap: 2,
    },
    rowTitle: {
      ...TYPOGRAPHY.bodyLg,
      color: COLORS.onSurface,
      fontWeight: "600",
    },
    rowSubtitle: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
    },
    mono: {
      fontFamily: "JetBrainsMono_500Medium",
    },
    aboutBody: {
      ...TYPOGRAPHY.bodyMd,
      color: COLORS.onSurfaceVariant,
      marginTop: SPACING.xs,
    },

    backupButton: {
      backgroundColor: COLORS.primary,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
    },
    backupButtonText: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.onPrimary,
    },
  });
