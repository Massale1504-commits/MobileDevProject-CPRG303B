import { TYPOGRAPHY, type AppColors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomNavBarProps = {
  state: {
    index: number;
    routes: Array<{ name: string; key: string }>;
  };
  navigation: {
    emit: (...args: any[]) => any;
    navigate: (name: string) => void;
  };
};

// Maps each route's file name (app/(tabs)/<name>.tsx) to the icon + label
// shown in the bar. Kept separate from route `options` so we don't have to
// fight React Navigation's option typings for custom fields.
const TAB_CONFIG: Record<string, { label: string; icon: keyof typeof MaterialIcons.glyphMap }> = {
  index: { label: "Calculator", icon: "calculate" },
  transactions: { label: "Transactions", icon: "receipt-long" },
  reports: { label: "Reports", icon: "bar-chart" },
  settings: { label: "Settings", icon: "settings" },
};

export default function BottomNavBar({ state, navigation }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name] ?? {
          label: route.name,
          icon: "circle" as keyof typeof MaterialIcons.glyphMap,
        };
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <View style={[styles.tabInner, focused && styles.tabInnerActive]}>
              <MaterialIcons
                name={config.icon}
                size={22}
                color={focused ? colors.onPrimaryContainer : colors.onSurfaceVariant}
              />
              <Text
                style={[styles.label, focused && styles.labelActive]}
                numberOfLines={1}
              >
                {config.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (COLORS: AppColors) =>
  StyleSheet.create({
    bar: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-around",
      backgroundColor: COLORS.surface,
      borderTopWidth: 1,
      borderTopColor: COLORS.surfaceContainerHigh,
      paddingTop: 8,
      paddingHorizontal: 8,
    },
    tab: {
      flex: 1,
      alignItems: "center",
    },
    tabInner: {
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
      minWidth: 64,
    },
    tabInnerActive: {
      backgroundColor: COLORS.primaryContainer,
    },
    label: {
      ...TYPOGRAPHY.labelMd,
      color: COLORS.onSurfaceVariant,
    },
    labelActive: {
      color: COLORS.onPrimaryContainer,
    },
  });
