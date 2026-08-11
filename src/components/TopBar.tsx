import { StyleSheet, Text, View } from "react-native";

export default function TopBar() {
  return (
    <View style={styles.header}>
      <Text style={styles.TextHeader}>CalQ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,

    backgroundColor: "white",

    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  TextHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0871ce",
  },
});
