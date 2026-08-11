import { Tabs } from "expo-router";
import BottomNavBar from "@/components/BottomNavBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Calculator" }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions" }} />
      <Tabs.Screen name="reports" options={{ title: "Reports" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
