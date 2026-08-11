import TopBar from "@/components/TopBar";
import { StyleSheet, View } from "react-native";
import CalculatorPage from "@/components/CalculatorPage";

export default function Index() {
  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <CalculatorPage />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // Fills all space left over after the TopBar, so CalculatorPage
    // never has to guess the screen height itself.
    flex: 1,
    width: "100%",
  },
});
