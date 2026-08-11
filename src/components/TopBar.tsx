import { useMemo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type AppColors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

interface TopBarProps {
  // Defaults to the "CalQ" brand wordmark (Calculator + Transactions).
  // Pass a section name ("Reports", "Settings", ...) for the other tabs.
  title?: string;
  // Small leading icon, e.g. "receipt-long" for Transactions or
  // "account-balance-wallet" for Reports. Omit for the plain brand mark.
  icon?: keyof typeof MaterialIcons.glyphMap;
  // Shows a search icon before the account icon (used on Transactions).
  showSearch?: boolean;
  onSearchPress?: () => void;
  onAccountPress?: () => void;
}

export default function TopBar({
  title = "CalQ",
  icon,
  showSearch = false,
  onSearchPress,
  onAccountPress,
}: TopBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={22}
            color={colors.primary}
            style={styles.leadingIcon}
          />
        )}
        <Text style={styles.TextHeader}>{title}</Text>
      </View>

      <View style={styles.right}>
        {showSearch && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <MaterialIcons name="search" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onAccountPress}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <MaterialIcons name="account-circle" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (COLORS: AppColors) =>
  StyleSheet.create({
    header: {
      height: 60,
      width: "100%",

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: 16,

      backgroundColor: COLORS.surfaceContainerLowest,

      borderBottomWidth: 1,
      borderBottomColor: COLORS.outlineVariant,
    },

    left: {
      flexDirection: "row",
      alignItems: "center",
    },

    leadingIcon: {
      marginRight: 8,
    },

    TextHeader: {
      fontSize: 24,
      fontWeight: "bold",
      color: COLORS.primary,
    },

    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    iconButton: {
      padding: 4,
    },
  });
