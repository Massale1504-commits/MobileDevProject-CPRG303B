import TopBar from "@/components/TopBar";
import { StyleSheet, View } from "react-native";
import SettingsPage from "@/components/SettingsPage";

export default function Settings() {
  return (
    <View style={styles.container}>
      <TopBar title="Settings" icon="settings" />
      <View style={styles.content}>
        <SettingsPage />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
  },
});
