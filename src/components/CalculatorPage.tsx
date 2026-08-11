import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CalculatorPage() {
  const CalcButtons = [
    {
      title: "C",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "%",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "Delete",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "Empty",
      color: "#005dac",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "7",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "8",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "9",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "X",
      color: "#005dac",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "4",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "5",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "6",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "-",
      color: "#005dac",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "1",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "2",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "3",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "+",
      color: "#005dac",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "EXPENSE",
      color: "#845100",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "0",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: ".",
      color: "#e7e8e9",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "=",
      color: "#1b6d24",
      onPress: () => Alert.alert("Button pressed"),
    },
  ];
  return (
    <View style={styles.container}>
      <View></View>

      <View style={styles.container}>
        {CalcButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: button.color }]}
            onPress={button.onPress}
          >
            <Text style={styles.buttonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 8,
  },
  button: {
    width: "23%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#191c1d",
    fontWeight: "bold",
  },
});
