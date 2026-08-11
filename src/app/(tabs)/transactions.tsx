import TopBar from "@/components/TopBar";
import { StyleSheet, View } from "react-native";
import TransactionsPage from "@/components/TransactionsPage";

export default function Transactions() {
  return (
    <View style={styles.container}>
      <TopBar title="Transactions" icon="receipt-long" />
      <View style={styles.content}>
        <TransactionsPage />
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
