import TopBar from "@/components/TopBar";
import { StyleSheet, View } from "react-native";
import CalculatorPage from "../components/CalculatorPage";

export default function Index() {
  return (
    <View style={styles.container}>
      <TopBar />
      <CalculatorPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
