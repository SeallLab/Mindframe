import { StyleSheet } from "react-native";
import { colors, type } from "../../theme";

const SIZE = 80;

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: SIZE,
    marginTop: -4,
  },
  value: {
    ...type.numeral,
    fontSize: 16,
    marginTop: -8,
  },
  label: {
    ...type.micro,
    color: colors.inkFaint,
    marginTop: 2,
  },
});
