import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function CalculatorPage() {
  const { width, height } = useWindowDimensions();

  const CalcButtons = [
    {
      title: "C",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "%",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "Delete",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "Empty",
      color: "#005dac",
      textColor: "#FFFFFF",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "7",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "8",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "9",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "X",
      color: "#005dac",
      textColor: "#FFFFFF",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "4",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "5",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "6",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "-",
      color: "#005dac",
      textColor: "#FFFFFF",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "1",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "2",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "3",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "+",
      color: "#005dac",
      textColor: "#FFFFFF",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "EXPENSE",
      color: "#845100",
      textColor: "#FFFFFF",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "0",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: ".",
      color: "#e7e8e9",
      textColor: "",
      onPress: () => Alert.alert("Button pressed"),
    },
    {
      title: "=",
      color: "#1b6d24",
      textColor: "#FFFFFF",
      onPress: () => Alert.alert("Button pressed"),
    },
  ];
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.calc}>
        <View style={[styles.calcDisplay, { backgroundColor: "#e7e8e9" }]}>
          <Text style={styles.calcDisplayText}>0</Text>
        </View>

        <View style={[styles.ButtonSection, { backgroundColor: "#FFFFFF" }]}>
          {CalcButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, { backgroundColor: button.color }]}
              onPress={button.onPress}
            >
              <Text style={[styles.buttonText, { color: button.textColor }]}>
                {button.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calc: {
    width: "100%",
  },
  calcDisplay: {
    width: "100%",
    height: 250,
    backgroundColor: "e7e8e9",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  calcDisplayText: {
    fontSize: 30,
    textAlign: "right",
  },
  ButtonSection: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
  },
  button: {
    flexBasis: "24%",
    flexGrow: 1,
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
