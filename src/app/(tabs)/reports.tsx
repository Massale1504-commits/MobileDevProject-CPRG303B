import TopBar from "@/components/TopBar";
import { StyleSheet, View } from "react-native";
import ReportsPage from "@/components/ReportsPage";

export default function Reports() {
  return (
    <View style={styles.container}>
      <TopBar title="Reports" icon="bar-chart" />
      <View style={styles.content}>
        <ReportsPage />
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
