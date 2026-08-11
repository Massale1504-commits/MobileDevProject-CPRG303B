// Removed dependency on @expo-google-fonts to avoid module resolution errors.
// Using a simple flag for fontsLoaded to skip the loading state when the
// google-fonts packages are not available in the environment.
import { LIGHT_COLORS } from "@/constants/theme";
import { ThemeProvider } from "@/context/ThemeContext";
import { TransactionsProvider } from "@/context/TransactionsContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Renamed from the original `TabLayout` - this file is now the app-wide
// root layout; the actual tab navigator lives in app/(tabs)/_layout.tsx.
export default function RootLayout() {
  const fontsLoaded = true;

  // Keep this brief - it only shows for the first frame or two while the
  // Google Fonts are loaded from cache/bundle. Uses the static light
  // palette since ThemeProvider hasn't mounted yet at this point.
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: LIGHT_COLORS.background }}>
          <ActivityIndicator color={LIGHT_COLORS.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TransactionsProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </TransactionsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
