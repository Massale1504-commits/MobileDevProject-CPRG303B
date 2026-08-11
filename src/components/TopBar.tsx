import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type TopBarProps = {
  title?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export default function TopBar({ title = "CalQ", icon }: TopBarProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        {icon ? (
          <MaterialIcons name={icon} size={24} color="#0871ce" />
        ) : null}
        <Text style={styles.TextHeader}>{title}</Text>
      </View>
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

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  TextHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0871ce",
  },
});
